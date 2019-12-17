/**
 * 数据缓存
 */
import LRU from "lru-cache";

const RepoCache = new LRU({
  maxAge: 1000 * 60 * 60
});
export function cache(repo) {
  const full_name = repo.full_name;
  RepoCache.set(full_name, repo);
}

export function get(full_name) {
  return RepoCache.get(full_name);
}

export function cacheArray(repos) {
  if (repos && Array.isArray(repos)) {
    repos.forEach(repo => {
      cache(repo);
    });
  }
}
