using Lab2_Backend;
using Lab2_Backend.Configurations;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using System.Runtime.InteropServices;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Choose connection string based on OS
var isWindows = RuntimeInformation.IsOSPlatform(OSPlatform.Windows);
var connectionString = isWindows
    ? builder.Configuration.GetConnectionString("TrustedConnection")
    : builder.Configuration.GetConnectionString("SqlAuthConnection");

// Register DbContext
builder.Services.AddDbContext<MyContext>(options =>
    options.UseSqlServer(connectionString));

// MongoDB setup
builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection("MongoDBSettings"));

builder.Services.AddSingleton<IMongoClient>(s =>
    new MongoClient(builder.Configuration["MongoDBSettings:ConnectionString"]));



// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
