using DotFlag.BusinessLayer.Interfaces;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Entities.Challenge;
using DotFlag.Domain.Models.Challenge;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Core
{
    public class ChallengeActions : IChallengeActions
    {
        public ChallengeDto GetById(int id)
        {
            using (var context = new AppDbContext())
            {
                var challenge = context.Challenges.FirstOrDefault(c => c.Id == id);

                if (challenge == null) 
                    return null;

                int solveCount = context.Submissions.Count(s => s.ChallengeId == id && s.IsCorrect);

                return new ChallengeDto
                {
                    Id = challenge.Id,
                    Name = challenge.Name,
                    Description = challenge.Description,
                    Category = challenge.Category,
                    MinPoints = challenge.MinPoints,
                    MaxPoints = challenge.MaxPoints,
                    CurrentPoints = challenge.CalculateCurrentPoints(challenge.MaxPoints, challenge.MinPoints, challenge.DecayRate, solveCount),
                    IsActive = challenge.IsActive,
                    SolveCount = solveCount,
                    CreatedOn = challenge.CreatedOn
                };

            }
        }
        public List<ChallengeDto> GetAll()
        {
            using (var context = new AppDbContext())
            {
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
                        CurrentPoints = c.CalculateCurrentPoints(c.MaxPoints, c.MinPoints, c.DecayRate, solveCount),
                        IsActive = c.IsActive,
                        SolveCount = solveCount,
                        CreatedOn = c.CreatedOn
                    };
                }).ToList();
            }
          
        }
        public ActionResponse Create(CreateChallengeDto dto) 
        {
            using (var context = new AppDbContext()) 
            {
                var challenge = new ChallengeData
                {
                    Name = dto.Name,
                    Description = dto.Description,
                    Category = dto.Category,
                    MinPoints = dto.MinPoints,
                    MaxPoints = dto.MaxPoints,
                    DecayRate = dto.DecayRate,
                    FirstBloodBonus = dto.FirstBloodBonus,
                    FlagHash = BCrypt.Net.BCrypt.HashPassword(dto.Flag)
                };

                context.Challenges.Add(challenge);
                context.SaveChanges();

                return new ActionResponse { IsSuccess = true, Message = "Challenge created successfully." };
            }
        }
        public ActionResponse Update(int id, UpdateChallengeDto dto)
        {
            using (var context = new AppDbContext())
            {
                var challenge = context.Challenges.FirstOrDefault(c => c.Id == id);

                if (challenge == null)
                    return new ActionResponse { IsSuccess = false, Message = "Challenge not found." };

                challenge.Name = dto.Name;
                challenge.Description = dto.Description;
                challenge.Category = dto.Category;
                challenge.MinPoints = dto.MinPoints;
                challenge.MaxPoints = dto.MaxPoints;
                challenge.IsActive = dto.IsActive;

                context.SaveChanges();

                return new ActionResponse { IsSuccess = true, Message = "Challenge updated successfully." };
            }
        }

        public ActionResponse Delete(int id)
        {
            using (var context = new AppDbContext())
            {
                var challenge = context.Challenges.FirstOrDefault(c => c.Id == id);

                if (challenge == null)
                    return new ActionResponse { IsSuccess = false, Message = "Challenge not found." };

                context.Challenges.Remove(challenge);
                context.SaveChanges();

                return new ActionResponse { IsSuccess = true, Message = "Challenge deleted successfully." };
            }
            
        }
        
    }
}
