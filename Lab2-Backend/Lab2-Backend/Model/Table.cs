using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Lab2_Backend.Model;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
namespace Lab2_Backend.Model
{ 
    public class Table
    {
        [Key]
        public int ID { get; set; }
        [ForeignKey("Restaurant")]
        public int RestaurantID { get; set; }

        public string? QRCode { get; set; }
        [JsonIgnore]
        [ValidateNever]
        public Restaurant Restaurant { get; set; }
        [JsonIgnore]
        [ValidateNever]
        public virtual ICollection<StaffScheduleTable> StaffScheduleTables { get; set; }
    }
}
