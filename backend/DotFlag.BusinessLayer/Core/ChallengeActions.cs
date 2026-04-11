using AutoMapper;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Entities.Challenge;
using DotFlag.Domain.Enums;
using DotFlag.Domain.Models.Challenge;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Core
{
    public class ChallengeActions
    {
        protected readonly IMapper _mapper;

        protected ChallengeActions(IMapper mapper)
        {
            _mapper = mapper;
        }

        protected ChallengeDto GetByIdExecution(int id, UserRole role)
        {
            using var context = new AppDbContext();

            bool includeInactive = role == UserRole.Admin || role == UserRole.Owner;
            
            var challenge = context.Challenges
                .FirstOrDefault(c => c.Id == id && (includeInactive || c.IsActive));

            if (challenge == null)
                return null;

            return _mapper.Map<ChallengeDto>(challenge);
        }

        protected List<ChallengeDto> GetAllExecution(UserRole role)
        {
            using var context = new AppDbContext();

            bool includeInactive = role == UserRole.Admin || role == UserRole.Owner;
            
            var challenges = context.Challenges
                .Where(c => includeInactive || c.IsActive)
                .ToList();

            return _mapper.Map<List<ChallengeDto>>(challenges);
        }

        protected ActionResponse CreateExecution(CreateChallengeDto dto) 
        {
            using var context = new AppDbContext();

            var challenge = _mapper.Map<ChallengeData>(dto);

            challenge.FlagHash = BCrypt.Net.BCrypt.HashPassword(dto.Flag);
            challenge.CurrentPoints = dto.MaxPoints;

            context.Challenges.Add(challenge);
            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "Challenge created successfully." };
        }
        protected ActionResponse UpdateExecution(int id, UpdateChallengeDto dto)
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
            challenge.DecayRate = dto.DecayRate;
            challenge.FirstBloodBonus = dto.FirstBloodBonus;

            if (!string.IsNullOrEmpty(dto.Flag))
                challenge.FlagHash = BCrypt.Net.BCrypt.HashPassword(dto.Flag);

            challenge.CurrentPoints = challenge.CalculateCurrentPoints(
                dto.MaxPoints, dto.MinPoints, dto.DecayRate, challenge.SolveCount);

            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "Challenge updated successfully." };
        }

        protected ActionResponse DeleteExecution(int id)
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
