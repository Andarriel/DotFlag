using DotFlag.Domain.Entities.Challenge;
using DotFlag.Domain.Enums;
using DotFlag.Domain.Models.Challenge;
using DotFlag.Domain.Models.Responses;


namespace DotFlag.BusinessLayer.Interfaces
{
    public interface IChallengeActions
    {
        ChallengeDto GetById(int id, UserRole role, int? userId = null);
        List<ChallengeDto> GetAll(UserRole role, int? userId = null);
        ActionResponse Create(CreateChallengeDto dto, int actorId);
        ActionResponse Update(int id, UpdateChallengeDto dto, int actorId);
        ActionResponse Delete(int id, int actorId);
        ActionResponse AddHint(int challengeId, CreateHintDto dto, int actorId);
        ActionResponse RemoveHint(int challengeId, int hintId, int actorId);
        Task<ActionResponse> AddFile(int challengeId, string fileName, Stream fileStream, int actorId);
        ChallengeFileData GetFile(int challengeId, int fileId);
        ActionResponse RemoveFile(int challengeId, int fileId, int actorId);
    }
}
