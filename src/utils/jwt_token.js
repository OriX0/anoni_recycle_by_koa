/*
 * @Description:jwt 相关操作
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-05 18:08:24
 */
const jwt = require('jsonwebtoken');
const { JWT_CONFIG } = require('../conf/constant');
/**
 *
 * @param {Number} userId  唯一的用户id
 * @param {String} serect 加密秘钥
 * @param {Number} time 过期时间
 * @returns
 */
function addToken(userId, serect, time) {
  const token = jwt.sign(
    {
      userId,
    },
    serect,
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
 * @param {Stirng} token 提供的token
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

module.exports = {
  addToken,
  decodeToken,
  verify_Token,
};
