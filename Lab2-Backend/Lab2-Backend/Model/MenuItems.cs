using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.Text.Json.Serialization;

namespace Lab2_Backend.Model
{
    public class MenuItems
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; } 
        public string Image { get; set; }
        public int Price { get; set; }
        public bool IsActive { get; set; }
        public int RestaurantId { get; set; }
        public int SubCategoryId { get; set; }
        [JsonIgnore]
        [ValidateNever]
        public Restaurant Restaurant { get; set; }
        [JsonIgnore]
        [ValidateNever]
        public Subcategory SubCategory { get; set; }
        public DateTime? UpdatedAt { get; set; }

    }
}
