using DotFlag.Domain.Models.Challenge;
using DotFlag.Domain.Models.Responses;


namespace DotFlag.BusinessLayer.Interfaces
{
    public interface IChallengeActions
    {
        ChallengeDto GetById(int id, bool includeInactive = false);
        List<ChallengeDto> GetAll(bool includeInactive = false);
        ActionResponse Create(CreateChallengeDto dto);
        ActionResponse Update(int id, UpdateChallengeDto dto);
        ActionResponse Delete(int id);
    }
}
