using AutoMapper;
using DotFlag.BusinessLayer.Core;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Entities.Challenge;
using DotFlag.Domain.Enums;
using DotFlag.Domain.Models.Challenge;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Structure;

public class ChallengeExecution : ChallengeActions, IChallengeActions
{
    public ChallengeExecution(IMapper mapper) : base(mapper) { }

    public ChallengeDto GetById(int id, UserRole role, int? userId = null)
    {
        return GetByIdExecution(id, role, userId);
    }

    public List<ChallengeDto> GetAll(UserRole role, int? userId = null)
    {
        return GetAllExecution(role, userId);
    }

    public ActionResponse Create(CreateChallengeDto dto, int actorId)
    {
        return CreateExecution(dto, actorId);
    }

    public ActionResponse Update(int id, UpdateChallengeDto dto, int actorId)
    {
        return UpdateExecution(id, dto, actorId);
    }

    public ActionResponse Deactivate(int id, int actorId, DeactivateChallengeDto dto)
    {
        return DeactivateExecution(id, actorId, dto);
    }

    public ActionResponse Delete(int id, int actorId, DeactivateChallengeDto dto)
    {
        return DeleteExecution(id, actorId, dto);
    }

    public ActionResponse Clone(int id, int actorId)
    {
        return CloneExecution(id, actorId);
    }

    public ActionResponse AddHint(int challengeId, CreateHintDto dto, int actorId)
    {
        return AddHintExecution(challengeId, dto, actorId);
    }

    public ActionResponse RemoveHint(int challengeId, int hintId, int actorId)
    {
        return RemoveHintExecution(challengeId, hintId, actorId);
    }

    public Task<ActionResponse> AddFile(int challengeId, string fileName, Stream fileStream, int actorId)
    {
        return AddFileExecution(challengeId, fileName, fileStream, actorId);
    }

    public ChallengeFileData GetFile(int challengeId, int fileId)
    {
        return GetFileExecution(challengeId, fileId);
    }

    public ActionResponse RemoveFile(int challengeId, int fileId, int actorId)
    {
        return RemoveFileExecution(challengeId, fileId, actorId);
    }
}
