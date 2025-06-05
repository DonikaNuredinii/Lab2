using Lab2_Backend.Model;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class Products
{
    [Key]
    public int ProductsID { get; set; }

    [Required]
    [MaxLength(100)]
    public string Emri { get; set; }

    [MaxLength(500)]
    public string Description { get; set; }

    public decimal Price { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    [MaxLength(50)]
    public string Unit { get; set; } // e.g., "kg", "piece", "liter"

    public int StockQuantity { get; set; }

    [MaxLength(50)]
    public string Category { get; set; }

    // Add Restaurant relationship
    
    public int RestaurantId { get; set; }

    [JsonIgnore]
    [ValidateNever]
    public Restaurant Restaurant { get; set; }

    [JsonIgnore]
    [ValidateNever]
    public ICollection<MenuItemProducts> MenuItemProducts { get; set; }

    [JsonIgnore]
    [ValidateNever]
    public ICollection<OrderItems_RemovedProducts> OrderItemsRemovedProducts { get; set; }
}
