/*
 * @Description:  redis 操作
 * @Author: OriX
 * @LastEditors: OriX
 */
const redis = require('redis');
const { REDIS_CONF } = require('../conf/db');

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
// 检测redis的连接状态 遇到错误报错
redisClient.on('error', err => {
  console.error('redis error', err);
});
/**redis set方法
 *
 * @param {key}  键
 * @param {value}  值
 * @param {timeout}  缓存时间 单位s
 */
function set(key, value, timeout = 60 * 60) {
  if (typeof value === 'object') {
    value = JSON.stringify(value);
  }
  // 设置值
  redisClient.set(key, value);
  // 设置过期时间
  redisClient.expire(key, timeout);
}
/**
 * 获取值 返回一个promise
 * @param {key} 键
 * @returns
 */
function get(key) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        reject(err);
        return;
      }
      if (val == null) {
        resolve(null);
        return;
      }
      try {
        resolve(JSON.parse(val));
      } catch (error) {
        resolve(val);
      }
    });
  });
}
module.exports = {
  set,
  get,
};
