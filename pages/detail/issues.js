import WithRepoBasic from "../../components/WithRepoBasic";
import { Avatar, Button, Select, Spin } from "antd";
import { useState, useCallback, useEffect } from "react";
import api from "../../libs/api";
import { getTime } from "../../libs/utils";
import dynamic from "next/dynamic";
import SearchUser from "../../components/SearchUser";
const MarkdownRender = dynamic(() => import("../../components/MarkdownRender"));

const CACHE = {}; //做缓存
const isServer = typeof window === "undefined";
function Label({ label }) {
  return (
    <>
      <span className="label" style={{ backgroundColor: `#${label.color}` }}>
        {label.name}
      </span>
      <style jsx>
        {`
          .label {
            display: inline-block;
            line-height: 20px;
            margin-left: 15px;
            padding: 2px 10px;
            border-radius: 3px;
            font-size: 14px;
          }
        `}
      </style>
    </>
  );
}

function IssuesItem({ issue }) {
  const [showDetail, setShowDetail] = useState(false);
  const toggleShowDetail = useCallback(showDetail => {
    setShowDetail(detail => !detail);
  }, []);
  return (
    <div>
      <div className="issue">
        <Button
          type="primary"
          size="small"
          style={{ position: "absolute", right: 10, top: 10 }}
          onClick={toggleShowDetail}
        >
          {showDetail ? "隐藏" : "查看"}
        </Button>
        <div className="avatar">
          <Avatar src={issue.user.avatar_url} shape="square" size={50} />
        </div>
        <div className="main-info">
          <h6>
            <span>{issue.title}</span>
            {issue.labels.map(label => (
              <Label label={label} key={label.id}>
                {label}
              </Label>
            ))}
          </h6>
          <p className="sub-info">
            <span>Updated at {getTime(issue.updated_at)}</span>
          </p>
        </div>
        <style jsx>{`
          .issue {
            display: flex;
            position: relative;
            padding: 10px;
          }
          .issue:hover {
            background: #fafafa;
          }
          .issue + .issue {
            border-top: solid 1px #eee;
          }
          .main-info > h6 {
            max-width: 600px;
            font-size: 16px;
            padding-right: 40px;
          }
          .avatar {
            margin-right: 20px;
          }
          .sub-info {
            margin-bottom: 0;
          }
          .sub-info > span + span {
            display: inline-block;
            margin-left: 20px;
            font-size: 12px;
          }
        `}</style>
      </div>
      {showDetail ? <IssuesDetail issue={issue} /> : ""}
    </div>
  );
}

function IssuesDetail({ issue }) {
  return (
    <div className="detail">
      <MarkdownRender content={issue.body} />
      <div className="actions">
        <Button href={issue.html_url} target="_blank">
          打开issues讨论页面
        </Button>
      </div>
      <style jsx>
        {`
          .detail {
            background: #fefefe;
            padding: 20px;
          }
          .actions {
            text-align: right;
          }
        `}
      </style>
    </div>
  );
}
// 拼接请求参数
function makeQuery(creator, state, labels) {
  const q_creator = creator ? `creator=${creator}` : "";
  const q_state = state ? `state=${state}` : "";
  const q_labelsStr =
    labels && labels.length !== 0 ? `labels=${labels.join(",")}` : "";
  let queryArr = [];
  if (q_creator) {
    queryArr.push(q_creator);
  }
  if (q_state) {
    queryArr.push(q_state);
  }
  if (q_labelsStr) {
    queryArr.push(q_labelsStr);
  }
  const queryStr = queryArr.join("&");
  return queryStr ? `?${queryStr}` : "";
}
function Issues({ initialIssues, labels, owner, name }) {
  // 搜索条件
  const [creator, setCreator] = useState();
  const [state, setState] = useState();
  const [label, setLabel] = useState([]);
  const [issues, setIssues] = useState(initialIssues);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!isServer) {
      CACHE[`${owner}/${name}`] = labels;
    }
  }, [labels, owner, name]);

  const creatorChangeHandler = useCallback(value => {
    setCreator(value);
  }, []);
  const stateChangeHandler = useCallback(value => {
    setState(value);
  }, []);
  const labelChangeHandler = useCallback(value => {
    setLabel(value);
  }, []);

  const searchHandler = useCallback(() => {
    setFetching(true);
    api
      .request({
        url: `/repos/${owner}/${name}/issues${makeQuery(creator, state, label)}`
      })
      .then(res => {
        setIssues(res.data);
        setFetching(false);
      })
      .catch(err => {
        setFetching(false);
      });
  }, [owner, name, creator, state, label]);

  return (
    <div className="issues-root">
      <div className="search">
        <SearchUser onChange={creatorChangeHandler} value={creator} />
        <Select
          placeholder="状态"
          value={state}
          onChange={stateChangeHandler}
          style={{ width: 200, marginLeft: 20 }}
        >
          <Select.Option value="all">All</Select.Option>
          <Select.Option value="open">Open</Select.Option>
          <Select.Option value="closed">Closed</Select.Option>
        </Select>
        <Select
          placeholder="Label"
          value={label}
          onChange={labelChangeHandler}
          style={{ flexGrow: 1, marginLeft: 20, marginRight: 20 }}
          mode="multiple"
        >
          {labels.map(label => (
            <Select.Option value={label.name} key={label.id}>
              {label.name}
            </Select.Option>
          ))}
        </Select>
        <Button type="primary" onClick={searchHandler}>
          搜索
        </Button>
      </div>

      {fetching ? (
        <div className="loading">
          <Spin />
        </div>
      ) : (
        <div className="issues">
          {issues.map(item => (
            <IssuesItem issue={item} key={item.id} />
          ))}
        </div>
      )}
      <style jsx>
        {`
          .issues {
            border: solid 1px #eee;
            border-radius: 5px;
            margin: 20px 0;
          }
          .search {
            display: flex;
            align-items: center;
          }
          .loading {
            height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
    </div>
  );
}
Issues.getInitialProps = async ({ ctx }) => {
  const { owner, name } = ctx.query;
  /**
   * 两个请求互不依赖，不必await一个完成再请求另一个
   * Promise.all优化
   */
  const fetchs = await Promise.all([
    await api.request(
      { url: `/repos/${owner}/${name}/issues` },
      ctx.req,
      ctx.res
    ),
    CACHE[`${owner}/${name}`]
      ? Promise.resolve({ data: CACHE[`${owner}/${name}`] })
      : await api.request(
          {
            url: `/repos/${owner}/${name}/labels`
          },
          ctx.req,
          ctx.res
        )
  ]);
  return {
    initialIssues: fetchs[0].data,
    labels: fetchs[1].data,
    owner,
    name
  };
};
export default WithRepoBasic(Issues, "issues");
