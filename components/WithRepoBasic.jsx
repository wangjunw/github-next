import { useEffect } from "react";
import Link from "next/link";
import Repo from "./Repo";
import api from "../libs/api";
import { withRouter } from "next/router";
import { get, cache } from "../libs/repo-basic-cache";
function makeQuery(queryObj) {
  /**
   * reduce遍历，每次result都是上次的结果
   * params 1: 有返回值的函数，参数：（每次执行的结果、每次遍历的值、索引）
   * params 2：result的初始值
   */
  const query = Object.entries(queryObj)
    .reduce((result, entry) => {
      result.push(entry.join("="));
      return result;
    }, [])
    .join("&");
  return `?${query}`;
}
const isServer = typeof window === "undefined";
export default function(Comp, type = "index") {
  function WithDetail({ repoBasic, router, ...rest }) {
    useEffect(() => {
      if (!isServer) {
        cache(repoBasic);
      }
    });
    const query = makeQuery(router.query);
    return (
      <div className="detail-root">
        <div className="repo-basic">
          <Repo repo={repoBasic} />
          <div className="tabs">
            {type === "index" ? (
              <span className="tab">Readme</span>
            ) : (
              <Link href={`/detail${query}`}>
                <a className="tab index">Readme</a>
              </Link>
            )}
            {type === "issues" ? (
              <span className="tab">Issues</span>
            ) : (
              <Link href={`/detail/issues${query}`}>
                <a className="tab issues">Issues</a>
              </Link>
            )}
          </div>
        </div>
        <div>
          <Comp {...rest} />
        </div>
        <style jsx>
          {`
            .detail-root {
              padding-top: 20px;
            }
            .repo-basic {
              padding: 20px;
              border: solid 1px #eee;
              margin-bottom: 20px;
              border-radius: 5px;
            }
            .tab + .tab {
              margin-left: 20px;
            }
          `}
        </style>
      </div>
    );
  }

  WithDetail.getInitialProps = async context => {
    const { ctx, router } = context;
    const { name, owner } = ctx.query;
    let pageData = {};
    if (Comp.getInitialProps) {
      pageData = await Comp.getInitialProps(context);
    }
    const full_name = `${owner}/${name}`;
    if (get(full_name)) {
      return {
        repoBasic: get(full_name),
        ...pageData
      };
    }
    const repoBasic = await api.request(
      {
        url: `/repos/${owner}/${name}`
      },
      ctx.req,
      ctx.res
    );

    return {
      repoBasic: repoBasic.data,
      ...pageData
    };
  };
  return withRouter(WithDetail);
}
