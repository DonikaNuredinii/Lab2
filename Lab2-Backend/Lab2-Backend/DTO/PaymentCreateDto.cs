namespace Lab2_Backend.DTO
{
    public class PaymentCreateDto
    {
        public int OrderID { get; set; }
        public string PaymentMethod { get; set; }
        public string Status { get; set; }
        public decimal Amount { get; set; }
        public string TransactionID { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
