using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDash.Models
{
    public class UrlTestStatus
    {
        public int Id { get; set; }
        public DateTime StartedDateTime { get; set; }
        public DateTime CompletedDateTime { get; set; }
        public TimeSpan Duration { get; set; }
        public int StatusCode { get; set; }
        public string BodyContent { get; set; }
        public bool Succeeded { get; set; }
    }
}
