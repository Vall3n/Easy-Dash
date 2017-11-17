using EasyDash.Models;
using Hangfire;
using LiteDB;
using Microsoft.Extensions.Options;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using EasyDash.Controllers;
using EasyDash.Hubs;
using EasyDash.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace EasyDash.Services
{
    public class TestRunManager : ITestRunManager
    {
        private readonly IOptions<ConnectionStrings> _connectionStrings;
        private readonly IHubContext<DashboardHub> _hubContext;

        public TestRunManager(IOptions<ConnectionStrings> connectionStrings, IHubContext<DashboardHub> hubContext)
        {
            _connectionStrings = connectionStrings;
            _hubContext = hubContext;
        }

        public void Initialize()
        {
            using (var db = new LiteDatabase(_connectionStrings.Value.EasyDashDatabase))
            {
                var collection = db.GetCollection<UrlConfiguration>("UrlConfigurations");
                var configurations = collection.FindAll().ToList();

                foreach (var configuration in configurations)
                {
                    AddOrUpdateSchedule(configuration);
                }
            }
        }

        public void AddOrUpdateSchedule(UrlConfiguration configuration)
        {
            var jobName = $"UrlConfiguration_{configuration.Id}";
            RecurringJob.RemoveIfExists(jobName);

            if (!configuration.Enabled)
                return;

            var span = configuration.ScheduleTimeSpan;
            string cron;
            if (span.TotalMinutes < 60)
                cron = $"*/{span.Minutes} * * * *";
            else
                cron = $"*/{span.Minutes} */{span.Hours} * * *";

            RecurringJob.AddOrUpdate(jobName, () => RunTest(configuration.Id), cron);
        }

        [DisplayName("UrlConfiguration #{0}.Id")]
        public async Task RunTest(int id)
        {
            var startTask = _hubContext.Clients.All.InvokeAsync("testStarted", id);
            using (var db = new LiteDatabase(_connectionStrings.Value.EasyDashDatabase))
            {
                var collection = db.GetCollection<UrlConfiguration>("UrlConfigurations");
                var configuration = collection.FindById(id);

                var runner = new UrlRunner();
                var testResult = await runner.Test(configuration);

                configuration.UrlTestStatuses.Insert(0, testResult);

                collection.Update(configuration);
                await startTask;
                //await _hubContext.Clients.All.InvokeAsync("testEnded", id, testResult.Succeeded);
                await _hubContext.Clients.All.InvokeAsync("testEnded", DashboardController.TransformToDashboardResult(configuration));
            }
        }
    }
}
