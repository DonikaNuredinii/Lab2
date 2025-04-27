using Lab2_Backend.Model;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class Products
{
    [Key]
    public int ProductsID { get; set; }

    [Required]
    [MaxLength(100)]
    public string Emri { get; set; }

    [JsonIgnore]
    [ValidateNever]
    public ICollection<MenuItemProducts> MenuItemProducts { get; set; }

    [JsonIgnore]
    [ValidateNever]
    public ICollection<OrderItems_RemovedProducts> OrderItemsRemovedProducts { get; set; }
}
