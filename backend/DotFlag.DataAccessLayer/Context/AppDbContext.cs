using DotFlag.Domain.Entities.Challenge;
using DotFlag.Domain.Entities.Notification;
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
        public DbSet<NotificationData> Notifications { get; set; }
        public DbSet<UserNotificationData> UserNotifications { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(DbSession.ConnectionString);
        }

        // Facem Unique InviteCode pentru echipe, ca sa nu avem probleme cu coduri duplicate
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TeamData>()
                .HasIndex(t => t.InviteCode)
                .IsUnique();
        }

    }
}
