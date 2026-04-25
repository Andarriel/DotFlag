using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DotFlag.DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddDockerFeature : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ContainerPort",
                table: "Challenges",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DockerImage",
                table: "Challenges",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasInstance",
                table: "Challenges",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "ChallengeInstances",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ChallengeId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    ContainerId = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    HostPort = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChallengeInstances", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChallengeInstances_Challenges_ChallengeId",
                        column: x => x.ChallengeId,
                        principalTable: "Challenges",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChallengeInstances_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DockerSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Host = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    MaxGlobalInstances = table.Column<int>(type: "integer", nullable: false),
                    InstanceTimeoutMinutes = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DockerSettings", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "CtfEvents",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2026, 4, 25, 16, 27, 18, 106, DateTimeKind.Utc).AddTicks(8844), new DateTime(2026, 4, 25, 16, 27, 18, 106, DateTimeKind.Utc).AddTicks(8839) });

            migrationBuilder.InsertData(
                table: "DockerSettings",
                columns: new[] { "Id", "Host", "InstanceTimeoutMinutes", "MaxGlobalInstances" },
                values: new object[] { 1, "tcp://localhost:2375", 60, 20 });

            migrationBuilder.CreateIndex(
                name: "IX_ChallengeInstances_ChallengeId",
                table: "ChallengeInstances",
                column: "ChallengeId");

            migrationBuilder.CreateIndex(
                name: "IX_ChallengeInstances_UserId",
                table: "ChallengeInstances",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChallengeInstances");

            migrationBuilder.DropTable(
                name: "DockerSettings");

            migrationBuilder.DropColumn(
                name: "ContainerPort",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "DockerImage",
                table: "Challenges");

            migrationBuilder.DropColumn(
                name: "HasInstance",
                table: "Challenges");

            migrationBuilder.UpdateData(
                table: "CtfEvents",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "EndTime", "StartTime" },
                values: new object[] { new DateTime(2026, 4, 17, 10, 1, 15, 247, DateTimeKind.Utc).AddTicks(2295), new DateTime(2026, 4, 17, 10, 1, 15, 247, DateTimeKind.Utc).AddTicks(2291) });
        }
    }
}
