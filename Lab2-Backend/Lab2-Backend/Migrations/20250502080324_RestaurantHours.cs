using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lab2_Backend.Migrations
{
    /// <inheritdoc />
    public partial class RestaurantHours : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RestaurantHours",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RestaurantID = table.Column<int>(type: "int", nullable: false),
                    Dita = table.Column<int>(type: "int", nullable: false),
                    OraHapjes = table.Column<TimeSpan>(type: "time", nullable: false),
                    OraMbylljes = table.Column<TimeSpan>(type: "time", nullable: false),
                    IsClosed = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RestaurantHours", x => x.ID);
                    table.ForeignKey(
                        name: "FK_RestaurantHours_Restaurants_RestaurantID",
                        column: x => x.RestaurantID,
                        principalTable: "Restaurants",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RestaurantHours_RestaurantID",
                table: "RestaurantHours",
                column: "RestaurantID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RestaurantHours");
        }
    }
}
