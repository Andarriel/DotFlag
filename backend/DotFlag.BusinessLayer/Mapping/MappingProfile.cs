using AutoMapper;
using DotFlag.Domain.Entities.Challenge;
using DotFlag.Domain.Entities.User;
using DotFlag.Domain.Models.Challenge;
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
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.RegisteredOn, opt => opt.Ignore());

            CreateMap<UserRegisterDto, UserData>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.RegisteredOn, opt => opt.Ignore());

            // Challenge mappings
            CreateMap<ChallengeData, ChallengeDto>()
                .ForMember(dest => dest.CurrentPoints, opt => opt.Ignore())
                .ForMember(dest => dest.SolveCount, opt => opt.Ignore());

            CreateMap<CreateChallengeDto, ChallengeData>()
                .ForMember(dest => dest.FlagHash, opt => opt.Ignore());
        }
    }
}
