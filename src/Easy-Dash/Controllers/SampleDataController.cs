using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using LiteDB;

namespace EasyDash.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        private static readonly string[] Status = {
            "Success", "Fail", "Pending"
        };

        [HttpGet("[action]")]
        public IEnumerable<DashboardResult> DashboardResults()
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
        public IEnumerable<dynamic> Configurations()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new
            {
                Id = index,
                Description = "Test service " + index,
                Url = "http://example/" + index,
                statusCode = 200,
                ContainsText = ""
            });
        }

        [HttpGet("[action]")]
        public IEnumerable<DashboardResult> SampleDataFromDb()
        {
            using (var db = new LiteDatabase("EasyDash.db"))
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
