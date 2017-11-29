using System;namespace EasyDash.Models
{
	public class DashboardResult
	{
		public int Id { get; set; }
		public string Description { get; set; }
		public string LastStatus { get; set; }
		public DateTime LastUpdate { get; set; }
		public DateTime NextUpdate { get; set; }
	}
}
