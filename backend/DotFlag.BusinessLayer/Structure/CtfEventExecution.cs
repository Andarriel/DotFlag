using AutoMapper;
using DotFlag.BusinessLayer.Core;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.Domain.Models.CtfEvent;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Structure
{
    public class CtfEventExecution : CtfEventActions, ICtfEventActions
    {
        public CtfEventExecution(IMapper mapper) : base(mapper) { }

        public CtfEventDto Get()
        {
            return GetExecution();
        }

        public ActionResponse Update(UpdateCtfEventDto dto)
        {
            return UpdateExecution(dto);
        }

    }
}
