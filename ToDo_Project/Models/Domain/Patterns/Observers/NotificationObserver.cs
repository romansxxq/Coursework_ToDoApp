using Models.Domain.Entities;
using Models.Domain.Observers;
using Services;

namespace Models.Domain.Patterns.Observers;

public class NotificationObserver : ITaskObserver
{
    private readonly NotificationService _notificationService;
    private static readonly TimeZoneInfo UserTimeZone = ResolveUserTimeZone();

    public NotificationObserver(NotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public void OnTaskCompleted(TaskItem task)
    {
        _ = _notificationService.SendAsync(task.Id, $"Task '{task.Title}' was completed.");
    }

    public void OnTaskReminder(TaskItem task, Reminder reminder)
    {
        var displayTime = TimeZoneInfo.ConvertTimeFromUtc(reminder.RemindAt.ToUniversalTime(), UserTimeZone);
        _ = _notificationService.SendAsync(
            task.Id,
            $"Reminder for task:\nTitle: {task.Title}\nDescription: {task.Description}\nPriority: {task.Priority}\nTime (Local): {displayTime:yyyy-MM-dd HH:mm}",
            task.TelegramChatId);
    }

    private static TimeZoneInfo ResolveUserTimeZone()
    {
        var ids = new[] { "FLE Standard Time", "E. Europe Standard Time", "Europe/Kyiv" };

        foreach (var id in ids)
        {
            try
            {
                return TimeZoneInfo.FindSystemTimeZoneById(id);
            }
            catch (TimeZoneNotFoundException)
            {
            }
            catch (InvalidTimeZoneException)
            {
            }
        }

        return TimeZoneInfo.Utc;
    }
}