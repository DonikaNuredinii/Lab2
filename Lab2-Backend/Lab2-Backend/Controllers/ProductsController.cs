using Lab2_Backend.DTO;
using Lab2_Backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lab2_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly MyContext _context;
        public ProductsController(MyContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Products>>> GetProducts()
        {
            return await _context.Products.Include(p => p.Restaurant).ToListAsync();
        }

        [HttpGet("restaurant/{restaurantId}")]
        public async Task<ActionResult<IEnumerable<Products>>> GetProductsByRestaurant(int restaurantId)
        {
            return await _context.Products
                .Where(p => p.RestaurantId == restaurantId)
                .Include(p => p.Restaurant)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Products>> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Restaurant)
                .FirstOrDefaultAsync(p => p.ProductsID == id);
            if (product == null) return NotFound();
            return product;
        }

        [HttpPost]
        public async Task<ActionResult<Products>> PostProduct(ProductDTO dto)
        {
            // Verify restaurant exists
            var restaurant = await _context.Restaurants.FindAsync(dto.RestaurantId);
            if (restaurant == null)
            {
                return BadRequest("Restaurant not found");
            }

            var product = new Products
            {
                Emri = dto.Emri,
                Description = dto.Description,
                Price = dto.Price,
                IsActive = dto.IsActive,
                Unit = dto.Unit,
                StockQuantity = dto.StockQuantity,
                Category = dto.Category,
                RestaurantId = dto.RestaurantId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.ProductsID }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, ProductDTO dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            // Verify restaurant exists if changing restaurant
            if (product.RestaurantId != dto.RestaurantId)
            {
                var restaurant = await _context.Restaurants.FindAsync(dto.RestaurantId);
                if (restaurant == null)
                {
                    return BadRequest("Restaurant not found");
                }
            }

            product.Emri = dto.Emri;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.IsActive = dto.IsActive;
            product.Unit = dto.Unit;
            product.StockQuantity = dto.StockQuantity;
            product.Category = dto.Category;
            product.RestaurantId = dto.RestaurantId;
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Products>> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return product;
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<Products>>> GetActiveProducts()
        {
            return await _context.Products
                .Where(p => p.IsActive)
                .Include(p => p.Restaurant)
                .ToListAsync();
        }

        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<Products>>> GetProductsByCategory(string category)
        {
            return await _context.Products
                .Where(p => p.Category == category)
                .Include(p => p.Restaurant)
                .ToListAsync();
        }

        [HttpGet("restaurant/{restaurantId}/active")]
        public async Task<ActionResult<IEnumerable<Products>>> GetActiveProductsByRestaurant(int restaurantId)
        {
            return await _context.Products
                .Where(p => p.RestaurantId == restaurantId && p.IsActive)
                .Include(p => p.Restaurant)
                .ToListAsync();
        }
    }
}
