using DotFlag.Domain.Enums;
using DotFlag.Domain.Models.Challenge;
using DotFlag.Domain.Models.Responses;


namespace DotFlag.BusinessLayer.Interfaces
{
    public interface IChallengeActions
    {
        ChallengeDto GetById(int id, UserRole role, int? userId = null);
        List<ChallengeDto> GetAll(UserRole role, int? userId = null);
        ActionResponse Create(CreateChallengeDto dto);
        ActionResponse Update(int id, UpdateChallengeDto dto);
        ActionResponse Delete(int id);
    }
}
