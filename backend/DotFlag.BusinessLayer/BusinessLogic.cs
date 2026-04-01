using AutoMapper;
using DotFlag.BusinessLayer.Core;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.BusinessLayer.Mapping;
using Microsoft.Extensions.Logging;

namespace DotFlag.BusinessLayer
{
    public class BusinessLogic
    {
        private readonly IMapper _mapper;
        
        public BusinessLogic()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MappingProfile>();
            }, new LoggerFactory() );

            _mapper = config.CreateMapper();
        }

        public IUserActions GetUserActions() => new UserActions(_mapper);
        public IAuthActions GetAuthActions() => new AuthActions(_mapper);
        public IChallengeActions GetChallengeActions() => new ChallengeActions(_mapper);
        public ISubmissionActions GetSubmissionActions() => new SubmissionActions(_mapper);
    }
}
