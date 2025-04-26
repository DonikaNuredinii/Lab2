using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Lab2_Backend.Model
{
    [Table("Customers")]
    public class Customer : User
    {
        [ForeignKey("CustomerAddress")]
        public int? CustomerAddressID { get; set; } // nullable to solve circular dependency

        public virtual CustomerAddress? CustomerAddress { get; set; }
    }
}
