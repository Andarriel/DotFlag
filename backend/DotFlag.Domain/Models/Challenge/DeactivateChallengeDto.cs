using DotFlag.Domain.Enums;

namespace DotFlag.Domain.Models.Challenge
{
    public class DeactivateChallengeDto
    {
        public CompensationType CompensationType { get; set; } = CompensationType.None;

        /// <summary>
        /// Percentage (0-100) when CompensationType = Percentage.
        /// Fixed point amount when CompensationType = Fixed.
        /// Ignored when CompensationType = None.
        /// </summary>
        public int CompensationValue { get; set; } = 0;
    }
}
