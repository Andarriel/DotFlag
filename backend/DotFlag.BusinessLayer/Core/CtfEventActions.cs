using AutoMapper;
using DotFlag.DataAccessLayer.Context;
using DotFlag.Domain.Enums;
using DotFlag.Domain.Models.CtfEvent;
using DotFlag.Domain.Models.Responses;

namespace DotFlag.BusinessLayer.Core
{
    public class CtfEventActions
    {
        protected readonly IMapper _mapper;

        protected CtfEventActions(IMapper mapper) 
        {
            _mapper = mapper;
        }

        protected CtfEventDto GetExecution()
        {
            using var context = new AppDbContext();
            var entity = context.CtfEvents.FirstOrDefault();

            if (entity == null)
                throw new InvalidOperationException("CtfEvent seed row missing");

            var dto = _mapper.Map<CtfEventDto>(entity);

            if (entity.IsComingSoon)
            {
                dto.State = CtfState.ComingSoon;
                return dto;
            }

            var now = DateTime.UtcNow;

            if (now < entity.StartTime)
                dto.State = CtfState.Upcoming;

            else if (now <= entity.EndTime)
                dto.State = CtfState.Running;

            else
                dto.State = CtfState.Ended;

            return dto;
        }

        protected ActionResponse UpdateExecution(UpdateCtfEventDto dto)
        {
            using var context = new AppDbContext();

            var CtfEvent = context.CtfEvents.FirstOrDefault();

            if(CtfEvent == null)
                return new ActionResponse() { IsSuccess = false, Message = "There is no CtfEvent inside of Postgre" };

            if (!dto.IsComingSoon && dto.EndTime <= dto.StartTime)
                return new ActionResponse { IsSuccess = false, Message = "EndTime must be after StartTime" };

            CtfEvent.Name = dto.Name;
            CtfEvent.IsComingSoon = dto.IsComingSoon;

            if (!dto.IsComingSoon)
            {
                CtfEvent.StartTime = DateTime.SpecifyKind(dto.StartTime, DateTimeKind.Utc);
                CtfEvent.EndTime = DateTime.SpecifyKind(dto.EndTime, DateTimeKind.Utc);
            }

            context.SaveChanges();

            return new ActionResponse() { IsSuccess = true, Message = "Ctf details was updated!" };
        }

    }
}
