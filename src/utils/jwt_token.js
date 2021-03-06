/*
 * @Description:jwt 相关操作
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-10 11:14:41
 */
const jwt = require('jsonwebtoken');
const { JWT_CONFIG } = require('../conf/constant');
/**
 *
 * @param {Number} userName  不重复的用户名
 * @param {String} secret 加密秘钥
 * @param {Number} time 过期时间
 * @returns
 */
function addToken(uniqueInfo, secret, time) {
  const token = jwt.sign(
    {
      uniqueInfo,
    },
    secret,
    { expiresIn: time + 's' }
  );
  return token;
}
/**
 * 需要解密的token
 * @param {String} token
 * @returns
 */
function decodeToken(token) {
  const decoded = jwt.decode(token);
  return decoded;
}

/**
 * 验证刷新的token是否有效
 * @param {String} token 提供的token
 * @param {Number} type  1为access  2 refresh为用于刷新的
 * @returns
 */
function verify_Token(token, type) {
  switch (type) {
    case 1:
      return jwt.verify(token, JWT_CONFIG.JWT_SECRET_KEY, (err, decode) => {
        return err ? err : 1;
      });
    case 2:
      return jwt.verify(token, JWT_CONFIG.JWT_REFRESH_SECRET_KEY, (err, decode) => {
        return err ? err : 1;
      });
    default:
      break;
  }
}
/**
 * 从token中解码出内容
 * @param {String} token
 * @param {Boolean} isHeader  是不是在头部 在头部就要 分割文本
 * @returns
 */
function getContentFromToken(token, isHeader = false) {
  let payload = isHeader ? token.split(' ')[1] : token;
  return decodeToken(payload);
}

module.exports = {
  addToken,
  decodeToken,
  verify_Token,
  getContentFromToken,
};
