namespace Lab2_Backend.DTO
{
    public class StripeCheckoutDto
    {
        public List<CartItemDto> CartItems { get; set; }
    }

    public class CartItemDto
    {
        public string Name { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
