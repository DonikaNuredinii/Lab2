using Lab2_Backend.DTO;
using Lab2_Backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lab2_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductNotesController : ControllerBase
    {
        private readonly MyContext _context;
        public ProductNotesController(MyContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductNotes>>> GetProductNotes()
        {
            return await _context.ProductNotes.Include(pn => pn.MenuItems).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductNotes>> GetProductNote(int id)
        {
            var note = await _context.ProductNotes.Include(pn => pn.MenuItems).FirstOrDefaultAsync(pn => pn.ProductNotesID == id);
            if (note == null) return NotFound();
            return note;
        }

        [HttpPost]
        public async Task<ActionResult<ProductNotes>> PostProductNote(ProductNoteDTO dto)
        {
            var note = new ProductNotes
            {
                MenuItemsID = dto.MenuItemsID,
                Note = dto.Note,
                CreatedAt = dto.CreatedAt
            };

            _context.ProductNotes.Add(note);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductNote), new { id = note.ProductNotesID }, note);
        }


        [HttpPost("multiple")]
        public async Task<IActionResult> PostMultipleProductNotes(List<ProductNoteDTO> notes)
        {
            foreach (var dto in notes)
            {
                var note = new ProductNotes
                {
                    MenuItemsID = dto.MenuItemsID,
                    Note = dto.Note,
                    CreatedAt = dto.CreatedAt
                };

                _context.ProductNotes.Add(note);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Product notes saved successfully." });
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductNote(int id, ProductNoteDTO dto)
        {
            var note = await _context.ProductNotes.FindAsync(id);
            if (note == null) return NotFound();

            note.MenuItemsID = dto.MenuItemsID;
            note.Note = dto.Note;
            note.CreatedAt = dto.CreatedAt;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ProductNotes>> DeleteProductNote(int id)
        {
            var note = await _context.ProductNotes.FindAsync(id);
            if (note == null) return NotFound();

            _context.ProductNotes.Remove(note);
            await _context.SaveChangesAsync();
            return note;
        }
    }
}
