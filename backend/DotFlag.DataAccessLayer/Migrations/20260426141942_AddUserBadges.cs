using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DotFlag.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddUserBadges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFinalized",
                table: "CtfEvents",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "UserBadges",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    CtfEventId = table.Column<int>(type: "integer", nullable: true),
                    Placement = table.Column<int>(type: "integer", nullable: true),
                    Points = table.Column<int>(type: "integer", nullable: true),
                    CustomName = table.Column<string>(type: "text", nullable: true),
                    CustomColor = table.Column<string>(type: "text", nullable: true),
                    CustomIcon = table.Column<string>(type: "text", nullable: true),
                    Note = table.Column<string>(type: "text", nullable: true),
                    IsManuallyAwarded = table.Column<bool>(type: "boolean", nullable: false),
                    AwardedByUserId = table.Column<int>(type: "integer", nullable: true),
                    AwardedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserBadges", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserBadges_CtfEvents_CtfEventId",
                        column: x => x.CtfEventId,
                        principalTable: "CtfEvents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_UserBadges_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "CtfEvents",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "EndTime", "IsFinalized", "StartTime" },
                values: new object[] { new DateTime(2026, 4, 26, 14, 19, 42, 522, DateTimeKind.Utc).AddTicks(8803), false, new DateTime(2026, 4, 26, 14, 19, 42, 522, DateTimeKind.Utc).AddTicks(8801) });

            migrationBuilder.CreateIndex(
                name: "IX_UserBadges_CtfEventId",
                table: "UserBadges",
                column: "CtfEventId");

            migrationBuilder.CreateIndex(
                name: "IX_UserBadges_UserId",
                table: "UserBadges",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserBadges");

            migrationBuilder.DropColumn(
                name: "IsFinalized",
                table: "CtfEvents");

            migrationBuilder.UpdateData(
                table: "CtfEvents",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2026, 4, 26, 2, 19, 27, 790, DateTimeKind.Utc).AddTicks(5617), new DateTime(2026, 4, 26, 2, 19, 27, 790, DateTimeKind.Utc).AddTicks(5615) });
        }
    }
}
