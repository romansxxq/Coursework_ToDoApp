using Models.Domain.Entities;
using Models.Domain.Enums;
using Models.Domain.Patterns.Strategies;

namespace Models.Domain.Patterns.Factories;

public class TaskFactory
{
    public TaskItem CreateTask(
        string title,
        string description,
        DateTime dueDate,
        TypePriority priority,
        RepetitionType repetitionType,
        long telegramChatId)
    {
        var task = new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = title,
            Description = description,
            DueDate = dueDate,
            Priority = priority,
            RepetitionType = repetitionType,
            TelegramChatId = telegramChatId
        };
        task.RepetitionStrategy = CreateRepetitionStrategy(repetitionType);
        return task;
    }
    public void RestoreBehaviors(TaskItem task)
    {
        if (task == null) return;
        
        task.RepetitionStrategy = CreateRepetitionStrategy(task.RepetitionType);
    }
    private IRepetitionStrategy CreateRepetitionStrategy(RepetitionType type)
    {
        return type switch
        {
            RepetitionType.Daily => new DailyRepetitionStrategy(),
            RepetitionType.Weekly => new WeeklyRepetitionStrategy(),
            RepetitionType.Monthly => new MonthlyRepetitionStrategy(),
            _ => new NoRepetitionStrategy()
        };
    }
}