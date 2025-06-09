namespace Lab2_Backend.DTO
{
    public class MenuItemWithProductsDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public string Image { get; set; }
        public int CategoryId { get; set; }
        public int SubCategoryId { get; set; }
        public bool IsActive { get; set; }
        public int RestaurantId { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<int> ProductIds { get; set; }
    }

}
