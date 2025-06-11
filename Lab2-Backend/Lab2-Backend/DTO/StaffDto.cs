namespace Lab2_Backend.DTO
{
    public class StaffDto
    {
        public int UserID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime CreationDate { get; set; }
        public int? RoleID { get; set; }
        public string Password { get; set; }
        public int RestaurantID { get; set; }
    }

}
