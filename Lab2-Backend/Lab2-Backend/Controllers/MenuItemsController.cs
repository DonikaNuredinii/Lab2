using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lab2_Backend.Model;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lab2_Backend.DTO;

namespace Lab2_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuItemsController : ControllerBase
    {
        private readonly MyContext _context;

        public MenuItemsController(MyContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuItems>>> GetAll()
        {
            var items = await _context.MenuItems.ToListAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MenuItems>> GetById(int id)
        {
            var item = await _context.MenuItems.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<MenuItems>> Create(MenuItemWithProductsDTO dto)
        {
            var newItem = new MenuItems
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Image = dto.Image,
                SubCategoryId = dto.SubCategoryId,
                IsActive = dto.IsActive,
                RestaurantId = dto.RestaurantId,
                UpdatedAt = dto.UpdatedAt
            };

            _context.MenuItems.Add(newItem);
            await _context.SaveChangesAsync();

            if (dto.ProductIds != null && dto.ProductIds.Any())
            {
                foreach (var productId in dto.ProductIds)
                {
                    _context.MenuItemProducts.Add(new MenuItemProducts
                    {
                        MenuItemID = newItem.Id,
                        ProductsID = productId,
                        IsRequired = true
                    });
                }
                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetById), new { id = newItem.Id }, newItem);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] MenuItemWithProductsDTO dto)
        {
            var existingItem = await _context.MenuItems.FindAsync(id);
            if (existingItem == null)
                return NotFound(new { message = "Menu item not found." });

            existingItem.Name = dto.Name;
            existingItem.Description = dto.Description;
            existingItem.Price = dto.Price;
            existingItem.Image = dto.Image;
            existingItem.SubCategoryId = dto.SubCategoryId;
            existingItem.IsActive = dto.IsActive;
            existingItem.RestaurantId = dto.RestaurantId;
            existingItem.UpdatedAt = dto.UpdatedAt;

            var existingLinks = _context.MenuItemProducts.Where(m => m.MenuItemID == id);
            _context.MenuItemProducts.RemoveRange(existingLinks);

            if (dto.ProductIds != null && dto.ProductIds.Any())
            {
                foreach (var productId in dto.ProductIds.Distinct())
                {
                    _context.MenuItemProducts.Add(new MenuItemProducts
                    {
                        MenuItemID = id,
                        ProductsID = productId,
                        IsRequired = true
                    });
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Menu item updated successfully." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.MenuItems.FindAsync(id);
            if (item == null) return NotFound();

            _context.MenuItems.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
