using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class updb1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PersonalImages_Users_AppUserId",
                table: "PersonalImages");

            migrationBuilder.DropIndex(
                name: "IX_PersonalImages_AppUserId",
                table: "PersonalImages");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "PersonalImages");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "PersonalImages",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "IsAvtar",
                table: "PersonalImages",
                newName: "IsAvatar");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "PersonalImages",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_PersonalImages_UserId",
                table: "PersonalImages",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_PersonalImages_Users_UserId",
                table: "PersonalImages",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PersonalImages_Users_UserId",
                table: "PersonalImages");

            migrationBuilder.DropIndex(
                name: "IX_PersonalImages_UserId",
                table: "PersonalImages");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "PersonalImages",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "IsAvatar",
                table: "PersonalImages",
                newName: "IsAvtar");

            migrationBuilder.AlterColumn<int>(
                name: "UserID",
                table: "PersonalImages",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "AppUserId",
                table: "PersonalImages",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PersonalImages_AppUserId",
                table: "PersonalImages",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_PersonalImages_Users_AppUserId",
                table: "PersonalImages",
                column: "AppUserId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
