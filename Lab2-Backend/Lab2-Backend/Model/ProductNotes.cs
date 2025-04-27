using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.Text.Json.Serialization;

namespace Lab2_Backend.Model
{
    public class ProductNotes
    {
        [Key]
        public int ProductNotesID { get; set; }

        [Required]
        public int MenuItemsID { get; set; }

        public string Note { get; set; }

        public DateTime CreatedAt { get; set; }

        [ForeignKey(nameof(MenuItemsID))]
        [JsonIgnore]
        [ValidateNever]
        public MenuItems MenuItems { get; set; }
    }
}
