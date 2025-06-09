using Lab2_Backend.DTO;
using Lab2_Backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lab2_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly MyContext _context;

        public CommentsController(MyContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommentDTO>>> GetAllComments()
        {
            var comments = await _context.Comments.ToListAsync();
            var dto = comments.Select(c => new CommentDTO
            {
                CommentID = c.CommentID,
                Content = c.Content,
                ReviewID = c.ReviewID,
                MenuItemID = c.MenuItemID,
                UserID = c.UserID,
                CreatedAt = c.CreatedAt
            });

            return Ok(dto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CommentDTO>> GetComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return NotFound();

            return new CommentDTO
            {
                CommentID = comment.CommentID,
                Content = comment.Content,
                ReviewID = comment.ReviewID,
                MenuItemID = comment.MenuItemID,
                UserID = comment.UserID,
                CreatedAt = comment.CreatedAt
            };
        }

        [HttpPost]
        public async Task<ActionResult<Comment>> CreateComment(CommentDTO dto)
        {
            if (dto.ReviewID == null && dto.MenuItemID == null)
                return BadRequest("You must link comment either to a ReviewID or a MenuItemID.");

            var comment = new Comment
            {
                Content = dto.Content,
                ReviewID = dto.ReviewID,
                MenuItemID = dto.MenuItemID,
                UserID = dto.UserID,
                CreatedAt = dto.CreatedAt
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetComment), new { id = comment.CommentID }, dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, CommentDTO dto)
        {
            if (id != dto.CommentID) return BadRequest();

            var existing = await _context.Comments.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Content = dto.Content;
            existing.ReviewID = dto.ReviewID;
            existing.MenuItemID = dto.MenuItemID;
            existing.UserID = dto.UserID;
            existing.CreatedAt = dto.CreatedAt;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return NotFound();

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
