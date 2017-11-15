using System;
using System.Collections.Generic;
using System.Linq;
using EasyDash.Models;
using Microsoft.AspNetCore.Mvc;
using LiteDB;
using Microsoft.Extensions.Options;
using EasyDash.Repositories;
using System.Threading.Tasks;

namespace EasyDash.Controllers
{
    [Route("api/[controller]")]
    public class ConfigurationController : Controller
    {
        private readonly IOptions<ConnectionStrings> _connectionStrings;
        private readonly IConfigurationRepository _configurationRepository;

        public ConfigurationController(IOptions<ConnectionStrings> connectionStrings, IConfigurationRepository configurationRepository)
        {
            _connectionStrings = connectionStrings;
            _configurationRepository = configurationRepository;
        }
        [HttpGet("[action]")]
        public async Task<IEnumerable<UrlConfiguration>> Urls()
        {
            await GenerateSampleData();
            return await _configurationRepository.Get();
        }

        private async Task GenerateSampleData()
        {
            if (await _configurationRepository.Count() > 0)
                return;

            var items = Enumerable.Range(1, 5).Select(index => new UrlConfiguration()
            {
                Id = index,
                Description = "Test service " + index,
                Url = $"https://jsonplaceholder.typicode.com/posts/{index}",
                StatusCode = 200,
                BodyContains = $"\"id\": {index}",
                Enabled = true,
                ScheduleTime = "00:05:00"
            });

            await _configurationRepository.Save(items);
        }
    }
}
