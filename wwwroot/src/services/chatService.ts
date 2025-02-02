import * as signalR from "@microsoft/signalr";
import { ChatMessage, User } from "../types/chat";

export class ChatService {
  private connection: signalR.HubConnection | null = null;
  private messageCallbacks: ((message: ChatMessage) => void)[] = [];
  private userListCallbacks: ((users: User[]) => void)[] = [];
  private connectionStateCallbacks: ((isConnected: boolean) => void)[] = [];
  private errorCallbacks: ((error: string) => void)[] = [];

  constructor(private hubUrl: string = "http://localhost:5004/chatHub") {}

  public async connect(username: string): Promise<void> {
    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(this.hubUrl)
        .withAutomaticReconnect([0, 2000, 5000, 10000, 20000])
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.setupEventHandlers();

      await this.connection.start();

      const connectionPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Timeout ao aguardar confirmação de conexão"));
        }, 10000);

        this.connection!.on("ConexaoEstabelecida", () => {
          clearTimeout(timeout);
          resolve();
        });
      });

      await this.connection.invoke("Conectar", username);

      await connectionPromise;

      console.log("Conexão estabelecida com sucesso");
    } catch (error) {
      console.error("Erro na conexão:", error);
      this.handleError("Erro ao conectar ao chat", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.connection) {
        await this.connection.stop();
        this.connection = null;
      }
    } catch (error) {
      this.handleError("Erro ao desconectar do chat", error);
      throw error;
    }
  }

  public async sendMessage(username: string, message: string): Promise<void> {
    try {
      if (!this.connection) {
        throw new Error("Conexão não estabelecida");
      }
      await this.connection.invoke("EnviarMensagem", username, message);
    } catch (error) {
      this.handleError("Erro ao enviar mensagem", error);
      throw error;
    }
  }

  public onMessage(callback: (message: ChatMessage) => void): void {
    this.messageCallbacks.push(callback);
  }

  public onUserListUpdate(callback: (users: User[]) => void): void {
    this.userListCallbacks.push(callback);
  }

  public onConnectionStateChange(
    callback: (isConnected: boolean) => void
  ): void {
    this.connectionStateCallbacks.push(callback);
  }

  public onError(callback: (error: string) => void): void {
    this.errorCallbacks.push(callback);
  }

  private setupEventHandlers(): void {
    if (!this.connection) return;

    this.connection.on("ConexaoEstabelecida", () => {
      this.connectionStateCallbacks.forEach((callback) => callback(true));
    });

    // Receber mensagens
    this.connection.on("ReceberMensagem", (message: ChatMessage) => {
      this.messageCallbacks.forEach((callback) => callback(message));
    });

    // Atualização de lista de usuários
    this.connection.on("AtualizarListaUsuarios", (users: User[]) => {
      this.userListCallbacks.forEach((callback) => callback(users));
    });

    // Estados de conexão
    this.connection.onreconnecting(() => {
      this.connectionStateCallbacks.forEach((callback) => callback(false));
    });

    this.connection.onreconnected(() => {
      this.connectionStateCallbacks.forEach((callback) => callback(true));
    });

    this.connection.onclose(() => {
      this.connectionStateCallbacks.forEach((callback) => callback(false));
    });
  }

  public isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  private handleError(context: string, error: any): void {
    const errorMessage = `${context}: ${error.message || "Erro desconhecido"}`;
    this.errorCallbacks.forEach((callback) => callback(errorMessage));
    console.error(errorMessage, error);
  }

  // Métodos auxiliares para limpeza
  public removeMessageCallback(callback: (message: ChatMessage) => void): void {
    this.messageCallbacks = this.messageCallbacks.filter(
      (cb) => cb !== callback
    );
  }

  public removeUserListCallback(callback: (users: User[]) => void): void {
    this.userListCallbacks = this.userListCallbacks.filter(
      (cb) => cb !== callback
    );
  }

  public removeConnectionStateCallback(
    callback: (isConnected: boolean) => void
  ): void {
    this.connectionStateCallbacks = this.connectionStateCallbacks.filter(
      (cb) => cb !== callback
    );
  }

  public removeErrorCallback(callback: (error: string) => void): void {
    this.errorCallbacks = this.errorCallbacks.filter((cb) => cb !== callback);
  }
}

// Instância singleton do serviço
export const chatService = new ChatService();
