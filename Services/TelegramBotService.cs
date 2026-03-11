using Telegram.Bot;
using ToDo_Project.Models.Domain.Entities;
using ToDo_Project.Models.Domain.Patterns.Observers;

namespace ToDo_Project.Services;

public class TelegramBotService : ITaskObserver
{
    private readonly TelegramBotClient _botClient;
    private readonly string _chatId;

    public TelegramBotService(string botToken, string chatId)
    {
        _botClient = new TelegramBotClient(botToken);
        _chatId = chatId;
    }

    public async void OnTaskReminder(TaskItem task, Reminder reminder)
    {
        if (!reminder.IsSent)
        {
            string message = $"Reminder: Task '{task.Title}' is due at {reminder.RemindAt}.";
            await _botClient.SendTextMessageAsync(_chatId, message);
            reminder.IsSent = true; // Mark the reminder as sent
        }
    }

    public void OnTaskCompleted(TaskItem task)
    {
        // Handle task completion if needed
    }
}