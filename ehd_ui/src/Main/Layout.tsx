import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Form,
  Input,
  Layout,
  Menu,
  Modal,
  message,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  FileAddOutlined,
  LockOutlined,
  ProfileFilled,
  SettingFilled,
  SlackCircleFilled,
  UserOutlined,
} from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import axios from "axios";
import { useState } from "react";
const { Sider, Content } = Layout;

const CommonLayout = ({ children, userRoles }: any) => {
  const getMenuItems = () => {
    const roleMenuMapping: any = {
      R01: [
        {
          key: "dashboard",
          label: "Dashboard",
          path: "/admin/dashboard",
          icon: <SlackCircleFilled />,
        },
        {
          key: "escalations",
          label: "Escalations",
          path: "/admin/escalations",
          icon: <SettingFilled />,
        },
        {
          key: "employees",
          label: "Employees",
          path: "/admin/employees",
          icon: <UserOutlined />,
        },

        {
          key: "configuration",
          label: "Configurations",
          path: "/admin/configurations",
          icon: <SettingFilled />,
        },
        {
          key: "createTicket",
          label: "Create Ticket",
          path: "/admin/createTicket",
          icon: <FileAddOutlined />,
        },
        {
          key: "viewTicket",
          label: " Ticket History",
          path: "/admin/viewTicket",
          icon: <ProfileFilled />,
        },
      ],
      R02: [
        {
          key: "overview",
          label: "Overview",
          path: "/user/overview",
          icon: <SlackCircleFilled />,
        },
        {
          key: "createTicket",
          label: "Create Ticket",
          path: "/user/createTicket",
          icon: <FileAddOutlined />,
        },
        {
          key: "viewTicket",
          label: " Ticket History",
          path: "/user/viewTicket",
          icon: <ProfileFilled />,
        },
      ],
      R03: [
        {
          key: "overview",
          label: "Overview",
          path: "/ticketing/overviewIt",
          icon: <SlackCircleFilled />,
        },
        {
          key: "ticketing",
          label: "Ticketing System",
          path: "/ticketing/it",
          icon: <UserOutlined />,
        },
        {
          key: "createTicket",
          label: "Create Ticket",
          path: "/ticketing/createTicketIt",
          icon: <FileAddOutlined />,
        },
        {
          key: "viewTicket",
          label: "Ticket History",
          path: "/ticketing/viewTicketIt",
          icon: <ProfileFilled />,
        },
      ],
      R04: [
        {
          key: "overview",
          label: "Overview",
          path: "/ticketing/overviewPy",
          icon: <SlackCircleFilled />,
        },
        {
          key: "ticketing",
          label: "Ticketing System",
          path: "/ticketing/payroll",
          icon: <UserOutlined />,
        },
        {
          key: "createTicket",
          label: "Create Ticket",
          path: "/ticketing/createTicketPy",
          icon: <FileAddOutlined />,
        },
        {
          key: "viewTicket",
          label: "Ticket History",
          path: "/ticketing/viewTicketPy",
          icon: <ProfileFilled />,
        },
      ],
      R05: [
        {
          key: "overview",
          label: "Overview",
          path: "/ticketing/overviewFc",
          icon: <SlackCircleFilled />,
        },
        {
          key: "ticketing",
          label: "Ticketing System",
          path: "/ticketing/facility",
          icon: <UserOutlined />,
        },
        {
          key: "createTicket",
          label: "Create Ticket",
          path: "/ticketing/createTicketFc",
          icon: <FileAddOutlined />,
        },
        {
          key: "viewTicket",
          label: "Ticket History",
          path: "/ticketing/viewTicketFC",
          icon: <ProfileFilled />,
        },
      ],
      // Add more role-based menu mappings as needed
    };
    const menuItems = roleMenuMapping[userRoles] || [];

    // Render menu items
    return menuItems.map((item: any) => (
      <Menu.Item key={item.key} icon={item.icon}>
        <Link to={item.path}>{item.label}</Link>
      </Menu.Item>
    ));
  };

  const mailId = localStorage.getItem("OfficialMailId");
  const navigate = useNavigate();
  function handleLogout() {
    window.history.replaceState(null, "", "/");
    navigate("/", { replace: true });
    localStorage.clear();
    sessionStorage.clear();
  }

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const handleChangePasswordClick = () => {
    setShowChangePasswordModal(true);
  };

  const handleCPCancel = () => {
    setShowChangePasswordModal(false);
  };

  function ChangePassword() {
    const onFinish = (values: any) => {
      axios({
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
        url: "/api/Account/ResetPassword",
        data: values,
      })
        .then((response) => {
          message.success("Password updated successfully");
        })
        .catch((error) => {
          message.error(error.response.data);
        });
    };
    return (
      <>
        <Form
          onFinish={onFinish}
          initialValues={{ officialMailId: mailId || "" }}
        >
          <Form.Item
            name="officialMailId"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "Please enter a valid email address!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} disabled placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="oldpassword"
            rules={[
              {
                required: true,
                message: "Please input old password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Old password"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Please enter a new password",
              },
              {
                min: 8,
                message: "Password must be at least 8 characters long",
              },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="New password"
            />
          </Form.Item>
          <Form.Item
            name="confrimNewPassword"
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Please re-enter your new password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match."
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm new password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update password
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  }
  function UserDetails() {
    const userMenu = (
      <Menu>
        <Menu.Item key="logout" onClick={handleLogout}>
          Logout
        </Menu.Item>
        <Menu.Item key="changePasw" onClick={handleChangePasswordClick}>
          Change Password
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="dropdownIcon">
        <Dropdown overlay={userMenu} placement="bottomRight">
          <Avatar className="avatar" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    );
  }
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="light">
        <img src="../JoyWhite.png" alt="JOY" className="joylogo" />
        <Divider className="divider"></Divider>
        <Menu
          mode="vertical"
          className="menu-container"
          defaultSelectedKeys={["dashboard"]}
        >
          {getMenuItems()}
        </Menu>
      </Sider>
      <Layout className="content-container">
        <Content className="content-container">
          <Header className="header">
            <UserDetails />
          </Header>
          {children}
        </Content>
      </Layout>
      <Modal
        title="Change Password"
        open={showChangePasswordModal}
        onCancel={handleCPCancel}
        footer={null}
      >
        <ChangePassword />
      </Modal>
    </Layout>
  );
};

export default CommonLayout;
