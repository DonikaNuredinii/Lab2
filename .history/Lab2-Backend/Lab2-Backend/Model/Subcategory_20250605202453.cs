using Lab2_Backend.Model;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace Lab2_Backend.Model
{
    public class Subcategory
    {
        [Key]
        public int ID { get; set; }
        public string Name { get; set; }
        [ForeignKey("Category")]
        public int CategoryID { get; set; }

        [JsonIgnore]
        [ValidateNever]
        public Category Category { get; set; }
        public ICollection<RestaurantSubcategory> RestaurantSubcategories { get; set; }

    }
}
