using Akka.Actor;
using ChatApp.Domain.Models;

namespace ChatApp.Core.Actors
{
    public class ChatRoomActor : ReceiveActor
    {
        private readonly HashSet<IActorRef> _participantes;
        private readonly List<ChatMessage> _historicoMensagens;

        public ChatRoomActor()
        {
            _participantes = new HashSet<IActorRef>();
            _historicoMensagens = new List<ChatMessage>();

            Receive<ChatMessage>(HandleMessage);
            Receive<UserConnection>(HandleUserConnection);
        }

        private void HandleMessage(ChatMessage message)
        {
            _historicoMensagens.Add(message);
            foreach (var participante in _participantes)
            {
                participante.Tell(message);
            }
        }

        private void HandleUserConnection(UserConnection connection)
        {
            _participantes.Add(Sender);
            foreach (var msg in _historicoMensagens)
            {
                Sender.Tell(msg);
            }
        }
    }
}
