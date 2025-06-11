public class PaymentCreateDto
{
    public int OrderID { get; set; }
    public string PaymentMethod { get; set; } // "Cash", "Card"
    public string Status { get; set; } // "Pending" ose "Paid"
    public decimal Amount { get; set; }
    public string TransactionID { get; set; }
    public DateTime CreatedAt { get; set; }

    // Fushat nga forma
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PhoneNumber { get; set; }
    public string Email { get; set; }
    public string AdditionalInfo { get; set; }

    // Kartela - vetëm nëse metoda është "Card"
    public CardDataDto CardData { get; set; }
}

public class CardDataDto
{
    public string Name { get; set; }     // Name on Card
    public string Number { get; set; }   // Card Number
    public string Expire { get; set; }   // MM/YY
    public string Cvv { get; set; }      // CVV
}
