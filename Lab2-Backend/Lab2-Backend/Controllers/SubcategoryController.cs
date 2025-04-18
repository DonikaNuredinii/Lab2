using Lab2_Backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lab2_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubcategoryController : ControllerBase
    {
        private readonly MyContext _context;
        public SubcategoryController(MyContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Subcategory>>> GetSubcategories()
        {
            return await _context.Subcategories.ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Subcategory>> GetCategory(int id)
        {
            var Subcategory = await _context.Subcategories.FindAsync(id);
            if (Subcategory == null)
            {
                return NotFound();
            }
            return Subcategory;

        }
        [HttpPost]
        public async Task<ActionResult<Subcategory>> PostCategory(Subcategory Subcategory)
        {
            _context.Subcategories.Add(Subcategory);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetCategory", new { id = Subcategory.ID }, Subcategory);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, Subcategory Subcategory)
        {
            if (id != Subcategory.ID)
            {
                return BadRequest();
            }

            _context.Entry(Subcategory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Category/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Subcategory>> DeleteCategory(int id)
        {
            var Subcategory = await _context.Subcategories.FindAsync(id);
            if (Subcategory == null)
            {
                return NotFound();
            }

            _context.Subcategories.Remove(Subcategory);
            await _context.SaveChangesAsync();

            return Subcategory;
        }

        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.ID == id);
        }

    }
}
