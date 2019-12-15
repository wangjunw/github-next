import Link from 'next/link';
import Repo from '../../components/Repo';
import api from '../../libs/api';
const Detail = ({ repoBasic }) => {
    return (
        <div className="detail-root">
            <div className="repo-basic">
                <Repo repo={repoBasic} />
                <div className="tabs">
                    <Link href="/detail">
                        <a>Readme</a>
                    </Link>
                    <Link href="/detail/issues">
                        <a className="issues">Issues</a>
                    </Link>
                </div>
            </div>
            <div>Readme</div>
            <style jsx>
                {`
                    .detail-root {
                    }
                `}
            </style>
        </div>
    );
};
Detail.getInitialProps = async ({ ctx }) => {
    const { name, owner } = ctx.query;
    const repoBasic = await api.request(
        {
            url: `/repos/${owner}/${name}`
        },
        ctx.req,
        ctx.res
    );
    return {
        repoBasic: repoBasic.data
    };
};
export default Detail;
