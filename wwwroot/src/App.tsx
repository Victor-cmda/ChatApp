import React from "react";
import { Layout } from "antd";
import { ChatProvider } from "./contexts/ChatContext";
import { LoginForm } from "./components/Login/LoginForm";
import { ChatWindow } from "./components/Chat/ChatWindow";
import { useState } from "react";

const { Content } = Layout;

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <ChatProvider>
      <Layout style={{ height: "100vh" }}>
        <Content style={{ padding: "24px" }}>
          {!isLoggedIn ? (
            <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
          ) : (
            <ChatWindow />
          )}
        </Content>
      </Layout>
    </ChatProvider>
  );
};

export default App;
