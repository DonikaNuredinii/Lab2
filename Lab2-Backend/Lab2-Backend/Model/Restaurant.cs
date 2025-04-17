using System;
using System.ComponentModel.DataAnnotations;

namespace Lab2_Backend.Models
{
    public class Restaurant
    {
        [Key]
        public int ID { get; set; }

        [Required]
        public string Emri { get; set; }

        [Required]
        public string Adresa { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string NumriTel { get; set; }

        public DateTime DataEKrijimit { get; set; }
    }
}
