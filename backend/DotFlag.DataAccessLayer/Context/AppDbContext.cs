using DotFlag.Domain.Entities.Challenge;
using DotFlag.Domain.Entities.Submission;
using DotFlag.Domain.Entities.Team;
using DotFlag.Domain.Entities.User;
using Microsoft.EntityFrameworkCore;

namespace DotFlag.DataAccessLayer.Context
{
    public class AppDbContext : DbContext
    {
        public DbSet<UserData> Users { get; set; }
        public DbSet<TeamData> Teams { get; set; }
        public DbSet<ChallengeData> Challenges { get; set; }
        public DbSet<SubmissionData> Submissions { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(DbSession.ConnectionString);
        }
    }
}
