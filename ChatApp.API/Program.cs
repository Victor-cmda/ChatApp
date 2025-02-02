using Akka.Actor;
using ChatApp.API.Hubs;
using ChatApp.Core.Actors;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ChatPolicy", builder =>
    {
        builder.WithOrigins("http://localhost:5173")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

var actorSystem = ActorSystem.Create("ChatSystem");
var chatRoom = actorSystem.ActorOf(Props.Create(() => new ChatRoomActor()), "chatRoom");

builder.Services.AddSingleton(chatRoom);
builder.Services.AddSignalR();

var app = builder.Build();

app.UseCors("ChatPolicy");
app.MapHub<ChatHub>("/chathub");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();