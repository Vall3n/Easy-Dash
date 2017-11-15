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
        public string ScheduleTime { get; set; }

        public List<UrlTestStatus> UrlTestStatuses { get; set; } = new List<UrlTestStatus>();

        public TimeSpan ScheduleTimeSpan => TimeSpan.Parse(ScheduleTime);
    }
}
