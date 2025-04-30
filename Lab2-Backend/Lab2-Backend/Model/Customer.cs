using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Lab2_Backend.Model
{
    [Table("Customers")]
    public class Customer : User
    {
        [JsonIgnore]
        [ForeignKey("CustomerAddress")]
        public int? CustomerAddressID { get; set; } 

        [JsonIgnore]
        [ForeignKey("CustomerAddressID")]
        public virtual CustomerAddress? CustomerAddress { get; set; }

        [JsonIgnore]
        [ForeignKey("Role")]
        public virtual Role? Role { get; set; }
    }
}
