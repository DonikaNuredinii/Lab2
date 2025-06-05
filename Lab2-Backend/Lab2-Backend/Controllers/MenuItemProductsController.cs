using Lab2_Backend.DTO;
using Lab2_Backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lab2_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuItemProductsController : ControllerBase
    {
        private readonly MyContext _context;
        public MenuItemProductsController(MyContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuItemProducts>>> GetMenuItemProducts()
        {
            return await _context.MenuItemProducts.Include(mip => mip.MenuItems).Include(mip => mip.Products).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MenuItemProducts>> GetMenuItemProduct(int id)
        {
            var item = await _context.MenuItemProducts.Include(mip => mip.MenuItems).Include(mip => mip.Products).FirstOrDefaultAsync(mip => mip.MIProducts == id);
            if (item == null) return NotFound();
            return item;
        }

        [HttpGet("menuitem/{menuItemId}")]
        public async Task<ActionResult<IEnumerable<string>>> GetProductsForMenuItem(int menuItemId)
        {
            var productNames = await _context.MenuItemProducts
                .Where(mip => mip.MenuItemID == menuItemId)
                .Include(mip => mip.Products)
                .Select(mip => mip.Products.Emri)
                .ToListAsync();

            return Ok(productNames);
        }

        [HttpPost]
        public async Task<ActionResult<MenuItemProducts>> PostMenuItemProduct(MenuItemProductDTO dto)
        {
            var item = new MenuItemProducts
            {
                MenuItemID = dto.MenuItemID,
                ProductsID = dto.ProductsID,
                IsRequired = dto.IsRequired
            };

            _context.MenuItemProducts.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMenuItemProduct), new { id = item.MIProducts }, item);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutMenuItemProduct(int id, MenuItemProductDTO dto)
        {
            var item = await _context.MenuItemProducts.FindAsync(id);
            if (item == null) return NotFound();

            item.MenuItemID = dto.MenuItemID;
            item.ProductsID = dto.ProductsID;
            item.IsRequired = dto.IsRequired;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<MenuItemProducts>> DeleteMenuItemProduct(int id)
        {
            var item = await _context.MenuItemProducts.FindAsync(id);
            if (item == null) return NotFound();

            _context.MenuItemProducts.Remove(item);
            await _context.SaveChangesAsync();
            return item;
        }
    }
}
