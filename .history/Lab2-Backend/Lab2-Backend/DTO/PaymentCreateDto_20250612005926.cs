public class PaymentCreateDto
{
    public int OrderID { get; set; }
    public string PaymentMethod { get; set; }
    public string Status { get; set; }
    public decimal Amount { get; set; }
    public string TransactionID { get; set; }
    public DateTime CreatedAt { get; set; }

    // Fushat shtesë që dërgon front-end
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PhoneNumber { get; set; }
    public string Email { get; set; }
    public string AdditionalInfo { get; set; }

    // Nëse dëshiron të ruash edhe kartelën (jo e rekomanduar si tekst i thjeshtë, por në rastin tënd mund të shtosh)
    public CardDataDto CardData { get; set; }
}

public class CardDataDto
{
    public string Name { get; set; }
    public string Number { get; set; }
    public string Expire { get; set; }
    public string Cvv { get; set; }
}
