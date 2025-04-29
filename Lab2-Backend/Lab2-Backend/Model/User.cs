using Lab2_Backend.Model;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Lab2_Backend.Model
{
    public class User
{
    [Key]
    public int UserID { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string Password { get; set; }
    public DateTime CreationDate { get; set; }

    [JsonIgnore]
    [ForeignKey("Role")]
    public int? RoleID { get; set; }

    public virtual Role? Role { get; set; }  
}

}
