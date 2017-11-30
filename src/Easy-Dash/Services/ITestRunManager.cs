using System.Threading.Tasks;
using EasyDash.Models;

namespace EasyDash.Services
{
    public interface ITestRunManager
    {
        void Initialize();
	    void AddOrUpdateSchedule(UrlConfiguration configuration, bool trigger);
	    void RemoveScedule(int id);

    }
}