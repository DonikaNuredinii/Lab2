namespace Lab2_Backend.DTOs
{
    public class StaffScheduleDTO
    {
        public int StaffID { get; set; }
        public int? TableID { get; set; }
         
         [Required(ErrorMessage = "DayOfWeek is required.")]

            public string DayOfWeek { get; set; }

        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int? AssignedBy { get; set; } // Kjo është për të ruajtur ID-në e përdoruesit që cakton orarin
    }
}
