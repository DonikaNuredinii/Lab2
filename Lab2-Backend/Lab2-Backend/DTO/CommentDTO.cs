namespace Lab2_Backend.DTO
{
    public class CommentDTO
    {
        public int CommentID { get; set; }
        public string Content { get; set; }
        public int? ReviewID { get; set; }
        public int? MenuItemID { get; set; }
        public int UserID { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
