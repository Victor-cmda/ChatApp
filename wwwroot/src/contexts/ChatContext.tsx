import React, { createContext, useContext, useState, useEffect } from "react";
import { chatService } from "../services/chatService";
import { ChatMessage, ChatState } from "../types/chat";
import { message as antMessage } from "antd";

interface ChatContextType {
  state: ChatState;
  messages: ChatMessage[];
  sendMessage: (message: string) => Promise<void>;
  connect: (username: string) => Promise<void>;
  disconnect: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<ChatState>({
    isConnecting: false,
    isConnected: false,
    error: null,
    users: [],
    username: null as string | null,
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    chatService.onMessage((message) => {
      setMessages((prev) => [...prev, message]);
    });

    chatService.onUserListUpdate((users) => {
      setState((prev) => ({ ...prev, users }));
    });

    chatService.onConnectionStateChange((isConnected) => {
      setState((prev) => ({
        ...prev,
        isConnected,
        isConnecting: false,
      }));
    });

    chatService.onError((error) => {
      setState((prev) => ({ ...prev, error }));
      antMessage.error(error);
    });

    return () => {
      chatService.disconnect().catch(console.error);
    };
  }, []);

  const connect = async (username: string) => {
    setState((prev) => ({ ...prev, isConnecting: true }));
    try {
      await chatService.connect(username);
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        isConnected: true,
        username: username,
      }));
      antMessage.success("Conectado ao chat");
    } catch (error) {
      antMessage.error("Falha ao conectar ao chat");
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      await chatService.disconnect();
    } catch (error) {
      antMessage.error("Erro ao desconectar do chat");
      throw error;
    }
  };

  const sendMessage = async (message: string) => {
    try {
      if (!state.username) {
        antMessage.warning("Usuário não identificado");
        throw new Error("Usuário não identificado");
      }
      await chatService.sendMessage(state.username, message);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      throw error;
    }
  };

  const value = {
    state,
    messages,
    sendMessage,
    connect,
    disconnect,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat deve ser usado dentro de um ChatProvider");
  }
  return context;
};
