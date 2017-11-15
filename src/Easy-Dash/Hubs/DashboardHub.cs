using System;
using System.Threading.Tasks;
using EasyDash.Controllers;
using Microsoft.AspNetCore.SignalR;

namespace EasyDash.Hubs
{
    public class DashboardHub : Hub
    {
        public Task StartTest(int id)
        {
            return Clients.All.InvokeAsync("testStarted", id);
        }


        public Task EndTest(DashboardController.DashboardResult dashboardResult)//int Id, bool success)
        {
            return Clients.All.InvokeAsync("testEnded", dashboardResult); //Id, success);
        }
    }
}