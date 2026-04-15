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
        public DbSet<HintData> Hints { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(DbSession.ConnectionString);
        }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Team are unique InviteCode
            modelBuilder.Entity<TeamData>()
                .HasIndex(t => t.InviteCode)
                .IsUnique();

            // Team -> Users
            modelBuilder.Entity<UserData>()
                .HasOne(u => u.Team)
                .WithMany(t => t.Members)
                .HasForeignKey(u => u.TeamId)
                .OnDelete(DeleteBehavior.SetNull);

            // User ->Submissions
            modelBuilder.Entity<SubmissionData>()
                .HasOne(s => s.User)
                .WithMany(u => u.Submissions)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Challenge ->  Submissions
            modelBuilder.Entity<SubmissionData>()
                .HasOne(s => s.Challenge)
                .WithMany(c => c.Submissions)
                .HasForeignKey(s => s.ChallengeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Challenge -> Hints
            modelBuilder.Entity<HintData>()
                .HasOne(h => h.Challenge)
                .WithMany(c => c.Hints)
                .HasForeignKey(h => h.ChallengeId)
                .OnDelete(DeleteBehavior.Cascade);

            // User -> Notifications
            modelBuilder.Entity<NotificationData>()
                .HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        }

    }
}
