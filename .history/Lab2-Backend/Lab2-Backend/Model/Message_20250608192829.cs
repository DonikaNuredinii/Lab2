public class Message
{
    [Key]
    public int Id { get; set; }

    public int SenderId { get; set; }
    public int ReceiverId { get; set; }

    [Required]
    public string Content { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.Now;

    [ForeignKey("SenderId")]
    public virtual User Sender { get; set; }

    [ForeignKey("ReceiverId")]
    public virtual User Receiver { get; set; }
}
