
namespace DotFlag.Domain.Enums
{
    public enum AuditAction
    {
        // Challenge
        ChallengeCreated = 10,
        ChallengeUpdated = 11,
        ChallengeDisabled = 12,
        ChallengeEnabled = 13,
        FlagChanged = 14,

        // Challenge extras
        HintAdded = 20,
        HintRemoved = 21,
        FileUploaded = 22,
        FileRemoved = 23,

        // User management
        UserBanned = 30,
        UserUnbanned = 31,
        UserPromoted = 32,
        UserDemoted = 33,

        // Security
        LoginSuccess = 40,
        LoginFailed = 41,
        PasswordChanged = 42,

        // Team
        TeamDisbanded = 50,

        // System
        SystemCleanup = 90
    }
}
