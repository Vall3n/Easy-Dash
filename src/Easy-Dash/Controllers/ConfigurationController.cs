using System;
using System.Collections.Generic;
using System.Linq;
using EasyDash.Models;
using Microsoft.AspNetCore.Mvc;
using LiteDB;
using Microsoft.Extensions.Options;
using EasyDash.Repositories;
using System.Threading.Tasks;
using EasyDash.Services;

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
            return await _configurationRepository.Get(true);
        }

        [HttpPost("[action]")]
        public async Task<UrlConfiguration> Save([FromBody] UrlConfiguration urlConfiguration)
        {
            return await _configurationRepository.Save(urlConfiguration);
        }

		[HttpDelete("[action]/{id}")]
	    public async Task<bool> Delete(int id)
		{
			return await _configurationRepository.Delete(id);
		}

        [HttpPost("[action]")]
        public async Task<UrlTestStatus> Test([FromBody]UrlConfiguration urlConfiguration)
        {
            var runner = new UrlRunner();
            var results = await runner.Test(urlConfiguration);

            return results;
        }
    }
}
