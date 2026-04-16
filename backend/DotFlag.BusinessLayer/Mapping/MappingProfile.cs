using AutoMapper;
using DotFlag.Domain.Entities.Challenge;
using DotFlag.Domain.Entities.CtfEvent;
using DotFlag.Domain.Entities.Team;
using DotFlag.Domain.Entities.User;
using DotFlag.Domain.Models.Challenge;
using DotFlag.Domain.Models.CtfEvent;
using DotFlag.Domain.Models.Team;
using DotFlag.Domain.Models.User;

namespace DotFlag.BusinessLayer.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User mappings
            CreateMap<UserData, UserDto>();

            CreateMap<CreateUserDto, UserData>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());

            CreateMap<UserRegisterDto, UserData>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());

            CreateMap<UserData, UserProfileDto>();

            // Challenge mappings
            CreateMap<ChallengeData, ChallengeDto>();

            CreateMap<CreateChallengeDto, ChallengeData>()
                .ForMember(dest => dest.FlagHash, opt => opt.Ignore());

            // Team mappings
            CreateMap<CreateTeamDto, TeamData>();

            CreateMap<TeamData, TeamDto>()
                .ForMember(dest => dest.MemberCount, opt => opt.MapFrom(src => src.Members.Count))
                .ForMember(dest => dest.Members, opt => opt.MapFrom(src => src.Members));

            CreateMap<TeamData, TeamDetailsDto>()
                .ForMember(dest => dest.MemberCount, opt => opt.MapFrom(src => src.Members.Count))
                .ForMember(dest => dest.Members, opt => opt.MapFrom(src => src.Members));

            CreateMap<UserData, TeamMemberDto>();

            // Hint mapping
            CreateMap<HintData, HintDto>();

            CreateMap<CreateHintDto, HintData>();

            // File Mapping
            CreateMap<ChallengeFileData, ChallengeFileDto>();
            
            // CtfEvents
            CreateMap<CtfEventData, CtfEventDto>()
                .ForMember(d => d.State, opt => opt.Ignore());

            CreateMap<UpdateCtfEventDto, CtfEventData>();
        
        }
    }
}
