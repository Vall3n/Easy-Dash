using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EasyDash.Hubs;
using EasyDash.Repositories;
using EasyDash.Services;
using Hangfire;
using Hangfire.LiteDB;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EasyDash
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
	        services.AddOptions();
	        services.AddSignalR();


			services.Configure<ConnectionStrings>(Configuration.GetSection("ConnectionStrings"));
	        services.AddSingleton<IConfiguration>(Configuration);

	        services.AddSingleton<ITestRunManager, TestRunManager>();

	        services.AddScoped<IConfigurationRepository, ConfigurationRepository>();


	        services.AddHangfire(t => t.UseLiteDbStorage(Configuration.GetConnectionString("HangfireDatabase")));

		}

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

	        app.UseSignalR(routes =>
	        {
		        routes.MapHub<DashboardHub>("dashboardsignal");
	        });

	        app.UseHangfireServer();
			app.UseStaticFiles();

	        var testRunManager = app.ApplicationServices.GetService<ITestRunManager>();
	        testRunManager.Initialize();

			app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }
    }
}
