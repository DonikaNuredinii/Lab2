using System;
using System.ComponentModel.DataAnnotations;
using Swashbuckle.AspNetCore.Annotations;

namespace Lab2_Backend.DTOs
{
    public class StaffScheduleDTO
    {
        [SwaggerSchema("ID of the staff member", Example = 1)]
        public int StaffID { get; set; }

        [SwaggerSchema("ID of the table", Example = 3)]
        public int? TableID { get; set; }

        [SwaggerSchema("Day of the week", Example = "Monday")]
        public string DayOfWeek { get; set; }

        [DataType(DataType.Time)]
        [SwaggerSchema("Start time in format HH:mm:ss", Example = "09:00:00")]
        public TimeSpan StartTime { get; set; }

        [DataType(DataType.Time)]
        [SwaggerSchema("End time in format HH:mm:ss", Example = "17:00:00")]
        public TimeSpan EndTime { get; set; }

        [SwaggerSchema("ID of the user who assigned the schedule", Example = 2)]
        public int? AssignedBy { get; set; }
    }
}
