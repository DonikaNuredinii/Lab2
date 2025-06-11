using Lab2_Backend.DTO;
using Lab2_Backend.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lab2_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly MyContext _context;

        public ReviewsController(MyContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReviewDTO>>> GetReviews()
        {
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.MenuItem)
                .ToListAsync();

            var dtoList = reviews.Select(r => new ReviewDTO
            {
                ReviewID = r.ReviewID,
                MenuItemID = r.MenuItemID,
                UserID = r.UserID,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt,
                UserName = r.User != null ? $"{r.User.FirstName} {r.User.LastName}" : "Unknown",
                MenuItemName = r.MenuItem != null ? r.MenuItem.Name : "Unknown"
            });

            return Ok(dtoList);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Review>> GetReview(int id)
        {
            var review = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.MenuItem)
                .FirstOrDefaultAsync(r => r.ReviewID == id);

            if (review == null)
                return NotFound();

            return review;
        }

        [HttpGet("menuitem/{menuItemId}")]
        public async Task<ActionResult<IEnumerable<ReviewDTO>>> GetReviewsForMenuItem(int menuItemId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.MenuItemID == menuItemId)
                .Include(r => r.User)
                .ToListAsync();

            var dtoList = reviews.Select(r => new ReviewDTO
            {
                ReviewID = r.ReviewID,
                MenuItemID = r.MenuItemID,
                UserID = r.UserID,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt,
                UserName = r.User != null ? $"{r.User.FirstName} {r.User.LastName}" : "Unknown"
            });

            return Ok(dtoList);
        }

        [HttpPost]
        public async Task<ActionResult<Review>> PostReview(ReviewDTO dto)
        {
            var exists = await _context.Reviews
                .AnyAsync(r => r.UserID == dto.UserID && r.MenuItemID == dto.MenuItemID);

            if (exists)
                return Conflict("User has already reviewed this menu item.");

            var review = new Review
            {
                MenuItemID = dto.MenuItemID,
                UserID = dto.UserID,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReview), new { id = review.ReviewID }, review);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutReview(int id, ReviewDTO dto)
        {
            if (id != dto.ReviewID)
                return BadRequest();

            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
                return NotFound();

            review.Rating = dto.Rating;
            review.Comment = dto.Comment;
            review.MenuItemID = dto.MenuItemID;
            review.UserID = dto.UserID;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
                return NotFound();

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
