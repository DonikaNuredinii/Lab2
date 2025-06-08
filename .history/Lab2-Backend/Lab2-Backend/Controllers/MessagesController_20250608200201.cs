using Lab2_Backend.Model;
using Lab2_Backend.MongoService;
using Microsoft.AspNetCore.Mvc;

namespace Lab2_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly ChatService _chatService;

        public MessagesController(ChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost]
        public async Task<IActionResult> PostMessage([FromBody] ChatMessage message)
        {
            await _chatService.SaveMessage(message);
            return Ok("Message saved.");
        }

        [HttpGet("{user1Id}/{user2Id}")]
        public async Task<IActionResult> GetMessages(int user1Id, int user2Id)
        {
            var messages = await _chatService.GetMessagesBetween(user1Id, user2Id);
            return Ok(messages);
        }
    }
}
