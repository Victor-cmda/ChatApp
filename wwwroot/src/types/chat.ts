export interface ChatMessage {
  usuario: string;
  mensagem: string;
  timestamp: Date;
}

export interface User {
  username: string;
  connectionId?: string;
}

export interface ChatState {
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
  users: User[];
  username: string | null;
}
