using Models.Domain.Entities;
using Models.Domain.Observers;

public class NotificationObserver : ITaskObserver
{
    public void OnTaskReminder(TaskItem task, Reminder reminder)
    {
        // Telegram notification will be sent by NotificationService
    }

    public void OnTaskCompleted(TaskItem task)
    {
        // Handle task completion
    }
}