using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EasyDash.Models
{
    public class TestSummary
    {
	    public string SummaryDescription { get; set; }
	    public DateTime FromDate { get; set; }
	    public DateTime ToDate{ get; set; }
	    public int NumberOfTests { get; set; }
	    public int Successful { get; set; }
	    public int Failed { get; set; }
	    public double AverageDuration { get; set; }

    }
}
