namespace Lab2_Backend.DTO
{
    public class ProductDTO
    {
        public string Emri { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; }
        public string Unit { get; set; }
        public int StockQuantity { get; set; }
        public string Category { get; set; }
        public int RestaurantId { get; set; }
    }
}
