import React, { useEffect } from "react";
import { Layout, Card, Alert } from "antd";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { OnlineUsers } from "./OnlineUsers";
import { useChat } from "../../contexts/ChatContext";

const { Content, Sider } = Layout;

export const ChatWindow: React.FC = () => {
  const { state } = useChat();

  useEffect(() => {
    return () => {
    };
  }, []);

  return (
    <Layout style={{ height: "100%", background: "#fff" }}>
      {!state.isConnected && (
        <Alert message="Reconectando ao servidor..." type="warning" banner />
      )}
      <Content style={{ display: "flex", flexDirection: "column" }}>
        <Card
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            margin: "0 24px 24px 0",
          }}
          bodyStyle={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: 0,
          }}
        >
          <MessageList />
          <MessageInput />
        </Card>
      </Content>
      <Sider
        width={300}
        theme="light"
        style={{
          background: "#fff",
          borderLeft: "1px solid #f0f0f0",
        }}
      >
        <OnlineUsers />
      </Sider>
    </Layout>
  );
};
