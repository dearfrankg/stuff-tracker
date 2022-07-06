import React, { useState } from "react";
import { useRouter } from "next/router";
import { Layout, Menu, PageHeader } from "antd";
import {
  AppstoreOutlined,
  CloudOutlined,
  UploadOutlined,
  UserOutlined,
  BarChartOutlined,
  ShopOutlined,
  TeamOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;

const resources = {
  styles: {
    logo: {
      height: 32,
      margin: 16,
      background: "rgba(255, 255, 255, 0.2)",
    },

    layout: {
      background: "#fff",
      marginLeft: 200,
      padding: 0,
    },

    header: {
      flex: 1,
      position: "fixed",
      zIndex: 5,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#fff",
      width: "calc( 100vw - 200px )",
      borderBottom: "0.2px solid silver",
      height: 50,
    },

    subHeader: {
      position: "fixed",
      zIndex: 5,
      margin: 0,
      marginTop: 50,
      background: "#fff",
      borderBottom: "0.2px solid silver",
      display: "flex",
      alignItems: "center",
      width: "calc( 100vw - 200px )",
    },
    subHeaderColumn1: { flex: 1 },
    subHeaderColumn2: {
      flex: 3,
      display: "flex",
      justifyContent: "flex-end",
      margin: "0 30px",
    },

    content: {
      margin: 0,
      overflow: "initial",
      minHeight: "calc( 100vh - 205px )",
      marginTop: 136,
      padding: 20,
    },

    footer: {
      textAlign: "center",
    },

    sider: {
      overflow: "auto",
      height: "100vh",
      position: "fixed",
      left: 0,
      top: 0,
      bottom: 0,
    },
  },

  data: {
    menuItems: [
      {
        key: "",
        label: "Items",
        icon: React.createElement(AppstoreOutlined),
      },
      {
        key: "containers",
        label: "Containers",
        icon: React.createElement(AppstoreOutlined),
      },
      {
        key: "upload",
        label: "Upload",
        icon: React.createElement(UploadOutlined),
      },
      {
        key: "admin",
        label: "Admin",
        icon: React.createElement(CloudOutlined),
      },
      {
        key: "account",
        label: "Account",
        icon: React.createElement(UserOutlined),
      },
    ],
  },

  components: (styles) => ({
    SideBar: ({ menuItems, current, handle }) => (
      <Sider style={styles.sider}>
        <div style={styles.logo} />
        <Menu theme="dark" mode="inline" onClick={handle.onClick} defaultSelectedKeys={[current]} items={menuItems} />
      </Sider>
    ),

    SiteHeader: ({ appTitle }) => (
      <Header style={styles.header}>
        <h3>{appTitle}</h3>
      </Header>
    ),

    SiteSubHeader: ({ pageTitle, controls }) => (
      <div style={styles.subHeader}>
        <div style={styles.subHeaderColumn1}>
          <PageHeader title={pageTitle} />
        </div>
        <div style={styles.subHeaderColumn2}>{controls}</div>
      </div>
    ),
  }),
};

const { styles } = resources;
const { menuItems } = resources.data;
const { SideBar, SiteHeader, SiteSubHeader } = resources.components(styles);

export const SiteLayout = ({ pageTitle, controls, children }) => {
  const router = useRouter();
  const path = router.pathname.slice(1);
  const [current, setCurrent] = useState(path);

  const handle = {
    onClick: ({ key }) => {
      setCurrent(key);
      router.push(`/${key.toLowerCase()}`);
    },
  };

  return (
    <Layout hasSider>
      <SideBar {...{ menuItems, handle, current }} />
      <Layout style={styles.layout}>
        <SiteHeader appTitle="Stuff Tracker" />
        <SiteSubHeader pageTitle={pageTitle} controls={controls} />
        <Content style={styles.content}>{children}</Content>
        <Footer style={styles.footer}>©2022 Created by Cogent Labs</Footer>
      </Layout>
    </Layout>
  );
};
