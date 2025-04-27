using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.Text.Json.Serialization;

namespace Lab2_Backend.Model
{
    public class MenuItemProducts
    {
        [Key]
        public int MIProducts { get; set; }

        [Required]
        public int MenuItemID { get; set; }

        [Required]
        public int ProductsID { get; set; }

        public bool IsRequired { get; set; }

        [ForeignKey(nameof(MenuItemID))]
        [JsonIgnore]
        [ValidateNever]
        public MenuItems MenuItems { get; set; }

        [ForeignKey(nameof(ProductsID))]
        [JsonIgnore]
        [ValidateNever]
        public Products Products { get; set; }
    }
}

