using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EasyDash.Models;
using EasyDash.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Logging;

namespace EasyDash.Controllers
{
	[Route("api/[controller]")]
	public class DashboardController : Controller
	{
		private readonly IConfigurationRepository _configurationRepository;

		public DashboardController(IConfigurationRepository configurationRepository)
		{
			_configurationRepository = configurationRepository;
		}
		private static readonly string[] Status = {
			"Success", "Fail", "Pending"
		};

		[HttpGet("[action]")]
		public async Task<IEnumerable<DashboardResult>> Results()
		{
			var collection = await _configurationRepository.Get();

			var result = collection
				.Select(TransformToDashboardResult)
				.OrderBy(x => x.NextUpdate);

			return result;
		}

		[HttpGet("[action]/{id}")]
		public async Task<DashboardResult> Find(int id)
		{
			var dashboardResult = await _configurationRepository.Get(id);

			var result = TransformToDashboardResult(dashboardResult);
			return result;
		}


		[HttpGet("{id}/[action]")]
		public async Task<List<TestSummary>> Details(int id)
		{
			var dashboardResult = await _configurationRepository.Get(id);

			List<TestSummary> summaries = new List<TestSummary>
			{
				GenerateSummaries(dashboardResult.UrlTestStatuses, 1),
				GenerateSummaries(dashboardResult.UrlTestStatuses, 7)
			};


			return summaries;
			;
		}

		public static TestSummary GenerateSummaries(List<UrlTestStatus> statuses, int days)
		{
			var hours = days * 24;
			var toDate = DateTime.Now.AddHours(hours * -1);

			var summaryset = statuses.Where(status => status.StartedDateTime >= toDate).ToList();

			var summary = new TestSummary
			{
				SummaryDescription = days == 1 ? "24 Hours" : $"{days} Days",
				AverageDuration = summaryset.Average(s => s.Duration.Milliseconds),
				Failed = summaryset.Count(s => !s.Succeeded),
				Successful = summaryset.Count(s => s.Succeeded),
				FromDate = summaryset.Min(s => s.StartedDateTime),
				ToDate = summaryset.Max(s => s.StartedDateTime),
				NumberOfTests = summaryset.Count
			};

			return summary;
		}

		public static DashboardResult TransformToDashboardResult(UrlConfiguration configuration)
		{
			if (configuration.UrlTestStatuses == null)
			{
				configuration.UrlTestStatuses = new List<UrlTestStatus>();
			}

			var lastStatus = configuration.UrlTestStatuses.FirstOrDefault();

			var result = new DashboardResult
			{
				Id = configuration.Id,
				Description = configuration.Description,
			};

			if (lastStatus == default(UrlTestStatus))
			{
				result.LastStatus = Status[2];
			}
			else
			{
				result.LastStatus = lastStatus.Succeeded ? Status[0] : Status[1];
				result.LastUpdate = lastStatus.CompletedDateTime;

				if (configuration.Enabled)
				{

					Console.WriteLine($"Before {result.NextUpdate}" );

					var nextTick = Math.Ceiling(DateTime.Now.AddMinutes(1).Minute / (configuration.ScheduleTime * 1.0));
					var minutes = (int)(nextTick * configuration.ScheduleTime);
					var now = DateTime.Now;

					result.NextUpdate = new DateTime(now.Year,
						now.Month,
						now.Day,
						(minutes > 60 ? now.Hour + 1 : now.Hour),
						(minutes > 60 ? 0 : minutes),
						0);

					Console.WriteLine($"After {result.NextUpdate}");
				}
			}

			return result;
		}
	}
}
