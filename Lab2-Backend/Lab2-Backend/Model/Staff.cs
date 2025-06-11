using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Lab2_Backend.Model
{
    public class Staff : User
    {
        [ForeignKey("Restaurant")]
        public int? RestaurantID { get; set; }

        public DateTime? LastLogin { get; set; }

        [JsonIgnore]
        public virtual Restaurant? Restaurant { get; set; }


    }
}
