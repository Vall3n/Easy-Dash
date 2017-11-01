using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace EasyDash.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        private static readonly string[] Status = new[]
        {
            "Success", "Fail", "Pending"
        };

        [HttpGet("[action]")]
        public IEnumerable<DashboardResult> DashboardResults()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new DashboardResult
            {
                Description = "Test service " + index,
                LastStatus = Status[rng.Next(Status.Length - 1)],
                LastUpdate = DateTime.Now.AddSeconds(rng.Next(-300, 0)),
                NextUpdate = DateTime.Now.AddSeconds(rng.Next(10, 300))
            });
        }

        public class DashboardResult
        {
            public string Description { get; set; }

            public string LastStatus { get; set; }
            public DateTime LastUpdate { get; set; }

            public DateTime NextUpdate { get; set; }
        }
    }
}
