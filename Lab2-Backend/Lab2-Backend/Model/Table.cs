﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Lab2_Backend.Model;
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
        public Restaurant Restaurant { get; set; }
    }
}
