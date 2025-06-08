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
        public DbSet<Payments> Payments { get; set; }
        public DbSet<Staff> Staff { get; set; }
        public DbSet<RestaurantHours>  RestaurantHours { get; set; }
        public DbSet<StaffSchedule> StaffSchedules { get; set; }
        public DbSet<RestaurantSubcategory> RestaurantSubcategories { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }



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
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProductNotes>()
                .HasOne(pn => pn.MenuItems)
                .WithMany()
                .HasForeignKey(pn => pn.MenuItemsID)
                .HasPrincipalKey(m => m.Id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MenuItemProducts>()
                .HasOne(mip => mip.MenuItems)
                .WithMany()
                .HasForeignKey(mip => mip.MenuItemID)
                .HasPrincipalKey(m => m.Id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MenuItemProducts>()
                .HasOne(mip => mip.Products)
                .WithMany()
                .HasForeignKey(mip => mip.ProductsID)
                .HasPrincipalKey(p => p.ProductsID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItems_RemovedProducts>()
                .HasOne(oirp => oirp.OrderItems)
                .WithMany()
                .HasForeignKey(oirp => oirp.OrderItemsID)
                .HasPrincipalKey(oi => oi.OrderItemsID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItems_RemovedProducts>()
                .HasOne(oirp => oirp.Products)
                .WithMany()
                .HasForeignKey(oirp => oirp.ProductsID)
                .HasPrincipalKey(p => p.ProductsID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Payments>()
                .HasOne(p => p.Orders)
                .WithMany()
                .HasForeignKey(p => p.OrderID)
                .HasPrincipalKey(o => o.OrdersID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<StaffSchedule>()
                .HasOne(ss => ss.StaffUser)
                .WithMany()
                .HasForeignKey(ss => ss.StaffID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<StaffSchedule>()
                .HasOne(ss => ss.AssignedByUser)
                .WithMany()
                .HasForeignKey(ss => ss.AssignedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Products>()
                .HasOne(p => p.Restaurant)
                .WithMany()
                .HasForeignKey(p => p.RestaurantId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RestaurantHours>()
                .HasOne(rh => rh.Restaurant)
                .WithMany(r => r.RestaurantHours)
                .HasForeignKey(rh => rh.RestaurantID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Table>()
                .HasOne(t => t.Restaurant)
                .WithMany()
                .HasForeignKey(t => t.RestaurantID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Orders>()
                .HasOne(o => o.Restaurant)
                .WithMany()
                .HasForeignKey(o => o.RestaurantID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Staff>()
                .HasOne(s => s.Restaurant)
                .WithMany()
                .HasForeignKey(s => s.RestaurantID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Category>()
                .HasOne(c => c.Restaurant)
                .WithMany()
                .HasForeignKey(c => c.RestaurantID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RestaurantSubcategory>()
                 .HasKey(rs => new { rs.RestaurantId, rs.SubcategoryId });

            modelBuilder.Entity<RestaurantSubcategory>()
                 .HasOne(rs => rs.Restaurant)
                 .WithMany(r => r.RestaurantSubcategories)
                 .HasForeignKey(rs => rs.RestaurantId)
                 .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<RestaurantSubcategory>()
                .HasOne(rs => rs.Subcategory)
                .WithMany(s => s.RestaurantSubcategories)
                .HasForeignKey(rs => rs.SubcategoryId)
                .OnDelete(DeleteBehavior.NoAction);

        }


    }
}
