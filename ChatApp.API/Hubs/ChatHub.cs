using Akka.Actor;
using Akka;
using ChatApp.Domain.Models;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.API.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IActorRef _chatRoom;

        public ChatHub(IActorRef chatRoom)
        {
            _chatRoom = chatRoom;
        }

        public async Task EnviarMensagem(string usuario, string mensagem)
        {
            var chatMessage = new ChatMessage(usuario, mensagem, DateTime.UtcNow);
            await _chatRoom.Ask<Done>(chatMessage);
        }

        public async Task Conectar(string username)
        {
            var connection = new UserConnection(Context.ConnectionId, username);
            await _chatRoom.Ask<Done>(connection);
        }
    }
}
