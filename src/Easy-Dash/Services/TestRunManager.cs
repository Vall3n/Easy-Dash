using EasyDash.Models;
using Hangfire;
using LiteDB;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using EasyDash.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace EasyDash.Services
{
    public class TestRunManager : ITestRunManager
    {
        //public static TestRunManager Instance = new TestRunManager(null);

        private readonly IOptions<ConnectionStrings> _connectionStrings;
        private readonly IHubContext<DashboardHub> _hubContext;

        public TestRunManager(IOptions<ConnectionStrings> connectionStrings,  IHubContext<DashboardHub> hubContext)
        {
            _connectionStrings = connectionStrings;
            _hubContext = hubContext;
        }

        public void Initialize()
        {
            using (var db = new LiteDatabase(_connectionStrings.Value.EasyDashDatabase))
            {
                var collection = db.GetCollection<UrlConfiguration>("UrlConfigurations");
                var configurations = collection.FindAll().Where(r => r.Enabled).ToList();


                foreach (var configuration in configurations)
                {
                    RecurringJob.AddOrUpdate($"UrlConfiguration_{configuration.Id}", () => RunTest(configuration.Id), Cron.Minutely);
                }
            }
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
                await _hubContext.Clients.All.InvokeAsync("testEnded", id, testResult.Succeeded);
            }
        }
    }
}
