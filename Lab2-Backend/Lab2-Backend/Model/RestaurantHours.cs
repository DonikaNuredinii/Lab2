using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Lab2_Backend.Model
{
    public class RestaurantHours
    {
        [Key]
        public int ID { get; set; }

        [ForeignKey("Restaurant")]
        public int RestaurantID { get; set; }
        [JsonIgnore]
        [ValidateNever]
        public Restaurant Restaurant { get; set; }

        [Required]
        public DayOfWeek Dita { get; set; } // Enum: Monday, Tuesday, etc.

        [Required]
        public TimeSpan OraHapjes { get; set; }

        [Required]
        public TimeSpan OraMbylljes { get; set; }

        public bool IsClosed { get; set; } // Optional: true if closed on that day
    }
}
