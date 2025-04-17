using Microsoft.EntityFrameworkCore;
using Lab2_Backend.Models;

namespace Lab2_Backend
{
    public class MyContext : DbContext
    {
        public MyContext(DbContextOptions<MyContext> options) : base(options)
        {
        }

        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<Table> Tables { get; set; }
    }
}
