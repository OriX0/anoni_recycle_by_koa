/*
 * @Description: 数据加密模块
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-04 16:48:03
 */
const crypto = require('crypto');
const { CRYPTO_SECRET_KEY } = require('../conf/constant');
// crypto的 md5加密
function _md5(content) {
  const md5 = crypto.createHash('md5');
  return md5.update(content).digest('hex');
}
/**
 * 做加密处理
 * @param {String} content
 */
function doCrypto(content) {
  const str = `str=${content}secret_key=${content}`;
  return _md5(str);
}

module.exports = { doCrypto };
