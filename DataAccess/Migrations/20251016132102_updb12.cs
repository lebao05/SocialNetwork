using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class updb12 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserMessages_ReactionTypes_ReactionId",
                table: "UserMessages");

            migrationBuilder.DropIndex(
                name: "IX_UserMessages_ReactionId",
                table: "UserMessages");

            migrationBuilder.DropColumn(
                name: "ReactionId",
                table: "UserMessages");

            migrationBuilder.AddColumn<string>(
                name: "Reaction",
                table: "UserMessages",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Reaction",
                table: "UserMessages");

            migrationBuilder.AddColumn<string>(
                name: "ReactionId",
                table: "UserMessages",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserMessages_ReactionId",
                table: "UserMessages",
                column: "ReactionId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserMessages_ReactionTypes_ReactionId",
                table: "UserMessages",
                column: "ReactionId",
                principalTable: "ReactionTypes",
                principalColumn: "Id");
        }
    }
}
