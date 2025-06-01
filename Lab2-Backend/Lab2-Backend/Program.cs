using Lab2_Backend;
using Lab2_Backend.Configurations;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;
using System.Runtime.InteropServices;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var isWindows = RuntimeInformation.IsOSPlatform(OSPlatform.Windows);
var connectionString = isWindows
    ? builder.Configuration.GetConnectionString("TrustedConnection")
    : builder.Configuration.GetConnectionString("SqlAuthConnection");

builder.Services.AddDbContext<MyContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection("MongoDBSettings"));

builder.Services.AddSingleton<IMongoClient>(s =>
    new MongoClient(builder.Configuration["MongoDBSettings:ConnectionString"]));


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();
app.MapControllers();
app.Run();
