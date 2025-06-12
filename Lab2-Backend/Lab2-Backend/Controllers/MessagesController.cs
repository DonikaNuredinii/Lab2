using Lab2_Backend.Model;
using Lab2_Backend.MongoService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lab2_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly ChatService _chatService;
        private readonly MyContext _context;

        public MessagesController(ChatService chatService, MyContext context)
        {
            _chatService = chatService;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> PostMessage([FromBody] ChatMessage message)
        {
            await _chatService.SaveMessage(message);
            return Ok("Message saved.");
        }
        [HttpGet("admin/{restaurantId}")]
        public async Task<IActionResult> GetAdminForRestaurant(int restaurantId)
        {
            var adminUser = await _context.Staff
                .Where(u => u.RestaurantID == restaurantId && u.Role.RoleName == "Admin")
                .FirstOrDefaultAsync();

            if (adminUser == null)
                return NotFound("Admin not found for this restaurant.");

            return Ok(new { userId = adminUser.UserID });
        }


        [HttpGet("{user1Id}/{user2Id}")]
        public async Task<IActionResult> GetMessages(int user1Id, int user2Id)
        {
            var messages = await _chatService.GetMessagesBetween(user1Id, user2Id);
            return Ok(messages);
        }
    }
}
