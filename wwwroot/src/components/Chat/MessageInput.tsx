import React from "react";
import { Form, Input, Button, Space } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useChat } from "../../contexts/ChatContext";

interface MessageFormValues {
  message: string;
}

export const MessageInput: React.FC = () => {
  const [form] = Form.useForm<MessageFormValues>();
  const { sendMessage, state } = useChat();

  const handleSubmit = async ({ message }: MessageFormValues) => {
    if (!message?.trim()) return;

    try {
      await sendMessage(message);
      form.resetFields();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      console.error("Não foi possível enviar a mensagem. Tente novamente.");
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      style={{
        padding: "12px 24px",
        borderTop: "1px solid #f0f0f0",
      }}
    >
      <Form.Item name="message" style={{ marginBottom: 0 }}>
        <Space.Compact>
          <Input
            placeholder={
              state.isConnected ? "Digite sua mensagem..." : "Reconectando..."
            }
            disabled={!state.isConnected}
            style={{ width: "calc(100% - 100px)" }}
          />
          <Button
            type="primary"
            htmlType="submit"
            disabled={!state.isConnected}
            icon={<SendOutlined />}
            style={{ width: "100px" }}
          >
            Enviar
          </Button>
        </Space.Compact>
      </Form.Item>
    </Form>
  );
};

export default MessageInput;
