using AutoMapper;
using DotFlag.BusinessLayer.Core;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Enums;
using DotFlag.Domain.Models.Challenge;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Structure;

public class ChallengeExecution : ChallengeActions, IChallengeActions
{
    public ChallengeExecution(IMapper mapper) : base(mapper) { }

    public ChallengeDto GetById(int id, UserRole role, int? userId = null)
    {
        return GetByIdExecution(id, role);
    }

    public List<ChallengeDto> GetAll(UserRole role, int? userId = null)
    {
        return GetAllExecution(role);
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