using System;
using System.Collections.Generic;
using System.Globalization;

namespace EasyDash.Models
{
	public class UrlConfiguration
	{
		public int Id { get; set; }
		public string Description { get; set; }
		public string Url { get; set; }
		public int? StatusCode { get; set; }
		public string BodyContains { get; set; }
		public bool Enabled { get; set; }
		public string ScheduleTime { get; set; } = "PT5M"; // default to 5 a minutes
		public List<UrlTestStatus> UrlTestStatuses { get; set; } = new List<UrlTestStatus>();
		public TimeSpan ScheduleTimeSpan => TimeSpan.Parse(ParseTimeString(ScheduleTime));

		private string ParseTimeString(string scheduledTime)
		{
			// sample 22H59M59S
			var timePortion = scheduledTime.Replace("P", "", StringComparison.OrdinalIgnoreCase);
			timePortion = timePortion.Replace("T", "", StringComparison.OrdinalIgnoreCase);

			int hourIndex, minuteIndex, dayIndex;
			int hours, minutes, days;

			dayIndex = timePortion.IndexOf("D", StringComparison.OrdinalIgnoreCase);
			hourIndex = timePortion.IndexOf("H", StringComparison.OrdinalIgnoreCase);
			minuteIndex = timePortion.IndexOf("M", StringComparison.OrdinalIgnoreCase);


			days = dayIndex >= 0 ? int.Parse(timePortion.Substring(0, dayIndex)) : 0;
			hours = hourIndex >= 0 ? int.Parse(timePortion.Substring(Math.Max(dayIndex + 1, 0), hourIndex - Math.Max(dayIndex + 1, 0))) : 0;
			minutes = minuteIndex >= 0 ? int.Parse(timePortion.Substring(Math.Max(hourIndex + 1, 0), minuteIndex - Math.Max(hourIndex + 1, 0))) : 0;

			var result = $"{days}.{hours:00}:{minutes:00}:00";

			return result;
		}
		
	}
}
