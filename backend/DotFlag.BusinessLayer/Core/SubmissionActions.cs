using AutoMapper;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Entities.Notification;
using DotFlag.Domain.Entities.Submission;
using DotFlag.Domain.Models.Responses;
using DotFlag.Domain.Models.Submission;

namespace DotFlag.BusinessLayer.Core
{
    public class SubmissionActions
    {
        protected readonly IMapper _mapper;

        protected SubmissionActions(IMapper mapper)
        {
            _mapper = mapper;
        }

        protected ActionResponse SubmitFlagExecution(int challengeId, int userId, string flag)
        {
            using var context = new AppDbContext();

            var challenge = context.Challenges.FirstOrDefault(c => c.Id == challengeId);

            if (challenge == null)
                return new ActionResponse { IsSuccess = false, Message = "Challenge not found." };

            if (challenge.IsActive == false)
                return new ActionResponse { IsSuccess = false, Message = "Challenge is not active." };

            bool alreadySolved = context.Submissions.Any(s => s.UserId == userId && s.ChallengeId == challengeId && s.IsCorrect);

            if (alreadySolved)
                return new ActionResponse { IsSuccess = false, Message = "Challenge already solved." };

            var user = context.Users.FirstOrDefault(u => u.Id == userId);

            if (user == null)
                return new ActionResponse { IsSuccess = false, Message = "User not found." };

            bool isCorrect = BCrypt.Net.BCrypt.Verify(flag, challenge.FlagHash);
            bool isFirstBlood = false;

            if (isCorrect)
            {
                SubmissionRateLimiter.Clear(userId, challengeId);
                challenge.SolveCount += 1;
                challenge.CurrentPoints = challenge.CalculateCurrentPoints(
                    challenge.MaxPoints, challenge.MinPoints, challenge.DecayRate, challenge.SolveCount);
                isFirstBlood = challenge.SolveCount == 1;
            }

            context.Submissions.Add(new SubmissionData
            {
                UserId = userId,
                ChallengeId = challengeId,
                Flag = BCrypt.Net.BCrypt.HashPassword(flag),
                IsCorrect = isCorrect,
                BonusPoints = isFirstBlood ? challenge.FirstBloodBonus : 0,
                CreatedOn = DateTime.UtcNow
            });

            if (isFirstBlood)
            {
                context.Notifications.Add(new NotificationData
                {
                    Title = "First Blood!",
                    Message = $"{user.Username} was the first to solve {challenge.Name}!",
                    Type = "firstBlood",
                    UserId = null,
                    CreatedOn = DateTime.UtcNow
                });

                user.NotificationsReadAt = DateTime.UtcNow;
            }

            context.SaveChanges();

            var message = isCorrect
                ? isFirstBlood ? $"First blood! +{challenge.FirstBloodBonus} bonus points!" : "Correct flag!"
                : "Incorrect Flag!";

            return new ActionResponse { IsSuccess = isCorrect, Message = message };

        }

        protected List<SubmissionDto> GetByChallengeExecution(int challengeId, int userId)
        {
            using var context = new AppDbContext();

            var submissions = context.Submissions
                .Where(s => s.ChallengeId == challengeId && s.UserId == userId)
                .OrderByDescending(s => s.CreatedOn)
                .Select(s => new SubmissionDto
                {
                    Id = s.Id,
                    UserId = s.UserId,
                    ChallengeId = s.ChallengeId,
                    IsCorrect = s.IsCorrect,
                    BonusPoints = s.BonusPoints,
                    Timestamp = s.CreatedOn
                })
                .ToList();

            return submissions;
        }

        protected List<SubmissionDto> GetByUserExecution(int userId)
        {
            using var context = new AppDbContext();

            return context.Submissions
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.CreatedOn)
                .Select(s => new SubmissionDto
                {
                    Id = s.Id,
                    UserId = s.UserId,
                    ChallengeId = s.ChallengeId,
                    ChallengeName = s.Challenge.Name,
                    IsCorrect = s.IsCorrect,
                    BonusPoints = s.BonusPoints,
                    Timestamp = s.CreatedOn
                })
                .ToList();
        }

        protected List<SubmissionDto> GetRecentExecution(int count)
        {
            using var context = new AppDbContext();

            return context.Submissions
                .Where(s => s.IsCorrect && s.Challenge.IsActive && !s.User.IsBanned)
                .OrderByDescending(s => s.CreatedOn)
                .Take(count)
                .Select(s => new SubmissionDto
                {
                    Id = s.Id,
                    UserId = s.UserId,
                    Username = s.User.Username,
                    ChallengeId = s.ChallengeId,
                    ChallengeName = s.Challenge.Name,
                    IsCorrect = s.IsCorrect,
                    BonusPoints = s.BonusPoints,
                    Timestamp = s.CreatedOn
                })
                .ToList();
        }
        
        protected List<SubmissionDto> GetByUserIdExecution(int userId)
        {
            using var context = new AppDbContext();

            return context.Submissions
                .Where(s => s.UserId == userId && s.IsCorrect && s.Challenge.IsActive)
                .OrderByDescending(s => s.CreatedOn)
                .Select(s => new SubmissionDto
                {
                    Id = s.Id,
                    UserId = s.UserId,
                    ChallengeId = s.ChallengeId,
                    ChallengeName = s.Challenge.Name,
                    IsCorrect = s.IsCorrect,
                    BonusPoints = s.BonusPoints,
                    Timestamp = s.CreatedOn
                })
                .ToList();
        }

    }
}
