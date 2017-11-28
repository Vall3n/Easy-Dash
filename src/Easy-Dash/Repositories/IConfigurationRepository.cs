using System.Collections.Generic;
using System.Threading.Tasks;
using EasyDash.Models;

namespace EasyDash.Repositories
{
	public interface IConfigurationRepository
	{
		Task<IEnumerable<UrlConfiguration>> Get();
		Task<UrlConfiguration> Get(int id);
		Task<UrlConfiguration> Save(UrlConfiguration urlConfiguration);
		Task<List<UrlConfiguration>> Save(IEnumerable<UrlConfiguration> urlConfigurations);
		Task<int> Count();
		Task<bool> Delete(int id);
	}
}