using Microsoft.EntityFrameworkCore;

namespace Lab2_Backend
{
    public class MyContext : DbContext
    {
        public MyContext(DbContextOptions<MyContext> options) : base(options)
        {
        }

        // Example table (DbSet
    }
}
