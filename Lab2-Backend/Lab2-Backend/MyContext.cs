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
        public DbSet<Orders> Orders { get; set; }
        public DbSet<OrderItems> OrderItems { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<CustomerAddress> CustomerAddresses { get; set; }
        public DbSet<Products> Products { get; set; }
        public DbSet<ProductNotes> ProductNotes { get; set; }
        public DbSet<MenuItemProducts> MenuItemProducts { get; set; }
        public DbSet<OrderItems_RemovedProducts> OrderItems_RemovedProducts { get; set; }



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

            modelBuilder.Entity<Orders>()
                .HasOne(o => o.Table)
                .WithMany()
                .HasForeignKey(o => o.TableID)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<ProductNotes>()
              .HasOne(pn => pn.MenuItems)
              .WithMany()
              .HasForeignKey(pn => pn.MenuItemsID)
              .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MenuItemProducts>()
                .HasOne(mip => mip.MenuItems)
                .WithMany()
                .HasForeignKey(mip => mip.MenuItemID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MenuItemProducts>()
                .HasOne(mip => mip.Products)
                .WithMany()
                .HasForeignKey(mip => mip.ProductsID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItems_RemovedProducts>()
                .HasOne(oirp => oirp.OrderItems)
                .WithMany()
                .HasForeignKey(oirp => oirp.OrderItemsID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItems_RemovedProducts>()
                .HasOne(oirp => oirp.Products)
                .WithMany()
                .HasForeignKey(oirp => oirp.ProductsID)
                .OnDelete(DeleteBehavior.Cascade);
    }

    }
}
