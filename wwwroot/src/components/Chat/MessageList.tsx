import React, { useEffect, useRef } from "react";
import { List, Typography, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useChat } from "../../contexts/ChatContext";

const { Text } = Typography;

export const MessageList: React.FC = () => {
  const { messages, state } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      className="message-list"
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <List
        itemLayout="horizontal"
        dataSource={messages}
        renderItem={(message) => {
          const isOwnMessage = message.usuario === state.users[0]?.username;

          return (
            <List.Item
              style={{
                justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                border: "none",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  backgroundColor: isOwnMessage ? "#1890ff" : "#fff",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    strong
                    style={{ color: isOwnMessage ? "#fff" : "inherit" }}
                  >
                    {message.usuario}
                  </Text>
                </div>
                <Text
                  style={{
                    color: isOwnMessage ? "#fff" : "inherit",
                    wordBreak: "break-word",
                  }}
                >
                  {message.mensagem}
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Text
                    type="secondary"
                    style={{
                      fontSize: "12px",
                      color: isOwnMessage ? "rgba(255,255,255,0.8)" : undefined,
                    }}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </Text>
                </div>
              </div>
            </List.Item>
          );
        }}
      />
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
