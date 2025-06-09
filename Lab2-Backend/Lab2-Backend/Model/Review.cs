using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.Text.Json.Serialization;

namespace Lab2_Backend.Model
{
    public class Review
    {
        [Key]
        public int ReviewID { get; set; }

        [Required]
        public int MenuItemID { get; set; }

        [Required]
        public int UserID { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        public string Comment { get; set; }

        public DateTime CreatedAt { get; set; }

        [ForeignKey(nameof(MenuItemID))]
        [JsonIgnore]
        [ValidateNever]
        public MenuItems MenuItem { get; set; }

        [ForeignKey(nameof(UserID))]
        [JsonIgnore]
        [ValidateNever]
        public User User { get; set; }
    }
}
