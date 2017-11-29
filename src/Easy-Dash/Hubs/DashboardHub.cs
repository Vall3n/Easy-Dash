using System.Threading.Tasks;
using EasyDash.Models;
using Microsoft.AspNetCore.SignalR;

namespace EasyDash.Hubs
{
    public class DashboardHub : Hub
    {

        public Task TestStarted(int id)
        {
            return Clients.All.InvokeAsync("TestStarted", id);
        }

        public Task TestEnded(DashboardResult dashboardResult)
        {
            return Clients.All.InvokeAsync("TestEnded", dashboardResult);
        }

	    public Task ConfigModified(int id)
	    {
		    var connectionId = Context.ConnectionId;
		    return Clients.AllExcept(new[] { connectionId }).InvokeAsync("ConfigModified", id);

		}

	}
}