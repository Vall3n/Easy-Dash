using System;
using System.Collections.Generic;
using System.Linq;
using EasyDash.Models;
using Microsoft.AspNetCore.Mvc;
using LiteDB;
using Microsoft.Extensions.Options;

namespace EasyDash.Controllers
{
    [Route("api/[controller]")]
    public class ConfigurationController : Controller
    {
        private readonly IOptions<ConnectionStrings> _connectionStrings;

        public ConfigurationController(IOptions<ConnectionStrings> connectionStrings)
        {
            _connectionStrings = connectionStrings;
        }
        [HttpGet("[action]")]
        public List<UrlConfiguration> Urls()
        {
            using (var db = new LiteDatabase(_connectionStrings.Value.EasyDashDatabase))
            {
                var collection = db.GetCollection<UrlConfiguration>("UrlConfigurations");
                GenerateSampleData(collection);

                var result = collection.FindAll().ToList();
                return result;
            }
        }

        private void GenerateSampleData(LiteCollection<UrlConfiguration> collection)
        {
            if (collection.Count() > 0)
                return;

            var items = Enumerable.Range(1, 5).Select(index => new UrlConfiguration()
            {
                Id = index,
                Description = "Test service " + index,
                Url = $"http://example/{index}",
                StatusCode = 200,
                BodyContains = $"a{index}",
                Enabled = true,
                ScheduleTime = "00:05:00"
            });

            foreach (var item in items)
            {
                collection.Insert(item);
            }

            collection.EnsureIndex(x => x.Id);
        }
    }
}
