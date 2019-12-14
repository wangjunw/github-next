import { useEffect } from 'react';
const { request } = require('../libs/api');
import { Button, Icon, Tabs } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import getConfig from 'next/config';
import Repo from '../components/Repo';
const { publicRuntimeConfig } = getConfig();

// 缓存仓库列表数据，不必每次切换都请求
let cacheUserRepos, cacheUserStaredRepos;
const isServer = typeof window === 'undefined';
function Index({ userRepos, userStaredRepos, user, router }) {
    useEffect(() => {
        if (!isServer) {
            cacheUserRepos = userRepos;
            cacheUserStaredRepos = userStaredRepos;
        }
    }, []);

    // 解决跳转页面回来记住上次的tab页
    const tabKey = router.query.key || '1';
    const tabChange = activeKey => {
        router.push(`/?key=${activeKey}`);
    };
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
    return (
        <div className="root">
            <div className="user-info">
                <img src={user.avatar_url} alt="user info" className="avatar" />
                <span className="login">{user.login}</span>
                <span className="name">{user.name}</span>
                <span className="bio">{user.bio}</span>
                <p className="email">
                    <Icon type="mail" style={{ marginRight: 10 }}></Icon>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                </p>
            </div>
            <div className="user-repos">
                <Tabs
                    defaultActiveKey={tabKey}
                    onChange={tabChange}
                    animated={false}
                >
                    <Tabs.TabPane tab="你的仓库" key="1">
                        {userRepos.map(repo => (
                            <Repo repo={repo} key={repo.id} />
                        ))}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="你关注的仓库" key="2">
                        {userStaredRepos.map(repo => (
                            <Repo repo={repo} key={repo.id} />
                        ))}
                    </Tabs.TabPane>
                </Tabs>
            </div>
            <style jsx>{`
                .root {
                    display: flex;
                    align-items: flex-start;
                    padding: 20px 0;
                }
                .user-info {
                    width: 200px;
                    margin-right: 40px;
                    flex-shrink: 0;
                    display: flex;
                    flex-direction: column;
                }
                .login {
                    font-weight: 800;
                    font-size: 20px;
                    margin-top: 20px;
                }
                .name {
                    font-size: 16px;
                    color: #777;
                }
                .bio {
                    margin-top: 20px;
                    color: #333;
                }
                .avatar {
                    width: 100%;
                    border-radius: 5px;
                }
                .user-repos {
                    flex-grow: 1;
                }
            `}</style>
        </div>
    );
}
Index.getInitialProps = async ({ ctx, reduxStore }) => {
    const user = reduxStore.getState().user;
    if (!user || !user.id) {
        return {
            userRepos: [],
            userStaredRepos: []
        };
    }

    // 在非服务端渲染的情况下如果缓存有数据直接返回
    if (!isServer) {
        if (cacheUserRepos && cacheUserStaredRepos) {
            return {
                userRepos: cacheUserRepos,
                userStaredRepos: cacheUserStaredRepos
            };
        }
    }

    // 获取用户的公开仓库信息
    const userRepos = await request({ url: '/user/repos' }, ctx.req, ctx.res);

    // 获取star仓库
    const userStaredRepos = await request(
        {
            url: '/user/starred'
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
)(withRouter(Index));
