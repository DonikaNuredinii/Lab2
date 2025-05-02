using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using Lab2_Backend; 
using Lab2_Backend.Configurations;

namespace Lab2_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MongoTestController : ControllerBase
    {
        private readonly IMongoClient _client;
        private readonly MongoDBSettings _settings;

        public MongoTestController(IMongoClient client, IOptions<MongoDBSettings> settings)
        {
            _client = client;
            _settings = settings.Value;
        }

        [HttpGet("ping")]
        public IActionResult TestConnection()
        {
            var database = _client.GetDatabase(_settings.DatabaseName);
            var collectionNames = database.ListCollectionNames().ToList();
            return Ok(collectionNames);
        }
    }
}
