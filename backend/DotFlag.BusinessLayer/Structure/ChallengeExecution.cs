using AutoMapper;
using DotFlag.BusinessLayer.Core;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.Challenge;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Structure;

public class ChallengeExecution : ChallengeActions, IChallengeActions
{
    public ChallengeExecution(IMapper mapper) : base(mapper) { }

    public ChallengeDto GetById(int id, bool includeInactive = false)
    {
        return GetByIdExecution(id, includeInactive);
    }

    public List<ChallengeDto> GetAll(bool includeInactive = false)
    {
        return GetAllExecution(includeInactive);
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
}