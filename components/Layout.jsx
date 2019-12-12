/**
 * 页面整体布局
 */
import { useState, useCallback } from "react";
import { Layout, Icon, Input, Avatar, Tooltip, Dropdown, Menu } from "antd";
const { Header, Content, Footer } = Layout;
import getConfig from "next/config";
import axios from "axios";
import { withRouter } from "next/router";
import Container from "../components/Container";
import { connect } from "react-redux";
const { publicRuntimeConfig } = getConfig();
import { logout } from "../store/store";

const githubIconStyle = {
  color: "#fff",
  fontSize: 40,
  display: "block",
  paddingTop: 10,
  marginRight: 20
};
const footerStyle = {
  textAlign: "center"
};

function LayoutContainer({ children, user, logout, router }) {
  const [search, setSearch] = useState("");
  /**
   * 优化，每次渲染不再重新声明方法，相当于缓存起来
   * 如果不使用useCallback，那么每次组件更新都重新声明searchHandler
   * useCallback其实是useMemo的简化版，专门用来声明方法
   */
  const searchChange = useCallback(e => {
    setSearch(e.target.value);
  }, []);

  // 搜索仓库
  const searchHandler = useCallback(() => {}, []);
  // 登记登出
  const logoutHandler = useCallback(() => {
    logout();
  }, [logout]);
  // 点击登录，先做暂存当前url处理，再去跳转
  const toOAuthHandler = useCallback(e => {
    axios
      .get(`/prepare-auth?url=${router.asPath}`)
      .then(res => {
        if (res.status === 200) {
          location.href = publicRuntimeConfig.OAUTH_URL;
        } else {
          console.log("prepare auth faild", res);
        }
      })
      .catch(err => {
        console.log("prepare auth faild", err);
      });
  }, []);
  const userDropDown = (
    <Menu>
      <Menu.Item>
        <span onClick={logoutHandler}>登出</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Header>
        <div className="header-container">
          <div className="header-left">
            <Icon type="github" style={githubIconStyle}></Icon>
            <div className="serach">
              <Input.Search
                placeholder="搜索仓库"
                onChange={searchChange}
                value={search}
                onSearch={searchHandler}
              />
            </div>
          </div>
          <div className="header-right">
            {user && user.id ? (
              <Dropdown overlay={userDropDown}>
                <a href="/">
                  <Avatar size={40} src={user.avatar_url}></Avatar>
                </a>
              </Dropdown>
            ) : (
              <Tooltip title="点击进行登录" placement="bottomRight">
                <span onClick={toOAuthHandler}>
                  <Avatar size={40} icon="user"></Avatar>
                </span>
              </Tooltip>
            )}
          </div>
        </div>
      </Header>
      <Content>
        <Container>{children}</Container>
      </Content>
      <Footer style={footerStyle}>
        develop by xiaowang @
        <a href="mailto:1157593964@qq.com">1157593964@qq.com</a>
      </Footer>
      {/* 局部样式 */}
      <style jsx>
        {`
          .header-container {
            display: flex;
            align-item: center;
            justify-content: space-between;
          }
          .header-left {
            display: flex;
            justify-content: flex-start;
          }
        `}
      </style>
      {/* 全局样式 */}
      <style jsx global>{`
        #__next {
          height: 100%;
        }
        .ant-layout {
          height: 100%;
        }
        .ant-layout-header {
          padding-left: 20px;
          padding-right: 20px;
        }
      `}</style>
    </Layout>
  );
}
export default connect(
  state => {
    return {
      user: state.user
    };
  },
  dispatch => {
    return {
      logout: () => {
        dispatch(logout());
      }
    };
  }
)(withRouter(LayoutContainer));
