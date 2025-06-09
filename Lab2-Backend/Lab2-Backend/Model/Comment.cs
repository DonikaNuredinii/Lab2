using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace Lab2_Backend.Model
{
    public class Comment
    {
        [Key]
        public int CommentID { get; set; }

        [Required]
        public string Content { get; set; }

        public int? ReviewID { get; set; }
        public int? MenuItemID { get; set; }

        [Required]
        public int UserID { get; set; }

        public DateTime CreatedAt { get; set; }

        [ForeignKey(nameof(ReviewID))]
        [ValidateNever]
        [JsonIgnore]
        public Review? Review { get; set; }

        [ForeignKey(nameof(MenuItemID))]
        [ValidateNever]
        [JsonIgnore]
        public MenuItems? MenuItem { get; set; }

        [ForeignKey(nameof(UserID))]
        [ValidateNever]
        [JsonIgnore]
        public User User { get; set; }
    }
}
