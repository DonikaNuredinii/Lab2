using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lab2_Backend.Model
{
    public class RestaurantSubcategory
    {
        public int RestaurantId { get; set; }
        public Restaurant Restaurant { get; set; }

        public int SubcategoryId { get; set; }
        public Subcategory Subcategory { get; set; }
    }
}
