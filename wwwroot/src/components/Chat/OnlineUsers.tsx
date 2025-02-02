import React from "react";
import { List, Typography, Avatar, Badge } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useChat } from "../../contexts/ChatContext";

const { Title } = Typography;

export const OnlineUsers: React.FC = () => {
  const { state } = useChat();

  return (
    <div style={{ padding: "24px" }}>
      <Title level={4}>Usuários Online ({state.users.length})</Title>
      <List
        itemLayout="horizontal"
        dataSource={state.users}
        renderItem={(user) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Badge status="success" dot>
                  <Avatar icon={<UserOutlined />} />
                </Badge>
              }
              title={user.username}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default OnlineUsers;
