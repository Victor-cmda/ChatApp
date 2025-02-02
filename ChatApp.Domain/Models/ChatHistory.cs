namespace ChatApp.Domain.Models
{
    public class ChatHistory
    {
        public IReadOnlyList<ChatMessage> Messages { get; }

        public ChatHistory(IEnumerable<ChatMessage> messages)
        {
            Messages = messages.ToList().AsReadOnly();
        }
    }
}
