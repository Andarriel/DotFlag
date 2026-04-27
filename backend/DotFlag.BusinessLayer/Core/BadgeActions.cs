using DotFlag.BusinessLayer.Services;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Entities.Badge;
using DotFlag.Domain.Enums;
using DotFlag.Domain.Models.Badge;
using DotFlag.Domain.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace DotFlag.BusinessLayer.Core
{
    public class BadgeActions
    {
        internal static int GetWeight(BadgeType t) => t switch
        {
            BadgeType.Platinum            => 100,
            BadgeType.Gold                => 90,
            BadgeType.GeniusPerfectionist => 85,
            BadgeType.Silver              => 80,
            BadgeType.Bronze              => 70,
            BadgeType.FirstBlood          => 60,
            BadgeType.Veteran10           => 50,
            BadgeType.Veteran5            => 40,
            BadgeType.Veteran1            => 30,
            BadgeType.Custom              => 20,
            _                             => 0
        };

        protected List<BadgeDto> GetForUserExecution(int userId)
        {
            using var context = new AppDbContext();

            var badges = context.UserBadges
                .Where(b => b.UserId == userId)
                .Select(b => new BadgeDto
                {
                    Id                = b.Id,
                    Type              = b.Type,
                    CtfEventId        = b.CtfEventId,
                    CtfEventName      = b.CtfEvent != null ? b.CtfEvent.Name : null,
                    Placement         = b.Placement,
                    Points            = b.Points,
                    CustomName        = b.CustomName,
                    CustomColor       = b.CustomColor,
                    CustomIcon        = b.CustomIcon,
                    Note              = b.Note,
                    IsManuallyAwarded = b.IsManuallyAwarded,
                    AwardedAt         = b.AwardedAt,
                })
                .OrderByDescending(b => b.AwardedAt)
                .ToList();

            // Attach First Blood breakdown per CTF
            var fbBadges = badges.Where(b => b.Type == BadgeType.FirstBlood).ToList();
            if (fbBadges.Any())
            {
                var allFb = context.UserBadges
                    .Where(b => b.UserId == userId && b.Type == BadgeType.FirstBlood)
                    .Select(b => new { b.CtfEventId, CtfName = b.CtfEvent != null ? b.CtfEvent.Name : "Unknown" })
                    .ToList();

                var breakdown = allFb
                    .GroupBy(x => x.CtfName)
                    .Select(g => new FirstBloodBreakdownDto { CtfEventName = g.Key, Count = g.Count() })
                    .ToList();

                foreach (var fb in fbBadges)
                    fb.FirstBloodBreakdown = breakdown;
            }

            return badges;
        }

        protected ActionResponse AwardExecution(AwardBadgeDto dto, int actorId)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(u => u.Id == dto.UserId);
            if (user == null)
                return new ActionResponse { IsSuccess = false, Message = "User not found." };

            if (dto.Type == BadgeType.Custom && string.IsNullOrWhiteSpace(dto.CustomName))
                return new ActionResponse { IsSuccess = false, Message = "Custom badge requires a name." };

            var badge = new UserBadgeData
            {
                UserId            = dto.UserId,
                Type              = dto.Type,
                CtfEventId        = dto.CtfEventId,
                CustomName        = dto.CustomName,
                CustomColor       = dto.CustomColor,
                CustomIcon        = dto.CustomIcon,
                Note              = dto.Note,
                IsManuallyAwarded = dto.IsManuallyAwarded,
                AwardedByUserId   = actorId,
                AwardedAt         = DateTime.UtcNow,
            };

            context.UserBadges.Add(badge);
            context.SaveChanges();

            AuditLog.Log(actorId, AuditAction.BadgeAwarded, "Badge", badge.Id,
                $"userId={dto.UserId};type={dto.Type};manual={dto.IsManuallyAwarded}");

            return new ActionResponse { IsSuccess = true, Message = "Badge awarded successfully." };
        }

        protected ActionResponse RevokeExecution(int badgeId, int actorId)
        {
            using var context = new AppDbContext();

            var badge = context.UserBadges.FirstOrDefault(b => b.Id == badgeId);
            if (badge == null)
                return new ActionResponse { IsSuccess = false, Message = "Badge not found." };

            context.UserBadges.Remove(badge);
            context.SaveChanges();

            AuditLog.Log(actorId, AuditAction.BadgeRevoked, "Badge", badgeId,
                $"userId={badge.UserId};type={badge.Type}");

            return new ActionResponse { IsSuccess = true, Message = "Badge revoked successfully." };
        }

        // Called by FinalizeCTF and by leaderboard queries
        internal static BadgeDto? GetTopBadge(List<UserBadgeData> userBadges)
        {
            var top = userBadges
                .Where(b => b.Type != BadgeType.FirstBlood) // FirstBlood shown separately
                .OrderByDescending(b => GetWeight(b.Type))
                .FirstOrDefault();

            if (top == null) return null;

            return new BadgeDto
            {
                Id                = top.Id,
                Type              = top.Type,
                CtfEventName      = top.CtfEvent?.Name,
                Placement         = top.Placement,
                Points            = top.Points,
                CustomName        = top.CustomName,
                CustomColor       = top.CustomColor,
                CustomIcon        = top.CustomIcon,
                Note              = top.Note,
                IsManuallyAwarded = top.IsManuallyAwarded,
                AwardedAt         = top.AwardedAt,
            };
        }
    }
}
