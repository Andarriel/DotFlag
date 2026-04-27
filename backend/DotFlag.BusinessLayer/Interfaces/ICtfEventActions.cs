using DotFlag.Domain.Models.CtfEvent;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Interfaces
{
    public interface ICtfEventActions
    {
        CtfEventDto Get();
        ActionResponse Update(UpdateCtfEventDto dto);
        List<CtfEventDto> GetAll();
        ActionResponse FinalizeCTF(int ctfEventId, int actorId);
    }
}
