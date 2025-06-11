using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.Text.Json.Serialization;

namespace Lab2_Backend.Model
{
    public class OrderItems_RemovedProducts
    {
        [Key]
        public int OIRPID { get; set; }

        [Required]
        public int OrderItemsID { get; set; }

        [Required]
        public int ProductsID { get; set; }

        [ForeignKey(nameof(OrderItemsID))]
        [JsonIgnore]
        [ValidateNever]
        public OrderItems OrderItems { get; set; }

        [ForeignKey(nameof(ProductsID))]
        [JsonIgnore]
        [ValidateNever]
        public Products Product { get; set; }
    }
}
