public class RestaurantSubcategory
{
    public int RestaurantId { get; set; }
    public int SubcategoryId { get; set; }

    public Restaurant Restaurant { get; set; }
    public Subcategory Subcategory { get; set; }
}
