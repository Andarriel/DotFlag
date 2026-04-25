using AutoMapper;
using DotFlag.BusinessLayer.Core;
using DotFlag.BusinessLayer.Interfaces;
using DotFlag.BusinessLayer.Mapping;
using DotFlag.BusinessLayer.Structure;
using Microsoft.Extensions.Logging;
using DotFlag.BusinessLayer.Services;

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

        public IUserActions GetUserActions() => new UserExecution(_mapper);
        public IAuthActions GetAuthActions() => new AuthExecution(_mapper);
        public IChallengeActions GetChallengeActions() => new ChallengeExecution(_mapper);
        public ISubmissionActions GetSubmissionActions() => new SubmissionExecution(_mapper);
        public ITeamActions GetTeamActions() => new TeamExecution(_mapper);
        public ILeaderboardActions GetLeaderboardActions() => new LeaderboardExecution();
        public INotificationActions GetNotificationActions() => new NotificationExecution();
        public IAuditActions GetAuditActions() => new AuditExecution(_mapper);
        public ICtfEventActions GetCtfEventActions() => new CtfEventExecution(_mapper);
        public IChallengeInstanceActions GetChallengeInstanceActions() => new ChallengeInstanceExecution();
        public IDockerAdminActions GetDockerAdminActions() => new DockerAdminExecution();
    }
}
