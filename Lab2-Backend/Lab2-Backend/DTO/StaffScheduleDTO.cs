using System;
using System.ComponentModel.DataAnnotations;
using Swashbuckle.AspNetCore.Annotations;


namespace Lab2_Backend.DTOs
{
    public class StaffScheduleDTO
    {
        public int StaffID { get; set; }
        public List<int> TableIDs { get; set; }

        public string DayOfWeek { get; set; }

        [DataType(DataType.Time)]
        public TimeSpan StartTime { get; set; }

        [DataType(DataType.Time)]
        public TimeSpan EndTime { get; set; }

        public int? AssignedBy { get; set; } 
    }
}
