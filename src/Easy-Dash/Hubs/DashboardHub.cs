using System.Threading.Tasks;
using EasyDash.Models;
using Microsoft.AspNetCore.SignalR;

namespace EasyDash.Hubs
{
    public class DashboardHub : Hub
    {

        public Task TestStarted(int id)
        {
            return Clients.All.SendAsync("TestStarted", id);
        }

        public Task TestEnded(DashboardResult dashboardResult)
        {
            return Clients.All.SendAsync("TestEnded", dashboardResult);
        }

	    public Task ConfigModified(int id)
	    {
		    return Clients.All.SendAsync("ConfigModified", id);
		}

	    public Task ConfigRemoved(int id)
	    {
		    return Clients.All.SendAsync("ConfigRemoved", id);
	    }

	}
}