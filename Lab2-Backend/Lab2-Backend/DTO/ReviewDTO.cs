namespace Lab2_Backend.DTO
{
    public class ReviewDTO
    {
        public int ReviewID { get; set; }
        public int MenuItemID { get; set; }
        public int UserID { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UserName { get; set; }
        public string? MenuItemName { get; set; }
    }
}
