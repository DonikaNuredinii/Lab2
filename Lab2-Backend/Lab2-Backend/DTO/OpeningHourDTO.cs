using System.ComponentModel.DataAnnotations;

namespace Lab2_Backend.DTO
{
    public class OpeningHourDTO
    {
        [Required]
        public DayOfWeek Dita { get; set; }

        [Required]
        public TimeSpan OraHapjes { get; set; }

        [Required]
        public TimeSpan OraMbylljes { get; set; }

        public bool IsClosed { get; set; }
    }
}
