import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import {
  FileAddOutlined,
  ProfileFilled,
  SettingFilled,
  SlackCircleFilled,
  UserOutlined,
} from "@ant-design/icons";
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

    // Get menu items based on the user's role
    const menuItems = roleMenuMapping[userRoles] || [];

    // Render menu items
    return menuItems.map((item: any) => (
      <Menu.Item key={item.key} icon={item.icon}>
        <Link to={item.path}>{item.label}</Link>
      </Menu.Item>
    ));
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="light">
        <img src="../JOY.png.webp" alt="JOY" className="joylogo" />
        <Menu
          mode="vertical"
          className="menu-container"
          defaultSelectedKeys={["dashboard"]}
        >
          {getMenuItems()}
        </Menu>
      </Sider>
      {/* <Layout className="content-container"> */}
      <Content className="content-container">{children}</Content>
      {/* </Layout> */}
    </Layout>
  );
};

export default CommonLayout;
