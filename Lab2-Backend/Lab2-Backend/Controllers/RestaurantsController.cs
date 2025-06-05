using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lab2_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RestaurantsController : ControllerBase
    {
        private readonly MyContext _context;

        public RestaurantsController(MyContext context)
        {
            _context = context;
        }

        [HttpGet("byname/{name}")]
        public async Task<ActionResult<int>> GetRestaurantIdByName(string name)
        {
            var restaurant = await _context.Restaurants.FirstOrDefaultAsync(r => r.Emri == name);

            if (restaurant == null)
            {
                return NotFound("Restaurant not found");
            }

            return restaurant.ID;
        }
    }
} 