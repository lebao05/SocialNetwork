using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class updb2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserRelationshipRequests_RelationshipStatuses_StatusId",
                table: "UserRelationshipRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRelationships_RelationshipTypes_TypeId",
                table: "UserRelationships");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_RelationshipStatuses_RelationshipStatusId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "RelationshipStatuses");

            migrationBuilder.DropIndex(
                name: "IX_UserRelationships_TypeId",
                table: "UserRelationships");

            migrationBuilder.DropIndex(
                name: "IX_UserRelationshipRequests_StatusId",
                table: "UserRelationshipRequests");

            migrationBuilder.DropColumn(
                name: "TypeId",
                table: "UserRelationships");

            migrationBuilder.DropColumn(
                name: "StatusId",
                table: "UserRelationshipRequests");

            migrationBuilder.RenameColumn(
                name: "RelationshipStatusId",
                table: "Users",
                newName: "RelationshipTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_Users_RelationshipStatusId",
                table: "Users",
                newName: "IX_Users_RelationshipTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_RelationshipTypes_RelationshipTypeId",
                table: "Users",
                column: "RelationshipTypeId",
                principalTable: "RelationshipTypes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_RelationshipTypes_RelationshipTypeId",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "RelationshipTypeId",
                table: "Users",
                newName: "RelationshipStatusId");

            migrationBuilder.RenameIndex(
                name: "IX_Users_RelationshipTypeId",
                table: "Users",
                newName: "IX_Users_RelationshipStatusId");

            migrationBuilder.AddColumn<string>(
                name: "TypeId",
                table: "UserRelationships",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StatusId",
                table: "UserRelationshipRequests",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "RelationshipStatuses",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RelationshipStatuses", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserRelationships_TypeId",
                table: "UserRelationships",
                column: "TypeId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRelationshipRequests_StatusId",
                table: "UserRelationshipRequests",
                column: "StatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserRelationshipRequests_RelationshipStatuses_StatusId",
                table: "UserRelationshipRequests",
                column: "StatusId",
                principalTable: "RelationshipStatuses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRelationships_RelationshipTypes_TypeId",
                table: "UserRelationships",
                column: "TypeId",
                principalTable: "RelationshipTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_RelationshipStatuses_RelationshipStatusId",
                table: "Users",
                column: "RelationshipStatusId",
                principalTable: "RelationshipStatuses",
                principalColumn: "Id");
        }
    }
}
