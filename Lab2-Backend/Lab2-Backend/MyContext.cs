using Microsoft.EntityFrameworkCore;
using Lab2_Backend.Model;

namespace Lab2_Backend
{
    public class MyContext : DbContext
    {
        public MyContext(DbContextOptions<MyContext> options) : base(options)
        {
        }

        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<Table> Tables { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Subcategory> Subcategories { get; set; }
        public DbSet<MenuItems> MenuItems { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MenuItems>()
                .HasOne(m => m.Restaurant)
                .WithMany()
                .HasForeignKey(m => m.RestaurantId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MenuItems>()
                .HasOne(m => m.SubCategory)
                .WithMany()
                .HasForeignKey(m => m.SubCategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        }

    }

}
