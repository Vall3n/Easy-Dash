using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EasyDash.Hubs;
using EasyDash.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;

namespace EasyDash.Repositories
{
    public class ConfigurationRepository : IConfigurationRepository
    {
        private readonly IOptions<ConnectionStrings> _connnectionStrings;

        public ConfigurationRepository(IOptions<ConnectionStrings> connnectionStrings)
        {
            _connnectionStrings = connnectionStrings;
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

        public Task<IEnumerable<UrlConfiguration>> Save(IEnumerable<UrlConfiguration> urlConfigurations)
        {
            using (var database = new LiteDB.LiteDatabase(_connnectionStrings.Value.EasyDashDatabase))
            {
                var collection = database.GetCollection<UrlConfiguration>("UrlConfigurations");
                foreach (var url in urlConfigurations)
                {
                    collection.Upsert(url);
                }
                return Task.FromResult(urlConfigurations);


            }
        }

        public Task<UrlConfiguration> Save(UrlConfiguration urlConfiguration)
        {
            using (var database = new LiteDB.LiteDatabase(_connnectionStrings.Value.EasyDashDatabase))
            {
                var collection = database.GetCollection<UrlConfiguration>("UrlConfigurations");
                if (collection.Upsert(urlConfiguration))
                    return Task.FromResult(urlConfiguration);

                return Task.FromException<UrlConfiguration>(new Exception("Could not save the configuration"));

            }
        }
    }
    public interface IConfigurationRepository
    {
        Task<IEnumerable<UrlConfiguration>> Get();
        Task<UrlConfiguration> Get(int id);
        Task<UrlConfiguration> Save(UrlConfiguration urlConfiguration);

        Task<IEnumerable<UrlConfiguration>> Save(IEnumerable<UrlConfiguration> urlConfigurations);

        Task<int> Count();
    }
}