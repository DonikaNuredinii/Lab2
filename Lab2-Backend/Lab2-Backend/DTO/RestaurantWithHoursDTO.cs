using Lab2_Backend.DTO;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Lab2_Backend.DTOs
{
    public class RestaurantWithHoursDTO
    {
        [Required]
        public string Emri { get; set; }

        [Required]
        public string Adresa { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string NumriTel { get; set; }

        public List<OpeningHourDTO> Orari { get; set; }
    }
}
