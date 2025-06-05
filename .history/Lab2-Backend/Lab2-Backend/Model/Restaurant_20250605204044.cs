using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Lab2_Backend.Model
{
    public class Restaurant
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public string Emri { get; set; }

        [Required]
        public string Adresa { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string NumriTel { get; set; }

        public DateTime DataEKrijimit { get; set; }

        public ICollection<RestaurantHours> RestaurantHours { get; set; } = new List<RestaurantHours>();
        [JsonIgnore]
        public ICollection<RestaurantSubcategory> RestaurantSubcategories { get; set; }


    }
}
