import api from '../../libs/api';
import WithRepoBasic from '../../components/WithRepoBasic';
import dynamic from 'next/dynamic';

/**
 * dynamic动态导入
 * params1: 函数，返回要导入的模块
 * params2: 未加载完成之前显示的样式
 */
const MarkdownRender = dynamic(
    () => import('../../components/MarkdownRender'),
    {
        loading: () => <p>努力加载中...</p>
    }
);
function Detail({ readme }) {
    return <MarkdownRender content={readme.content} isBase64={true} />;
}
Detail.getInitialProps = async ({
    ctx: {
        query: { owner, name },
        req,
        res
    }
}) => {
    const readmeResp = await api.request(
        {
            url: `/repos/${owner}/${name}/readme`
        },
        req,
        res
    );
    return {
        readme: readmeResp.data
    };
};
export default WithRepoBasic(Detail, 'index');
