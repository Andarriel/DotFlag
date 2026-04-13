using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DotFlag.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddSubmissionBonusPoints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BonusPoints",
                table: "Submissions",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BonusPoints",
                table: "Submissions");
        }
    }
}
