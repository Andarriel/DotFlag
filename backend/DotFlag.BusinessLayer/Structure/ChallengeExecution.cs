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

    public ActionResponse Create(CreateChallengeDto dto)
    {
        return CreateExecution(dto);
    }

    public ActionResponse Update(int id, UpdateChallengeDto dto)
    {
        return UpdateExecution(id, dto);
    }

    public ActionResponse Delete(int id)
    {
        return DeleteExecution(id);
    }

    public ActionResponse AddHint(int challengeId, CreateHintDto dto)
    {
        return AddHintExecution(challengeId,dto);
    }

    public ActionResponse RemoveHint(int challengeId, int hintId)
    {
        return RemoveHintExecution(challengeId, hintId);
    }

    public Task<ActionResponse> AddFile(int challengeId, string fileName, Stream fileStream)
    {
        return AddFileExecution(challengeId, fileName, fileStream);
    }

    public ChallengeFileData GetFile(int challengeId, int fileId)
    {
        return GetFileExecution(challengeId, fileId);
    }

    public ActionResponse RemoveFile(int challengeId, int fileId)
    {
        return RemoveFileExecution(challengeId, fileId);
    }
}