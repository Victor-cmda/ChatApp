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
            try
            {
                var connection = new UserConnection(Context.ConnectionId, username);
                var mensagensHistorico = await _chatRoom.Ask<IEnumerable<ChatMessage>>(connection);

                foreach (var mensagem in mensagensHistorico)
                {
                    await Clients.Caller.SendAsync("ReceberMensagem", mensagem);
                }

                await Clients.Caller.SendAsync("ConexaoEstabelecida");
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        public async Task<IEnumerable<ChatMessage>> BuscarHistorico()
        {
            var history = await _chatRoom.Ask<ChatHistory>(new GetChatHistory());
            return history.Messages;
        }
    }
}
