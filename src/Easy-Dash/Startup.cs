using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Hangfire;
using Hangfire.LiteDB;
using System.Diagnostics;
using System;
using EasyDash.Services;

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

            services.Configure<ConnectionStrings>(Configuration.GetSection("ConnectionStrings"));
            services.AddSingleton<IConfiguration>(Configuration);
            services.AddSingleton<ITestRunManager, TestRunManager>();


            services.AddHangfire(t => t.UseLiteDbStorage(Configuration[key: "ConnectionStrings:HangfireDatabase"]));
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

            app.UseStaticFiles();
            app.UseHangfireServer();

            if (env.IsDevelopment())
            {
                app.UseHangfireDashboard();
            }

            //TestRunManager.Instance.Initialize();
            var testRunManager = app.ApplicationServices.GetService<ITestRunManager>();
            testRunManager.Initialize();
            //RecurringJob.AddOrUpdate(() => Debug.WriteLine($"Job {DateTime.Now}"), Cron.Minutely);

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
