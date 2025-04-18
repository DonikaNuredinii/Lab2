using Lab2_Backend.Model;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Lab2_Backend.Model
{
    public class Category
    {
        [Key]
        public int ID { get; set; }
        public string Name { get; set; }
        [ForeignKey("Restaurant")]
        public int RestaurantID { get; set; }
        [JsonIgnore]
        [ValidateNever]
        public Restaurant Restaurant { get; set; }
    }
}
