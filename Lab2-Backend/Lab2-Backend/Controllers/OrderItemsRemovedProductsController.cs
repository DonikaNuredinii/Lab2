using Lab2_Backend.DTO;
using Lab2_Backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lab2_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemsRemovedProductsController : ControllerBase
    {
        private readonly MyContext _context;
        public OrderItemsRemovedProductsController(MyContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderItems_RemovedProducts>>> GetRemovedProducts()
        {
            return await _context.OrderItems_RemovedProducts.Include(rp => rp.OrderItems).Include(rp => rp.Products).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderItems_RemovedProducts>> GetRemovedProduct(int id)
        {
            var item = await _context.OrderItems_RemovedProducts.Include(rp => rp.OrderItems).Include(rp => rp.Products).FirstOrDefaultAsync(rp => rp.OIRPID == id);
            if (item == null) return NotFound();
            return item;
        }

        [HttpPost]
        public async Task<ActionResult<OrderItems_RemovedProducts>> PostRemovedProduct(OrderItemsRemovedProductDTO dto)
        {
            var item = new OrderItems_RemovedProducts
            {
                OrderItemsID = dto.OrderItemsID,
                ProductsID = dto.ProductsID
            };

            _context.OrderItems_RemovedProducts.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRemovedProduct), new { id = item.OIRPID }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutRemovedProduct(int id, OrderItemsRemovedProductDTO dto)
        {
            var item = await _context.OrderItems_RemovedProducts.FindAsync(id);
            if (item == null) return NotFound();

            item.OrderItemsID = dto.OrderItemsID;
            item.ProductsID = dto.ProductsID;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<OrderItems_RemovedProducts>> DeleteRemovedProduct(int id)
        {
            var item = await _context.OrderItems_RemovedProducts.FindAsync(id);
            if (item == null) return NotFound();

            _context.OrderItems_RemovedProducts.Remove(item);
            await _context.SaveChangesAsync();
            return item;
        }
    }
}
