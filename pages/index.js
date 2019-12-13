const { request } = require("../libs/api");
import { Button } from "antd";
import { connect } from "react-redux";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
function Index({ userRepos, userStaredRepos, user }) {
  if (!user || !user.id) {
    return (
      <div className="noLoginRoot">
        <p>您还没有登录呦！</p>
        <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>
          点击登录
        </Button>
        <style jsx>{`
          .noLoginRoot {
            height: 400px;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
          }
        `}</style>
      </div>
    );
  }
  return <span>Index</span>;
}
Index.getInitialProps = async ({ ctx, reduxStore }) => {
  const user = reduxStore.getState().user;
  if (!user || !user.id) {
    return {
      userRepos: [],
      userStaredRepos: []
    };
  }

  // 获取用户的公开仓库信息
  const userRepos = await request({ url: "/user/repos" }, ctx.req, ctx.res);
  // 获取star仓库
  const userStaredRepos = await request(
    {
      url: "/user/starred"
    },
    ctx.req,
    ctx.res
  );
  return {
    userRepos: userRepos.data,
    userStaredRepos: userStaredRepos.data
  };
};
export default connect(
  state => {
    return {
      user: state.user
    };
  },
  () => {
    return {};
  }
)(Index);
