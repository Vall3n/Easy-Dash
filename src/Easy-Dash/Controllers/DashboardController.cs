using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using LiteDB;
using Microsoft.Extensions.Options;

namespace EasyDash.Controllers
{
    [Route("api/[controller]")]
    public class DashboardController : Controller
    {
        private readonly IOptions<ConnectionStrings> _connectionStrings;

        public DashboardController(IOptions<ConnectionStrings> connectionStrings)
        {
            _connectionStrings = connectionStrings;
        }
        private static readonly string[] Status = {
            "Success", "Fail", "Pending"
        };

        private IEnumerable<DashboardResult> DashboardResults()
        {
            var rng = new Random();
            return Enumerable.Range(1, 20).Select(index => new DashboardResult
            {
                Id = index,
                Description = "Test service " + index,
                LastStatus = Status[rng.Next(Status.Length - 1)],
                LastUpdate = DateTime.Now.AddSeconds(rng.Next(-300, 0)),
                NextUpdate = DateTime.Now.AddSeconds(rng.Next(10, 300))
            });
        }

        [HttpGet("[action]")]
        public List<DashboardResult> Results()
        {
            using (var db = new LiteDatabase(_connectionStrings.Value.EasyDashDatabase))
            {
                var collection = db.GetCollection<DashboardResult>("dashboardresults");
                collection.Delete(x => x.Id > 0);
                foreach (var item in DashboardResults())
                {
                    collection.Insert(item);
                }

                collection.EnsureIndex(x => x.Id);

                var result = collection.FindAll()
                    .OrderBy(x => x.NextUpdate)
                    .ToList();
                return result;
            }
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
