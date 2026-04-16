using AutoMapper;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Entities.Challenge;
using DotFlag.Domain.Enums;
using DotFlag.Domain.Models.Challenge;
using DotFlag.Domain.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace DotFlag.BusinessLayer.Core
{
    public class ChallengeActions
    {
        protected readonly IMapper _mapper;

        protected ChallengeActions(IMapper mapper)
        {
            _mapper = mapper;
        }

        protected ChallengeDto GetByIdExecution(int id, UserRole role, int? userId = null)
        {
            using var context = new AppDbContext();

            bool includeInactive = role == UserRole.Admin || role == UserRole.Owner;
            
            var challenge = context.Challenges
                .Include(c => c.Hints)
                .Include(c => c.Files)
                .FirstOrDefault(c => c.Id == id && (includeInactive || c.IsActive));

            if (challenge == null)
                return null;

            var dto =  _mapper.Map<ChallengeDto>(challenge);

            if (userId.HasValue)
            {
                dto.IsSolved = context.Submissions
                    .Any(s => s.UserId == userId.Value && s.ChallengeId == id && s.IsCorrect);
            }

            return dto;
        }

        protected List<ChallengeDto> GetAllExecution(UserRole role, int? userId = null)
        {
            using var context = new AppDbContext();

            bool includeInactive = role == UserRole.Admin || role == UserRole.Owner;
            
            var challenges = context.Challenges
                .Include(c => c.Hints)
                .Include(c => c.Files)
                .Where(c => includeInactive || c.IsActive)
                .ToList();

            var dtos = _mapper.Map<List<ChallengeDto>>(challenges);

            if (userId.HasValue)
            {
                var solvedIds = context.Submissions
                    .Where(s => s.UserId == userId.Value && s.IsCorrect)
                    .Select(s => s.ChallengeId)
                    .ToHashSet();
                foreach (var dto in dtos)
                    dto.IsSolved = solvedIds.Contains(dto.Id);
            }

            return dtos;
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

        // Hints & Files p-tru challenges

        protected ActionResponse AddHintExecution(int challengeId, CreateHintDto dto)
        {
            using var context = new AppDbContext();

            var challenge = context.Challenges.FirstOrDefault(c => c.Id == challengeId);
            if (challenge == null)
                return new ActionResponse { IsSuccess = false, Message = "Challenge not found." };

            var hint = _mapper.Map<HintData>(dto);

            hint.ChallengeId = challengeId;

            context.Hints.Add(hint);
            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "Hint added to challenge successfully." };
        }

        protected ActionResponse RemoveHintExecution(int challengeId, int hintId)
        {
            using var context = new AppDbContext();

            var hint = context.Hints.FirstOrDefault(h => h.Id == hintId && h.ChallengeId == challengeId);

            if (hint == null)
                return new ActionResponse() { IsSuccess = false, Message = "Hint does not exist." };

            context.Hints.Remove(hint);
            context.SaveChanges();

            return new ActionResponse() { IsSuccess = true, Message = "Hint was removed from challenge successfully."};
        }

        protected async Task<ActionResponse> AddFileExecution(int challengeId, string fileName, Stream fileStream)
        {
            using var context = new AppDbContext();

            var challenge = context.Challenges.FirstOrDefault(c => c.Id == challengeId);
            if (challenge == null)
                return new ActionResponse { IsSuccess = false, Message = "Challenge not found." };

            var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "challenges", challengeId.ToString());
            Directory.CreateDirectory(uploadDir);

            var uniqueName = Guid.NewGuid() + Path.GetExtension(fileName);
            var storedPath = Path.Combine(uploadDir, uniqueName);

            using (var stream = new FileStream(storedPath, FileMode.Create))
            {
                await fileStream.CopyToAsync(stream);
            }

            var challengeFile = new ChallengeFileData
            {
                ChallengeId = challengeId,
                FileName = fileName,
                StoredPath = storedPath
            };

            context.ChallengeFiles.Add(challengeFile);
            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "File added to challenge successfully." };
        }

        protected ChallengeFileData GetFileExecution(int challengeId, int fileId)
        {
            using var context = new AppDbContext();
            return context.ChallengeFiles.FirstOrDefault(f => f.Id == fileId && f.ChallengeId == challengeId);
        }

        protected ActionResponse RemoveFileExecution(int challengeId, int fileId)
        {
            using var context = new AppDbContext();
            var file = context.ChallengeFiles.FirstOrDefault(f => f.Id == fileId && f.ChallengeId == challengeId);
            if (file == null)
                return new ActionResponse { IsSuccess = false, Message = "File not found." };

            if (File.Exists(file.StoredPath))
                File.Delete(file.StoredPath);

            context.ChallengeFiles.Remove(file);
            context.SaveChanges();

            return new ActionResponse { IsSuccess = true, Message = "File removed successfully." };
        }
    }
}
