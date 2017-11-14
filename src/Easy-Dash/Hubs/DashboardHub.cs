using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace EasyDash.Hubs
{
    public class DashboardHub : Hub
    {
        public Task StartTest(int id)
        {
            return Clients.All.InvokeAsync("testStarted", id);
        }


        public Task EndTest(int Id, bool success)
        {
            return Clients.All.InvokeAsync("testEnded", Id, success);
        }        
    }
}