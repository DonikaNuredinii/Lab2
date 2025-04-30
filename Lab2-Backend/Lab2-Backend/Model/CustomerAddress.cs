using Lab2_Backend.Model;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace Lab2_Backend.Model
{
    public class CustomerAddress
    {
        [Key]
        public int CustomerAddressID { get; set; }

        public string AddressLine { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }

  
    }
}