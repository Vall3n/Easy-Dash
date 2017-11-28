using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EasyDash.Models;
using EasyDash.Services;
using Microsoft.Extensions.Options;

namespace EasyDash.Repositories
{
    public class ConfigurationRepository : IConfigurationRepository
    {
        private readonly IOptions<ConnectionStrings> _connnectionStrings;
	    private readonly ITestRunManager _testRunManager;

	    public ConfigurationRepository(IOptions<ConnectionStrings> connnectionStrings, ITestRunManager testRunManager)
	    {
		    _connnectionStrings = connnectionStrings;
		    _testRunManager = testRunManager;
	    }

        public Task<int> Count()
        {
            using (var database = new LiteDB.LiteDatabase(_connnectionStrings.Value.EasyDashDatabase))
            {
                var collection = database.GetCollection<UrlConfiguration>("UrlConfigurations");
                var result = collection.Count();

                return Task.FromResult(result);
            }
        }

	    public Task<bool> Delete(int id)
	    {
			using (var database = new LiteDB.LiteDatabase(_connnectionStrings.Value.EasyDashDatabase))
			{
				var collection = database.GetCollection<UrlConfiguration>("UrlConfigurations");

				var deleted = collection.Delete(id);
				if (deleted)
				{
					_testRunManager.RemoveScedule(id);
				}

				return Task.FromResult(deleted);
			}
		}

	    public Task<UrlConfiguration> Get(int id)
        {
            using (var database = new LiteDB.LiteDatabase(_connnectionStrings.Value.EasyDashDatabase))
            {
                var collection = database.GetCollection<UrlConfiguration>("UrlConfigurations");
                var result = collection.FindById(id);

                return Task.FromResult(result);
            }
        }

        public Task<IEnumerable<UrlConfiguration>> Get()
        {
            using (var database = new LiteDB.LiteDatabase(_connnectionStrings.Value.EasyDashDatabase))
            {
                var collection = database.GetCollection<UrlConfiguration>("UrlConfigurations");
                var result = collection.FindAll();

                return Task.FromResult(result);
            }
        }

        public Task<List<UrlConfiguration>> Save(IEnumerable<UrlConfiguration> urlConfigurations)
        {
	        var urlConfigurationsList = urlConfigurations.ToList();
            using (var database = new LiteDB.LiteDatabase(_connnectionStrings.Value.EasyDashDatabase))
            {
                var collection = database.GetCollection<UrlConfiguration>("UrlConfigurations");
                foreach (var url in urlConfigurationsList)
                {
                    collection.Upsert(url);
                }
                return Task.FromResult(urlConfigurationsList);


            }
        }

        public Task<UrlConfiguration> Save(UrlConfiguration urlConfiguration)
        {
            using (var database = new LiteDB.LiteDatabase(_connnectionStrings.Value.EasyDashDatabase))
            {
                var collection = database.GetCollection<UrlConfiguration>("UrlConfigurations");
	            try
	            {
		            collection.Upsert(urlConfiguration);
		            _testRunManager.AddOrUpdateSchedule(urlConfiguration);
		            return Task.FromResult(urlConfiguration);
	            }
	            catch (Exception ex)
	            {
		            return Task.FromException<UrlConfiguration>(new Exception("Could not save the configuration",ex));
	            }

            }
        }
    }
}