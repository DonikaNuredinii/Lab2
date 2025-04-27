using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lab2_Backend.Migrations
{
    /// <inheritdoc />
    public partial class rolefix1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
     
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
     ;
            migrationBuilder.AddColumn<int>(
                name: "CustomerAddressID",
                table: "Roles",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Roles_CustomerAddressID",
                table: "Roles",
                column: "CustomerAddressID");

            migrationBuilder.AddForeignKey(
                name: "FK_Roles_CustomerAddresses_CustomerAddressID",
                table: "Roles",
                column: "CustomerAddressID",
                principalTable: "CustomerAddresses",
                principalColumn: "CustomerAddressID");
        }
    }
}
