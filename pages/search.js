import { useEffect } from "react";
import { withRouter } from "next/router";
const api = require("../libs/api");
import Router from "next/router";
import { Row, Col, List, Pagination } from "antd";
import Repo from "../components/Repo";
import { cacheArray } from "../libs/repo-basic-cache";
// 语言列表和排序没有提供相关api，这里写死
const LANGUAGES = ["JavaScript", "Java", "HTML", "CSS", "Rust", "TypeScript"];
const SORT_TYPES = [
  { name: "Best Match" },
  {
    name: "Most Stars",
    value: "stars",
    order: "desc"
  },
  {
    name: "Fewest Stars",
    value: "stars",
    order: "asc"
  },
  {
    name: "Most Forks",
    value: "forks",
    order: "desc"
  },
  {
    name: "Fewest Forks",
    value: "forks",
    order: "asc"
  }
];
const pageSize = 20;
const isServer = typeof window === "undefined";
const selectedItemStyle = {
  borderLeft: "2px solid #e36209",
  fontWeight: 500
};
const doSearch = params => {
  Router.push({
    pathname: "/search",
    query: params
  });
};

function Search({ router, repos }) {
  const { sort, lang, order, query, page } = router.query;
  useEffect(() => {
    if (!isServer) {
      cacheArray(repos.items);
    }
  });
  return (
    <div className="search-root">
      <Row gutter={20}>
        <Col span={6}>
          <List
            bordered
            header={<span className="list-header">语言</span>}
            style={{ marginBottom: 20 }}
            dataSource={LANGUAGES}
            renderItem={item => (
              <List.Item style={lang === item ? selectedItemStyle : {}}>
                <a
                  onClick={() => {
                    doSearch({
                      sort,
                      order,
                      query,
                      lang: item
                    });
                  }}
                  className="filterItem"
                >
                  {item}
                </a>
              </List.Item>
            )}
          />
          <List
            bordered
            header={<span className="list-header">排序</span>}
            style={{ marginBottom: 20 }}
            dataSource={SORT_TYPES}
            renderItem={item => {
              let selected = false;
              if (!sort && item.name === "Best Match") {
                selected = true;
              } else if (item.value === sort && item.order === order) {
                selected = true;
              }
              return (
                <List.Item style={selected ? selectedItemStyle : null}>
                  <a
                    onClick={() => {
                      doSearch({
                        query,
                        lang,
                        sort: item.value || "",
                        order: item.order || ""
                      });
                    }}
                    className="filterItem"
                  >
                    {item.name}
                  </a>
                </List.Item>
              );
            }}
          />
        </Col>
        <Col span={18}>
          <h3 className="repos-title">{repos.total_count}个仓库</h3>
          {repos.items.map(repo => (
            <Repo repo={repo} key={repo.id}></Repo>
          ))}
          <div className="pagination">
            <Pagination
              pageSize={pageSize}
              current={Number(page) || 1}
              total={repos.total_count > 1000 ? 1000 : repos.total_count}
              onChange={e => {
                doSearch({ sort, order, query, lang, page: e });
              }}
            />
          </div>
        </Col>
      </Row>
      <style jsx>{`
        .search-root {
          padding: 20px 0;
        }
        .list-header {
          font-weight: 800;
          font-size: 16px;
        }
        .filterItem {
          width: 100%;
        }
        .repos-title {
          border-bottom: 1px solid #eee;
          font-size: 24px;
          line-height: 50px;
        }
        .pagination {
          padding: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

Search.getInitialProps = async ({ ctx }) => {
  const { query, sort, lang, order, page } = ctx.query;
  if (!query) {
    return {
      repos: {
        total_count: 0
      }
    };
  }
  // 拼接搜索参数
  let queryStr = `?q=${query}`;
  if (lang) {
    queryStr += `+language:${lang}`;
  }
  if (sort) {
    queryStr += `&sort=${sort}&order=${order || "desc"}`;
  }
  if (page) {
    queryStr += `&page=${page}`;
  }
  queryStr += `&per_page=${pageSize}`;

  // github API限制返回前1000个，超出报错
  const result = await api.request(
    {
      url: `/search/repositories${queryStr}`
    },
    ctx.req,
    ctx.res
  );

  return {
    repos: result.data
  };
};
export default withRouter(Search);
