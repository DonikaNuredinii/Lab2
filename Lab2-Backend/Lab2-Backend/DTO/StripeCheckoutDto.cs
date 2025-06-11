public class StripeCheckoutDto
{
    public List<CartItemDto> CartItems { get; set; }
}

public class CartItemDto
{
    public string Name { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
}
