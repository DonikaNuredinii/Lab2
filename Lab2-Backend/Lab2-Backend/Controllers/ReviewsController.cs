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

        // GET: api/Reviews
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
        {
            return await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.MenuItem)
                .ToListAsync();
        }

        // GET: api/Reviews/5
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

        // GET: api/Reviews/menuitem/5
        [HttpGet("menuitem/{menuItemId}")]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviewsForMenuItem(int menuItemId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.MenuItemID == menuItemId)
                .Include(r => r.User)
                .ToListAsync();

            return Ok(reviews);
        }

        // POST: api/Reviews
        [HttpPost]
        public async Task<ActionResult<Review>> PostReview(ReviewDTO dto)
        {
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

        // PUT: api/Reviews/5
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
            // CreatedAt nuk ndryshohet në update

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Reviews/5
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
