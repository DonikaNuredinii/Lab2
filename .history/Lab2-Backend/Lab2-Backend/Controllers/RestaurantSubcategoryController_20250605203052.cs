using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lab2_Backend.Model;

namespace Lab2_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RestaurantSubcategoryController : ControllerBase
    {
        private readonly MyContext _context;

        public RestaurantSubcategoryController(MyContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Assign(RestaurantSubcategory model)
        {
            _context.RestaurantSubcategories.Add(model);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _context.RestaurantSubcategories
                .Include(r => r.Restaurant)
                .Include(s => s.Subcategory)
                .ToListAsync();

            return Ok(data);
        }
    }
}
