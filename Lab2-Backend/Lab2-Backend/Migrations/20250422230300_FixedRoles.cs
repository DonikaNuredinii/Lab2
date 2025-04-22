using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lab2_Backend.Migrations
{
    /// <inheritdoc />
    public partial class FixedRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RolesID",
                table: "Roles",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RolesID",
                table: "Roles");
        }
    }
}
