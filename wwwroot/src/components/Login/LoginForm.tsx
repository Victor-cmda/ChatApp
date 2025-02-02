import React from "react";
import { Card, Form, Input, Button, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useChat } from "../../contexts/ChatContext";

const { Title } = Typography;

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const { connect, state } = useChat();
  const [form] = Form.useForm();

  const onFinish = async ({ username }: { username: string }) => {
    try {
      await connect(username);
      onLoginSuccess();
    } catch (error) {
      form.setFields([
        {
          name: "username",
          errors: ["Falha ao conectar. Tente novamente."],
        },
      ]);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", marginTop: "10vh" }}>
      <Card>
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          Chat Login
        </Title>
        <Form form={form} name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Por favor, insira seu nome de usuário!",
              },
              { min: 3, message: "O nome deve ter pelo menos 3 caracteres!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nome de usuário"
              size="large"
              disabled={state.isConnecting}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={state.isConnecting}
              block
              size="large"
            >
              {state.isConnecting ? "Conectando..." : "Entrar no Chat"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
