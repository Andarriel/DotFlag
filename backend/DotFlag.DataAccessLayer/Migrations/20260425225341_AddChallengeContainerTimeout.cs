using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DotFlag.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddChallengeContainerTimeout : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ContainerTimeoutMinutes",
                table: "Challenges",
                type: "integer",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "CtfEvents",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2026, 4, 25, 22, 53, 40, 781, DateTimeKind.Utc).AddTicks(7111), new DateTime(2026, 4, 25, 22, 53, 40, 781, DateTimeKind.Utc).AddTicks(7108) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContainerTimeoutMinutes",
                table: "Challenges");

            migrationBuilder.UpdateData(
                table: "CtfEvents",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2026, 4, 25, 18, 27, 33, 669, DateTimeKind.Utc).AddTicks(3235), new DateTime(2026, 4, 25, 18, 27, 33, 669, DateTimeKind.Utc).AddTicks(3232) });
        }
    }
}
