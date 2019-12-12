/**
 * 页面整体布局
 */
import { useState, useCallback } from "react";
import { Button, Layout, Icon, Input, Avatar } from "antd";
const { Header, Content, Footer } = Layout;
import Container from "../components/Container";
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

export default ({ children }) => {
  const [search, setSearch] = useState("");
  /**
   * 优化，每次渲染不再重新声明方法，相当于缓存起来
   * 如果不使用useCallback，那么每次组件更新都重新声明searchHandler
   * useCallback其实是useMemo的简化版，专门用来声明方法
   */
  const searchChange = useCallback(e => {
    setSearch(e.target.value);
  }, []);

  const searchHandler = useCallback(() => {}, []);
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
            <Avatar size={40} icon="user"></Avatar>
          </div>
        </div>
      </Header>
      <Content>
        <Container comp="div">{children}</Container>
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
};
