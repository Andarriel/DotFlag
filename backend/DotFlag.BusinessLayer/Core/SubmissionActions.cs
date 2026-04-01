using AutoMapper;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Entities.Submission;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Core
{
    public class SubmissionActions : ISubmissionActions
    {
        private readonly IMapper _mapper;

        public SubmissionActions(IMapper mapper)
        {
            _mapper = mapper;
        }

        public ActionResponse SubmitFlag(int challengeId, int userId, string flag)
        {
            using (var context = new AppDbContext())
            {
                var challenge = context.Challenges.FirstOrDefault(c => c.Id == challengeId);

                if (challenge == null)
                    return new ActionResponse { IsSuccess = false, Message = "Challenge not found." };

                if (challenge.IsActive == false)
                    return new ActionResponse { IsSuccess = false, Message = "Challenge is not active." };

                bool alreadySolved = context.Submissions.Any(s => s.UserId == userId && s.ChallengeId == challengeId && s.IsCorrect);

                if(alreadySolved)
                    return new ActionResponse { IsSuccess = false, Message = "Challenge already solved." };
                
                var user = context.Users.FirstOrDefault(u => u.Id == userId);

                if(user == null)
                    return new ActionResponse { IsSuccess = false, Message = "User not found." };

                bool isCorrect = BCrypt.Net.BCrypt.Verify(flag, challenge.FlagHash);

                if (isCorrect)
                {
                    int solveCount = context.Submissions.Count(s => s.ChallengeId == challengeId && s.IsCorrect);
                    user.CurrentPoints += challenge.CalculateCurrentPoints(challenge.MaxPoints, challenge.MinPoints, challenge.DecayRate, solveCount);
                }

                context.Submissions.Add(new SubmissionData
                {
                    UserId = userId,
                    ChallengeId = challengeId,
                    Flag = BCrypt.Net.BCrypt.HashPassword(flag),
                    IsCorrect = isCorrect,
                    CreatedOn = DateTime.UtcNow
                });

                context.SaveChanges();

                return new ActionResponse { IsSuccess = isCorrect, Message = isCorrect ? "Correct flag!" : "Incorrect Flag!" };
            }
            
        }

    }
}
