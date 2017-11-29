using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EasyDash.Models;
using EasyDash.Repositories;
using Hangfire;
using Microsoft.AspNetCore.Mvc;
using LiteDB;
using Microsoft.Extensions.Options;

namespace EasyDash.Controllers
{
    [Route("api/[controller]")]
    public class DashboardController : Controller
    {
        private readonly IOptions<ConnectionStrings> _connectionStrings;
        private readonly IConfigurationRepository _configurationRepository;

        public DashboardController(IOptions<ConnectionStrings> connectionStrings, IConfigurationRepository configurationRepository)
        {
            _connectionStrings = connectionStrings;
            _configurationRepository = configurationRepository;
        }
        private static readonly string[] Status = {
            "Success", "Fail", "Pending"
        };

        [HttpGet("[action]")]
        public async Task<IEnumerable<DashboardResult>> Results()
        {
            var collection = await _configurationRepository.Get();

            var result = collection
                .Select(TransformToDashboardResult)
                .OrderBy(x => x.NextUpdate);

            return result;
        }

        [HttpGet("[action]/{id}")]
        public async Task<DashboardResult> Find(int id)
        {
            var dashboardResult = await _configurationRepository.Get(id);

            var result = TransformToDashboardResult(dashboardResult);
            return result;
        }        

        public static DashboardResult TransformToDashboardResult(UrlConfiguration configuration)
        {
            if (configuration.UrlTestStatuses == null){
                configuration.UrlTestStatuses = new List<UrlTestStatus>();
            }

            var lastStatus = configuration.UrlTestStatuses.FirstOrDefault();

            var result = new DashboardResult
            {
                Id = configuration.Id,
                Description = configuration.Description,
            };

            if (lastStatus == default(UrlTestStatus))
            {
                result.LastStatus = Status[2];
            }
            else
            {
                result.LastStatus = lastStatus.Succeeded ? Status[0] : Status[1];
                result.LastUpdate = lastStatus.CompletedDateTime;

                if (configuration.Enabled)
                {
                    result.NextUpdate = result.LastUpdate.AddTicks(configuration.ScheduleTimeSpan.Ticks);
                }
            }

            return result;
        }

        public class DashboardResult
        {
            public int Id { get; set; }
            public string Description { get; set; }
            public string LastStatus { get; set; }
            public DateTime LastUpdate { get; set; }
            public DateTime NextUpdate { get; set; }
        }
    }
}
