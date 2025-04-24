using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Lab2_Backend.Model
{
    public class OrderItems
    {
        [Key]
        public int OrderItemsID { get; set; }

        [Required]
        public int OrdersID { get; set; }

        [Required]
        public int MenuItemsID { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public decimal Price { get; set; }

        // ========================
        //    NAVIGIMI I FK-VE
        // ========================

        [ForeignKey(nameof(OrdersID))]
        [JsonIgnore]
        [ValidateNever]
        public Orders Orders { get; set; }

        [ForeignKey(nameof(MenuItemsID))]
        [JsonIgnore]
        [ValidateNever]
        public MenuItems MenuItems { get; set; }
    }
}
