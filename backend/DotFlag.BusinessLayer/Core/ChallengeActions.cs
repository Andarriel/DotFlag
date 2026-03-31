using DotFlag.BusinessLayer.Interfaces;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Entities.Challenge;
using DotFlag.Domain.Entities.Submission;
using DotFlag.Domain.Models.Challenge;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Core
{
    public class ChallengeActions : IChallengeActions
    {
        private int CalculateCurrentPoints(int maxPoints, int minPoints, int decayRate, int solveCount)
        {
            double value = ((double)(minPoints - maxPoints) / (decayRate * decayRate)) * (solveCount * solveCount) + maxPoints;
            return Math.Max((int)Math.Ceiling(value), minPoints);
        }

        public ChallengeDto GetById(int id)
        {
            using var context = new AppDbContext();
            var challenge = context.Challenges.FirstOrDefault(c => c.Id == id);
            if (challenge == null) return null;
            int solveCount = context.Submissions.Count(s => s.ChallengeId == id && s.IsCorrect);
            return new ChallengeDto
            {
                Id = challenge.Id,
                Name = challenge.Name,
                Description = challenge.Description,
                Category = challenge.Category,
                MinPoints = challenge.MinPoints,
                MaxPoints = challenge.MaxPoints,
                CurrentPoints = CalculateCurrentPoints(challenge.MaxPoints, challenge.MinPoints, challenge.DecayRate, solveCount),
                IsActive = challenge.IsActive,
                SolveCount = solveCount,
                CreatedOn = challenge.CreatedOn
            };
        }
        public List<ChallengeDto> GetAll()
        {
            using var context = new AppDbContext();
            var challenges = context.Challenges.ToList();
            return challenges.Select(c =>
            {
                int solveCount = context.Submissions.Count(s => s.ChallengeId == c.Id && s.IsCorrect);
                return new ChallengeDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    Category = c.Category,
                    MinPoints = c.MinPoints,
                    MaxPoints = c.MaxPoints,
                    CurrentPoints = CalculateCurrentPoints(c.MaxPoints, c.MinPoints, c.DecayRate, solveCount),
                    IsActive = c.IsActive,
                    SolveCount = solveCount,
                    CreatedOn = c.CreatedOn
                };
            }).ToList();
        }
        public ActionResponse Create(CreateChallengeDto dto) 
        {
            using var context = new AppDbContext();
            var challenge = new ChallengeData
            {
                Name = dto.Name,
                Description = dto.Description,
                Category = dto.Category,
                MinPoints = dto.MinPoints,
                MaxPoints = dto.MaxPoints,
                DecayRate = dto.DecayRate,
                FirstBloodBonus = dto.FirstBloodBonus,
                // TODO: hash aici
                FlagHash = dto.Flag
            };
            context.Challenges.Add(challenge);
            context.SaveChanges();
            return new ActionResponse { IsSuccess = true, Message = "Challenge created successfully." };
        }
        public ActionResponse Update(int id, ChallengeDto dto)
        {
            using var context = new AppDbContext();
            var challenge = context.Challenges.FirstOrDefault(c => c.Id == id);
            if (challenge == null)
            {
                return new ActionResponse { IsSuccess = false, Message = "Challenge not found." };
            }

            challenge.Name = dto.Name;
            challenge.Description = dto.Description;
            challenge.Category = dto.Category;
            challenge.MinPoints = dto.MinPoints;
            challenge.MaxPoints = dto.MaxPoints;
            challenge.IsActive = dto.IsActive;

            context.SaveChanges();
            return new ActionResponse { IsSuccess = true, Message = "Challenge updated successfully." };
        }

        public ActionResponse Delete(int id)
        {
            using var context = new AppDbContext();
            var challenge = context.Challenges.FirstOrDefault(c => c.Id == id);
            if (challenge == null)
            {
                return new ActionResponse { IsSuccess = false, Message = "Challenge not found." };
            }

            context.Challenges.Remove(challenge);
            context.SaveChanges();
            return new ActionResponse { IsSuccess = true, Message = "Challenge deleted successfully." };
        }
        public ActionResponse SubmitFlag(int challengeId, int userId, string flag)
        {
            using var context = new AppDbContext();
            var challenge = context.Challenges.FirstOrDefault(c => c.Id == challengeId);
            if (challenge == null)
            {
                return new ActionResponse { IsSuccess = false, Message = "Challenge not found." };
            }
            if (flag == challenge.FlagHash)
            {
                bool alreadySolved = context.Submissions.Any(s => s.UserId == userId && s.ChallengeId == challengeId && s.IsCorrect);

                if (!alreadySolved)
                {
                    var user = context.Users.FirstOrDefault(u => u.Id == userId);
                    int solveCount = context.Submissions.Count(s => s.ChallengeId == challengeId && s.IsCorrect);
                    user.CurrentPoints += CalculateCurrentPoints(challenge.MaxPoints, challenge.MinPoints, challenge.DecayRate, solveCount);
                }

                context.Submissions.Add(new SubmissionData
                {
                    UserId = userId,
                    ChallengeId = challengeId,
                    Flag = flag,
                    IsCorrect = true,
                    CreatedOn = DateTime.UtcNow
                });
                context.SaveChanges();
                return new ActionResponse { IsSuccess = true, Message = "Correct flag!" };
            }

            context.Submissions.Add(new SubmissionData
            {
                UserId = userId,
                ChallengeId = challengeId,
                Flag = flag,
                IsCorrect = false,
                CreatedOn = DateTime.UtcNow
            });
            context.SaveChanges();
            return new ActionResponse { IsSuccess = false, Message = "Wrong flag." };
        }
    }
}
