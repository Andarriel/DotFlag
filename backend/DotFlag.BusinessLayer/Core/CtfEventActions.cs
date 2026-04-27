using AutoMapper;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Entities.Badge;
using DotFlag.Domain.Enums;
using DotFlag.Domain.Models.CtfEvent;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Core
{
    public class CtfEventActions
    {
        protected readonly IMapper _mapper;

        protected CtfEventActions(IMapper mapper) 
        {
            _mapper = mapper;
        }

        protected CtfEventDto GetExecution()
        {
            using var context = new AppDbContext();
            var entity = context.CtfEvents.FirstOrDefault();

            if (entity == null)
                throw new InvalidOperationException("CtfEvent seed row missing");

            var dto = _mapper.Map<CtfEventDto>(entity);

            if (entity.IsComingSoon)
            {
                dto.State = CtfState.ComingSoon;
                return dto;
            }

            var now = DateTime.UtcNow;

            if (now < entity.StartTime)
                dto.State = CtfState.Upcoming;

            else if (now <= entity.EndTime)
                dto.State = CtfState.Running;

            else
                dto.State = CtfState.Ended;

            return dto;
        }

        protected ActionResponse UpdateExecution(UpdateCtfEventDto dto)
        {
            using var context = new AppDbContext();

            var CtfEvent = context.CtfEvents.FirstOrDefault();

            if(CtfEvent == null)
                return new ActionResponse() { IsSuccess = false, Message = "There is no CtfEvent inside of Postgre" };

            if (!dto.IsComingSoon && dto.EndTime <= dto.StartTime)
                return new ActionResponse { IsSuccess = false, Message = "EndTime must be after StartTime" };

            CtfEvent.Name = dto.Name;
            CtfEvent.IsComingSoon = dto.IsComingSoon;

            if (!dto.IsComingSoon)
            {
                CtfEvent.StartTime = DateTime.SpecifyKind(dto.StartTime, DateTimeKind.Utc);
                CtfEvent.EndTime = DateTime.SpecifyKind(dto.EndTime, DateTimeKind.Utc);
            }

            context.SaveChanges();

            return new ActionResponse() { IsSuccess = true, Message = "Ctf details was updated!" };
        }

        protected List<CtfEventDto> GetAllExecution()
        {
            using var context = new AppDbContext();
            return context.CtfEvents
                .OrderByDescending(c => c.StartTime)
                .Select(c => new CtfEventDto
                {
                    Id          = c.Id,
                    Name        = c.Name,
                    StartTime   = c.StartTime,
                    EndTime     = c.EndTime,
                    IsFinalized = c.IsFinalized,
                })
                .ToList();
        }

        protected ActionResponse FinalizeCTFExecution(int ctfEventId, int actorId)
        {
            using var context = new AppDbContext();

            var ctf = context.CtfEvents.FirstOrDefault(c => c.Id == ctfEventId);
            if (ctf == null)
                return new ActionResponse { IsSuccess = false, Message = "CTF event not found." };
            if (ctf.IsFinalized)
                return new ActionResponse { IsSuccess = false, Message = "CTF is already finalized." };

            var ctfStart = ctf.StartTime;
            var ctfEnd   = ctf.EndTime;

            // ── 1. Final leaderboard (submissions within CTF window)
            var rawSubs = context.Submissions
                .Where(s => s.IsCorrect && !s.User.IsBanned
                         && s.CreatedOn >= ctfStart && s.CreatedOn <= ctfEnd)
                .Select(s => new
                {
                    s.UserId,
                    Username     = s.User.Username,
                    ActivePoints = s.Challenge.IsActive ? s.Challenge.CurrentPoints + s.BonusPoints : 0,
                    s.CompensationPoints,
                    s.ChallengeId,
                    Timestamp    = s.CreatedOn,
                })
                .ToList();

            var ranked = rawSubs
                .GroupBy(s => s.UserId)
                .Select(g => new
                {
                    UserId   = g.Key,
                    Username = g.First().Username,
                    Score    = g.Sum(s => s.ActivePoints + s.CompensationPoints),
                })
                .Where(e => e.Score > 0)
                .OrderByDescending(e => e.Score)
                .ToList();

            var toAdd = new List<UserBadgeData>();

            // ── 2. Placement medals (top 3)
            var placementMap = new Dictionary<int, BadgeType>
            {
                { 1, BadgeType.Gold },
                { 2, BadgeType.Silver },
                { 3, BadgeType.Bronze },
            };

            for (int i = 0; i < Math.Min(3, ranked.Count); i++)
            {
                var entry     = ranked[i];
                var badgeType = placementMap[i + 1];

                toAdd.Add(new UserBadgeData
                {
                    UserId          = entry.UserId,
                    Type            = badgeType,
                    CtfEventId      = ctfEventId,
                    Placement       = i + 1,
                    Points          = entry.Score,
                    AwardedByUserId = actorId,
                    AwardedAt       = DateTime.UtcNow,
                });
            }

            // ── 3. Platinum — anyone who now has 2+ Gold badges (including the one just added)
            var goldUserIds = toAdd.Where(b => b.Type == BadgeType.Gold).Select(b => b.UserId).ToList();
            foreach (var uid in goldUserIds)
            {
                var existingGolds = context.UserBadges.Count(b => b.UserId == uid && b.Type == BadgeType.Gold);
                // existingGolds + 1 (the one we're about to add) >= 2
                if (existingGolds >= 1 && !context.UserBadges.Any(b => b.UserId == uid && b.Type == BadgeType.Platinum))
                {
                    toAdd.Add(new UserBadgeData
                    {
                        UserId          = uid,
                        Type            = BadgeType.Platinum,
                        AwardedByUserId = actorId,
                        AwardedAt       = DateTime.UtcNow,
                    });
                }
            }

            // ── 4. First Blood — first correct submission per challenge during CTF window
            var challengeIds = rawSubs.Select(s => s.ChallengeId).Distinct().ToList();
            foreach (var cid in challengeIds)
            {
                var first = rawSubs
                    .Where(s => s.ChallengeId == cid)
                    .OrderBy(s => s.Timestamp)
                    .FirstOrDefault();

                if (first != null)
                {
                    toAdd.Add(new UserBadgeData
                    {
                        UserId          = first.UserId,
                        Type            = BadgeType.FirstBlood,
                        CtfEventId      = ctfEventId,
                        AwardedByUserId = actorId,
                        AwardedAt       = DateTime.UtcNow,
                    });
                }
            }

            // ── 5. Genius Perfectionist — solved ALL active challenges before CTF ended
            var activeChallengeIds = context.Challenges
                .Where(c => c.IsActive)
                .Select(c => c.Id)
                .ToList();

            if (activeChallengeIds.Any())
            {
                var userSolvedChallenges = rawSubs
                    .GroupBy(s => s.UserId)
                    .Where(g => activeChallengeIds.All(cid => g.Any(s => s.ChallengeId == cid)))
                    .Select(g => g.Key)
                    .ToList();

                foreach (var uid in userSolvedChallenges)
                {
                    toAdd.Add(new UserBadgeData
                    {
                        UserId          = uid,
                        Type            = BadgeType.GeniusPerfectionist,
                        CtfEventId      = ctfEventId,
                        AwardedByUserId = actorId,
                        AwardedAt       = DateTime.UtcNow,
                    });
                }
            }

            // ── 6. Participation milestones (Veteran 1/5/10)
            var participatingUserIds = rawSubs.Select(s => s.UserId).Distinct().ToList();
            foreach (var uid in participatingUserIds)
            {
                // Count total CTFs participated in (existing badges + this one)
                var prevCtfs = context.UserBadges
                    .Where(b => b.UserId == uid && b.Type == BadgeType.Veteran1 && b.CtfEventId != null)
                    .Select(b => b.CtfEventId)
                    .Distinct()
                    .Count();

                var totalCtfs = prevCtfs + 1;

                // Always record Veteran1 participation (one per CTF, used for counting)
                toAdd.Add(new UserBadgeData
                {
                    UserId          = uid,
                    Type            = BadgeType.Veteran1,
                    CtfEventId      = ctfEventId,
                    AwardedByUserId = actorId,
                    AwardedAt       = DateTime.UtcNow,
                });

                // Award Veteran5 milestone
                if (totalCtfs == 5 && !context.UserBadges.Any(b => b.UserId == uid && b.Type == BadgeType.Veteran5))
                {
                    toAdd.Add(new UserBadgeData
                    {
                        UserId          = uid,
                        Type            = BadgeType.Veteran5,
                        AwardedByUserId = actorId,
                        AwardedAt       = DateTime.UtcNow,
                    });
                }
                // Award Veteran10 milestone
                if (totalCtfs == 10 && !context.UserBadges.Any(b => b.UserId == uid && b.Type == BadgeType.Veteran10))
                {
                    toAdd.Add(new UserBadgeData
                    {
                        UserId          = uid,
                        Type            = BadgeType.Veteran10,
                        AwardedByUserId = actorId,
                        AwardedAt       = DateTime.UtcNow,
                    });
                }
            }

            // ── Save all badges
            context.UserBadges.AddRange(toAdd);

            // ── Mark CTF finalized
            ctf.IsFinalized = true;
            context.SaveChanges();

            AuditLog.Log(actorId, AuditAction.CtfFinalized, "CtfEvent", ctfEventId,
                $"badges={toAdd.Count};participants={participatingUserIds.Count}");

            return new ActionResponse
            {
                IsSuccess = true,
                Message   = $"CTF finalized. {toAdd.Count} badges awarded to {participatingUserIds.Count} participants."
            };
        }

    }
}
