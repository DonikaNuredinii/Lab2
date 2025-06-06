using System;
using System.ComponentModel.DataAnnotations;

namespace Lab2_Backend.DTOs
{
    public class StaffScheduleDTO
    {
        public int StaffID { get; set; }
        public int? TableID { get; set; }

        public string DayOfWeek { get; set; }

        [DataType(DataType.Time)]
        public TimeSpan StartTime { get; set; }

        [DataType(DataType.Time)]
        public TimeSpan EndTime { get; set; }

        public int? AssignedBy { get; set; } 
    }
}
