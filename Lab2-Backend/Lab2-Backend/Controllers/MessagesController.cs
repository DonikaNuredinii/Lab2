using Lab2_Backend.Model;
using Lab2_Backend.MongoService;
using Microsoft.AspNetCore.Authorization;
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
                .Include(s => s.Role)
                .Where(u => u.RestaurantID == restaurantId && u.Role.RoleName == "Admin")
                .FirstOrDefaultAsync();

            if (adminUser == null)
                return NotFound("Admin not found for this restaurant.");

            return Ok(new { userId = adminUser.UserID });
        }

        [Authorize]
        [HttpGet("conversations")]

        public async Task<IActionResult> GetConversations()
        {
            var claim = User.FindFirst("UserID") ?? User.FindFirst("id"); // fallback
            if (claim == null || !int.TryParse(claim.Value, out int adminId))
                return Unauthorized();

            var messages = await _chatService.GetAllMessages();

            var grouped = messages
                .Where(m => m.SenderId != null && m.ReceiverId != null)
                .GroupBy(m =>
                {
                    return m.SenderId == adminId ? m.ReceiverId : m.SenderId;
                })
                .Select(g => new
                {
                    userId = g.Key,
                    lastMessage = g.OrderByDescending(m => m.Timestamp).FirstOrDefault()
                })
                .OrderByDescending(c => c.lastMessage.Timestamp)
                .ToList();

            return Ok(grouped);
        }

        [HttpGet("{user1Id}/{user2Id}")]
        public async Task<IActionResult> GetMessages(int user1Id, int user2Id)
        {
            var messages = await _chatService.GetMessagesBetween(user1Id, user2Id);
            return Ok(messages);
        }
    }
}
