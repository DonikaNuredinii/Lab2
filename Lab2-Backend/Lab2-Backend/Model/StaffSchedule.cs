using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lab2_Backend.Model
{
    public class StaffSchedule
    {
        [Key]
        public int ScheduleID { get; set; }

        // Foreign key for StaffUser
        [ForeignKey("StaffUser")]
        public int StaffID { get; set; }

        // Foreign key for Table
        [ForeignKey("Table")]
        public int? TableID { get; set; }

        [Required]
        public string DayOfWeek { get; set; } // P.sh. Monday, Tuesday, etc.

        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        // Foreign key for AssignedBy (another User)
        [ForeignKey("AssignedByUser")]
        public int? AssignedBy { get; set; }

        // Navigation properties
        public virtual User StaffUser { get; set; }
        public virtual Table Table { get; set; }
        public virtual User AssignedByUser { get; set; }
    }
}
