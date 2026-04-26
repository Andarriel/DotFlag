using AutoMapper;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Entities.Notification;
using DotFlag.Domain.Entities.Team;
using DotFlag.Domain.Enums;
using DotFlag.Domain.Models.Responses;
using DotFlag.Domain.Models.Team;
using Microsoft.EntityFrameworkCore;

namespace DotFlag.BusinessLayer.Core
{
    public class TeamActions
    {
        protected readonly IMapper _mapper;

        protected TeamActions(IMapper mapper)
        {
            _mapper = mapper;
        }

        protected string GenerateInviteCode()
        {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            var part1 = new string(Enumerable.Range(0, 4).Select(_ => chars[random.Next(chars.Length)]).ToArray());
            var part2 = new string(Enumerable.Range(0, 4).Select(_ => chars[random.Next(chars.Length)]).ToArray());
            return $"DF-{part1}-{part2}";
        }

        protected ActionResponse CreateExecution(int userId, CreateTeamDto dto)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(userData => userData.Id == userId);

            if(user == null)
                return new ActionResponse { IsSuccess = false, Message = "User not found." };

            if (user.TeamId != null)
                return new ActionResponse { IsSuccess = false, Message = "You are already in a team." };

            var team = _mapper.Map<TeamData>(dto);
            team.InviteCode = GenerateInviteCode();

            user.TeamRole = TeamRole.Leader;
            user.Team = team;

            context.Teams.Add(team);
            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "Team created successfully." };
        }

        protected ActionResponse DisbandExecution(int id, int userId, UserRole role)
        {
            using var context = new AppDbContext();

            bool isAdmin = role == UserRole.Admin || role == UserRole.Owner;

            if (!isAdmin)
            {
                var user = context.Users.FirstOrDefault(u => u.Id == userId);

                if (user == null)
                    return new ActionResponse { IsSuccess = false, Message = "User not found." };

                if (user.TeamId != id || user.TeamRole != TeamRole.Leader)
                    return new ActionResponse { IsSuccess = false, Message = "Only the team leader can disband the team." };
            }

            var team = context.Teams.FirstOrDefault(t => t.Id == id);

            if (team == null)
                return new ActionResponse { IsSuccess = false, Message = "Team not found." };

            var members = context.Users.Where(u => u.TeamId == id).ToList();

            foreach (var member in members)
            {
                member.TeamId = null;
                member.TeamRole = null;
            }

            team.IsActive = false;

            context.SaveChanges();

            AuditLog.Log(userId, AuditAction.TeamDisbanded, "Team", id, $"name={team.Name}");

            return new ActionResponse { IsSuccess = true, Message = "Team disbanded successfully." };
        }

        private Dictionary<int, int> GetMemberScores(AppDbContext context, IEnumerable<int> userIds)
        {
            var ids = userIds.ToList();
            if (ids.Count == 0) return new Dictionary<int, int>();

            return context.Submissions
                .Where(s => s.IsCorrect && s.Challenge.IsActive && ids.Contains(s.UserId))
                .GroupBy(s => s.UserId)
                .Select(g => new { UserId = g.Key, Score = g.Sum(s => s.Challenge.CurrentPoints + s.BonusPoints) })
                .ToDictionary(x => x.UserId, x => x.Score);
        }

        private void PopulateMemberPoints(AppDbContext context, IEnumerable<TeamDto> teams)
        {
            var allMemberIds = teams.SelectMany(t => t.Members).Select(m => m.Id).Distinct().ToList();
            var scores = GetMemberScores(context, allMemberIds);
            foreach (var team in teams)
                foreach (var member in team.Members)
                    member.CurrentPoints = scores.GetValueOrDefault(member.Id, 0);
        }

        protected List<TeamDto> GetAllExecution(UserRole role)
        {
            using var context = new AppDbContext();

            bool  includeInactive = role == UserRole.Admin || role == UserRole.Owner;

            var teams = context.Teams
                .Include(t => t.Members)
                .Where(team => includeInactive || team.IsActive)
                .ToList();

            var dtos = _mapper.Map<List<TeamDto>>(teams);
            PopulateMemberPoints(context, dtos);
            return dtos;
        }

        protected TeamDto GetByIdExecution(int id)
        {
            using var context = new AppDbContext();

            var team = context.Teams
                .Include(t => t.Members)
                .FirstOrDefault(teamData => teamData.Id == id);

            if (team == null)
                return null;

            var dto = _mapper.Map<TeamDto>(team);
            PopulateMemberPoints(context, new[] { dto });
            return dto;
        }

        protected ActionResponse JoinExecution(int userId, JoinTeamDto dto)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(userData => userData.Id == userId);

            if (user == null)
                return new ActionResponse { IsSuccess = false, Message = "User not found." };

            if (user.TeamId != null)
                return new ActionResponse { IsSuccess = false, Message = "You are already in a team." };

            var teamToJoin = context.Teams
                .Include(t => t.Members)
                .FirstOrDefault(team => team.InviteCode == dto.InviteCode);

            if (teamToJoin == null || !teamToJoin.IsActive)
                return new ActionResponse { IsSuccess = false, Message = "Invalid invite code." };

            if (teamToJoin.Members.Count >= 4)
                return new ActionResponse { IsSuccess = false, Message = "This team is full." };

            var existingMemberIds = teamToJoin.Members.Select(m => m.Id).ToList();

            user.TeamId = teamToJoin.Id;
            user.TeamRole = TeamRole.Member;

            context.SaveChanges();

            foreach (var memberId in existingMemberIds)
            {
                context.Notifications.Add(new NotificationData
                {
                    Title = "New Team Member",
                    Message = $"{user.Username} joined your team!",
                    Type = "teamJoined",
                    UserId = memberId,
                    CreatedOn = DateTime.UtcNow
                });
            }
            if (existingMemberIds.Count > 0)
                context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "You joined the team!" };
        }

        protected ActionResponse LeaveExecution(int teamId, int userId)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(userData => userData.Id == userId);

            if (user == null)
                return new ActionResponse { IsSuccess = false, Message = "User not found." };

            if (user.TeamId != teamId)
                return new ActionResponse { IsSuccess = false, Message = "You are not in this team." };

            var username = user.Username;
            bool isLeader = user.TeamRole == TeamRole.Leader;

            user.TeamId = null;
            user.TeamRole = null;

            //Dam liderul lu alt user
            if (isLeader)
            {

                var nextMember = context.Users
                    .Where(u => u.TeamId == teamId && u.Id != userId)
                    .OrderBy(u => u.Id)
                    .FirstOrDefault();

                if (nextMember != null)
                {
                    nextMember.TeamRole = TeamRole.Leader;
                }
                else
                {
                    var team = context.Teams.FirstOrDefault(t => t.Id == teamId);
                    if (team != null)
                    {
                        team.IsActive = false;
                        context.SaveChanges();
                        AuditLog.Log(userId, AuditAction.TeamDisbanded, "Team", teamId, $"name={team.Name};reason=last-member-left");
                        return new ActionResponse { IsSuccess = true, Message = "You left the team." };
                    }
                }
            }

            context.SaveChanges();

            var remaining = context.Users.Where(u => u.TeamId == teamId).ToList();
            foreach (var member in remaining)
            {
                context.Notifications.Add(new NotificationData
                {
                    Title = "Member Left",
                    Message = $"{username} left the team.",
                    Type = "teamLeft",
                    UserId = member.Id,
                    CreatedOn = DateTime.UtcNow
                });
            }
            if (remaining.Count > 0)
                context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "You left the team." };
        }

        protected ActionResponse RegenerateInviteExecution(int teamId, int userId)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(userData => userData.Id == userId);

            if (user == null)
                return new ActionResponse { IsSuccess = false, Message = "User not found." };

            if (user.TeamId == null)
                return new ActionResponse { IsSuccess = false, Message = "You are not in a team." };

            if (user.TeamId != teamId)
                return new ActionResponse { IsSuccess = false, Message = "You are not in this team." };

            if (user.TeamRole == TeamRole.Member)
                return new ActionResponse { IsSuccess = false, Message = "Only team leaders can regenerate invite codes." };

            var team = context.Teams.FirstOrDefault(team => team.Id == teamId);

            if(team == null)
                return new ActionResponse { IsSuccess = false, Message = "Team not found." };

            team.InviteCode = GenerateInviteCode();

            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "Invite code regenerated successfully." };
        }

        protected ActionResponse RemoveMemberExecution(int teamId, int actorId, int targetMemberId)
        {
            using var context = new AppDbContext();

            var actor = context.Users.FirstOrDefault(u => u.Id == actorId);
            if (actor == null)
                return new ActionResponse { IsSuccess = false, Message = "User not found." };

            if (actor.TeamId != teamId || actor.TeamRole != TeamRole.Leader)
                return new ActionResponse { IsSuccess = false, Message = "Only the team leader can remove members." };

            if (actorId == targetMemberId)
                return new ActionResponse { IsSuccess = false, Message = "You cannot remove yourself from the team." };

            var target = context.Users.FirstOrDefault(u => u.Id == targetMemberId);
            if (target == null)
                return new ActionResponse { IsSuccess = false, Message = "Member not found." };

            if (target.TeamId != teamId)
                return new ActionResponse { IsSuccess = false, Message = "This user is not in your team." };

            var teamName = context.Teams.Where(t => t.Id == teamId).Select(t => t.Name).FirstOrDefault();

            target.TeamId = null;
            target.TeamRole = null;
            context.SaveChanges();

            context.Notifications.Add(new NotificationData
            {
                Title = "Removed from Team",
                Message = $"You were removed from {teamName ?? "your team"} by the leader.",
                Type = "teamKicked",
                UserId = targetMemberId,
                CreatedOn = DateTime.UtcNow
            });
            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "Member removed successfully." };
        }

        protected ActionResponse UpdateExecution(int id, UpdateTeamDto dto)
        {
            using var context = new AppDbContext();

            var team = context.Teams.FirstOrDefault(teamData => teamData.Id == id);

            if(team == null)
                return new ActionResponse { IsSuccess = false, Message = "Team not found." };

            team.Name = dto.Name;

            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "Team updated successfully." };
        }

        protected ActionResponse RenameExecution(int teamId, int userId, string name)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
                return new ActionResponse { IsSuccess = false, Message = "User not found." };

            if (user.TeamId != teamId || user.TeamRole != TeamRole.Leader)
                return new ActionResponse { IsSuccess = false, Message = "Only the team leader can rename the team." };

            var team = context.Teams.FirstOrDefault(t => t.Id == teamId);
            if (team == null)
                return new ActionResponse { IsSuccess = false, Message = "Team not found." };

            if (string.IsNullOrWhiteSpace(name) || name.Length < 3 || name.Length > 25)
                return new ActionResponse { IsSuccess = false, Message = "Team name must be between 3 and 25 characters." };

            team.Name = name.Trim();
            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "Team renamed successfully." };
        }

        protected ActionResponse TransferLeadershipExecution(int teamId, int actorId, int targetMemberId)
        {
            using var context = new AppDbContext();

            var actor = context.Users.FirstOrDefault(u => u.Id == actorId);
            if (actor == null)
                return new ActionResponse { IsSuccess = false, Message = "User not found." };

            if (actor.TeamId != teamId || actor.TeamRole != TeamRole.Leader)
                return new ActionResponse { IsSuccess = false, Message = "Only the team leader can transfer leadership." };

            if (actorId == targetMemberId)
                return new ActionResponse { IsSuccess = false, Message = "You are already the leader." };

            var target = context.Users.FirstOrDefault(u => u.Id == targetMemberId);
            if (target == null)
                return new ActionResponse { IsSuccess = false, Message = "Member not found." };

            if (target.TeamId != teamId)
                return new ActionResponse { IsSuccess = false, Message = "This user is not in your team." };

            actor.TeamRole = TeamRole.Member;
            target.TeamRole = TeamRole.Leader;
            context.SaveChanges();

            var teamName = context.Teams.Where(t => t.Id == teamId).Select(t => t.Name).FirstOrDefault();

            context.Notifications.Add(new NotificationData
            {
                Title = "You are now Team Leader",
                Message = $"You have been made the leader of {teamName ?? "your team"}.",
                Type = "teamJoined",
                UserId = targetMemberId,
                CreatedOn = DateTime.UtcNow
            });
            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "Leadership transferred successfully." };
        }

        protected TeamDetailsDto GetTeamDetailsExecution(int userId)
        {
            using var context = new AppDbContext();

            var user = context.Users.FirstOrDefault(user => user.Id == userId);

            if (user == null || user.TeamId == null)
                return null;

            var team = context.Teams
                .Include(t => t.Members)
                .FirstOrDefault(team => team.Id == user.TeamId);

            if (team == null)
                return null;

            var dto = _mapper.Map<TeamDetailsDto>(team);

            if (user.TeamRole != TeamRole.Leader)
                dto.InviteCode = dto.InviteCode.Length > 4 ? dto.InviteCode[..^4] : string.Empty;

            PopulateMemberPoints(context, new[] { (TeamDto)dto });
            return dto;
        }
    }
}
