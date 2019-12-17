import Link from "next/link";
import { getTime } from "../libs/utils";
import { Icon } from "antd";
function getLincense(license) {
  return license ? `${license.spdx_id} license` : "";
}

export default ({ repo }) => {
  return (
    <div className="repo-root">
      <div className="basic-info">
        <h3 className="repo-title">
          <Link href={`/detail?owner=${repo.owner.login}&name=${repo.name}`}>
            <a>{repo.full_name}</a>
          </Link>
        </h3>
        <p className="repo-desc">{repo.description}</p>
        <p className="other-info">
          {repo.license ? (
            <span className="license">{getLincense(repo.license)}</span>
          ) : (
            ""
          )}
          <span className="last-updated">{getTime(repo.updated_at)}</span>
          <span className="open-issues">{repo.open_issues_count}</span>
        </p>
      </div>
      <div className="lang-star">
        <span className="lang">{repo.language}</span>
        <span className="star">
          {repo.stargazers_count}
          <Icon type="star" theme="filled" style={{ marginLeft: 5 }}></Icon>
        </span>
      </div>
      <style jsx>{`
        .repo-root {
          display: flex;
          justify-content: space-between;
        }
        .repo-root + .repo-root {
          border-top: solid 1px #eee;
          padding-top: 20px;
        }
        .repo-title {
          font-size: 20xp;
        }
        .other-info > span + span {
          margin-left: 10px;
        }
        .lang-star {
          display: flex;
        }
        .lang-star > span {
          width: 200px;
          text-align: right;
        }
        .repo-desc {
          width: 400px;
        }
      `}</style>
    </div>
  );
};
