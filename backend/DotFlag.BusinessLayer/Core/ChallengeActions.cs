using AutoMapper;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Entities.Challenge;
using DotFlag.Domain.Models.Challenge;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Core
{
    public class ChallengeActions : IChallengeActions
    {
        private readonly IMapper _mapper;

        public ChallengeActions(IMapper mapper)
        {
            _mapper = mapper;
        }

        public ChallengeDto GetById(int id, bool includeInactive = false)
        {
            using var context = new AppDbContext();

            var challenge = context.Challenges
                .FirstOrDefault(c => c.Id == id && (includeInactive || c.IsActive));

            if (challenge == null)
                return null;

            return _mapper.Map<ChallengeDto>(challenge);
        }

        public List<ChallengeDto> GetAll(bool includeInactive = false)
        {
            using var context = new AppDbContext();

            var challenges = context.Challenges
                .Where(c => includeInactive || c.IsActive)
                .ToList();

            return _mapper.Map<List<ChallengeDto>>(challenges);
        }

        public ActionResponse Create(CreateChallengeDto dto) 
        {
            using var context = new AppDbContext();

            var challenge = _mapper.Map<ChallengeData>(dto);

            challenge.FlagHash = BCrypt.Net.BCrypt.HashPassword(dto.Flag);
            challenge.CurrentPoints = dto.MaxPoints;

            context.Challenges.Add(challenge);
            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "Challenge created successfully." };
        }
        public ActionResponse Update(int id, UpdateChallengeDto dto)
        {
            using var context = new AppDbContext();

            var challenge = context.Challenges.FirstOrDefault(c => c.Id == id);

            if (challenge == null)
                return new ActionResponse { IsSuccess = false, Message = "Challenge not found." };

            challenge.Name = dto.Name;
            challenge.Description = dto.Description;
            challenge.Category = dto.Category;
            challenge.MinPoints = dto.MinPoints;
            challenge.MaxPoints = dto.MaxPoints;
            challenge.Difficulty = dto.Difficulty;
            challenge.IsActive = dto.IsActive;

            challenge.CurrentPoints = challenge.CalculateCurrentPoints(
                dto.MaxPoints, dto.MinPoints, challenge.DecayRate, challenge.SolveCount);

            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "Challenge updated successfully." };
        }

        public ActionResponse Delete(int id)
        {
            using var context = new AppDbContext();

            var challenge = context.Challenges.FirstOrDefault(c => c.Id == id);

            if (challenge == null)
                return new ActionResponse { IsSuccess = false, Message = "Challenge not found." };

            challenge.IsActive = false;
            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "Challenge deleted successfully." };
        }
    }
}
