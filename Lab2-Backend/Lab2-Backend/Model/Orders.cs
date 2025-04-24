using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.Text.Json.Serialization;

namespace Lab2_Backend.Model
{
    public class Orders
    {
        [Key]
        public int OrdersID { get; set; }

        [Required]
        public int RestaurantID { get; set; }

        [Required]
        public int TableID { get; set; }

        [Required]
        public int CostumerID { get; set; }

        [Required]
        public int CostumerAdressID { get; set; }

        [Required]
        [MaxLength(50)]
        public string OrderType { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }

        public DateTime CreatedAt { get; set; }

        // ========================
        //    NAVIGIMI I FK-VE
        // ========================

        [ForeignKey(nameof(RestaurantID))]
        [JsonIgnore]
        [ValidateNever]
        public Restaurant Restaurant { get; set; }

        [ForeignKey(nameof(TableID))]
        [JsonIgnore]
        [ValidateNever]
        public Table Table { get; set; }

        

        
    }
}