using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lab2_Backend.Migrations
{
    /// <inheritdoc />
    public partial class StaffFinalFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customers_Users_UserID",
                table: "Customers");

            migrationBuilder.DropForeignKey(
                name: "FK_Staff_Users_UserID",
                table: "Staff");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Users",
                newName: "ID");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Staff",
                newName: "ID");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Customers",
                newName: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Customers_Users_ID",
                table: "Customers",
                column: "ID",
                principalTable: "Users",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Staff_Users_ID",
                table: "Staff",
                column: "ID",
                principalTable: "Users",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customers_Users_ID",
                table: "Customers");

            migrationBuilder.DropForeignKey(
                name: "FK_Staff_Users_ID",
                table: "Staff");

            migrationBuilder.RenameColumn(
                name: "ID",
                table: "Users",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "ID",
                table: "Staff",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "ID",
                table: "Customers",
                newName: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Customers_Users_UserID",
                table: "Customers",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Staff_Users_UserID",
                table: "Staff",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
