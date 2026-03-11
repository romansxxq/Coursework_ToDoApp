using Models.Domain.Enums;

namespace Models.Domain.Patterns.Strategies;

public interface IRepetitionStrategy
{
    public DateTime? GetNextExecutionDate(DateTime currentDate);
}