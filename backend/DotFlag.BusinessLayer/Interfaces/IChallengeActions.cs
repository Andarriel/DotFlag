using DotFlag.Domain.Models.Challenge;
using DotFlag.Domain.Models.Responses;


namespace DotFlag.BusinessLayer.Interfaces
{
    public interface IChallengeActions
    {
        ChallengeDto GetById(int id);
        List<ChallengeDto> GetAll();
        ActionResponse Create(CreateChallengeDto dto);
        ActionResponse Update(int id, ChallengeDto dto);
        ActionResponse Delete(int id);

    }
}
