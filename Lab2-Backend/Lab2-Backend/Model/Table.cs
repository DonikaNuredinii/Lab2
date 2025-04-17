using Lab2_Backend.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Lab2_Backend.Models;
namespace Lab2_Backend.Models
{ 
    public class Table
    {
        [Key]
        public int ID { get; set; }
        [ForeignKey("Restaurant")]
        public int RestaurantID { get; set; }

        public string? QRCode { get; set; }

        public Restaurant Restaurant { get; set; }
    }
}
