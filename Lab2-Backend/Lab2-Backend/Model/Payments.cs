using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace Lab2_Backend.Model
{
    public class Payments
    {
        [Key]
        public int PaymentsID { get; set; }

        [Required]
        public int OrderID { get; set; } // <-- This is what was missing!

        [Required]
        [MaxLength(20)]
        public string PaymentMethod { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; }

        [Required]
        public decimal Amount { get; set; }

        public string? TransactionID { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // ========== FOREIGN KEYS ==========
        [ForeignKey(nameof(OrderID))]
        [JsonIgnore]
        [ValidateNever]
        public Orders Orders { get; set; }
    }
}
