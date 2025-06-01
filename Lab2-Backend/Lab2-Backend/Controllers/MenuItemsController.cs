using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lab2_Backend.Model;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
        public async Task<ActionResult<MenuItems>> Create(MenuItems menuItem)
        {
            _context.MenuItems.Add(menuItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = menuItem.Id }, menuItem);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, MenuItems updatedItem)
        {
            if (id != updatedItem.Id)
                return BadRequest();

            _context.Entry(updatedItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.MenuItems.Any(m => m.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
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
