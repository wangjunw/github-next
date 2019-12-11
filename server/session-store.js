function getRedisSessionId(sid) {
  return `ssid${sid}`;
}
class RedisSessionStore {
  constructor(client) {
    this.client = client;
  }
  // 获取redis中存储的session数据
  async get(sid) {
    const id = getRedisSessionId(sid);
    const data = await this.client.get(id);
    if (!data) {
      return null;
    }
    try {
      const result = JSON.parse(data);
      return result;
    } catch (err) {
      console.err(err);
    }
  }

  /**
   * 存储session数据
   * @param {*} sid
   * @param {*} sess session内容
   * @param {*} ttl 过期时间
   */
  async set(sid, sess, ttl) {
    const id = getRedisSessionId(sid);
    if (typeof ttl === "number") {
      ttl = Math.ceil(ttl / 1000);
    }
    try {
      const sessStr = JSON.stringify(sess);
      // 如果有过期时间
      if (ttl) {
        await this.client.setex(id, ttl, sessStr);
      } else {
        await this.client.setex(id, sessStr);
      }
    } catch (err) {
      console.err(err);
    }
  }

  // 删除session
  async destroy(sid) {
    const id = getRedisSessionId(sid);
    await this.client.del(id);
  }
}

module.exports = RedisSessionStore;
