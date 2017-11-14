using System;
using System.Threading.Tasks;
using EasyDash.Models;
using Flurl.Http;

namespace EasyDash.Services
{
    public class UrlRunner : ITestRunner<UrlTestStatus, UrlConfiguration>
    {
        public async Task<UrlTestStatus> Test(UrlConfiguration configuration)
        {
            var response = new UrlTestStatus() { StartedDateTime = DateTime.Now };

            try
            {
                var result = await configuration.Url.AllowAnyHttpStatus().GetAsync();

                response.BodyContent = await result.Content.ReadAsStringAsync();
                response.StatusCode = (int)result.StatusCode;

                response.Succeeded = response.StatusCode == configuration.StatusCode
                    && response.BodyContent.Contains(configuration.BodyContains);

            }
            catch (FlurlHttpException ex)
            {
                response.Succeeded = false;
                response.BodyContent = ex.Message;
            }

            response.CompletedDateTime = DateTime.Now;
            response.Duration = response.CompletedDateTime.Subtract(response.StartedDateTime);
            return response;
        }
    }
}
