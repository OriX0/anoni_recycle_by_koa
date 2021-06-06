/*
 * @Description:用户认证控制层
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-06 14:26:42
 */
const { ErrorModel, SuccessModel } = require('../model/BaseModel');
const { loginFailInfo } = require('../model/ErrorInfo');
const { getUserInfo } = require('../service/user');
const { doCrypto } = require('../utils/crypto');
const { addToken } = require('../utils/jwt_token');
const { JWT_CONFIG } = require('../conf/constant');

async function login(ctx) {
  const { userName, password } = ctx.request.body;
  const result = await getUserInfo({ userName, password: doCrypto(password) });
  // 查询不存在 报错
  if (!result) {
    return new ErrorModel(loginFailInfo);
  }
  // 查询存在
  // 1.获取jwt 设置jwt
  const access_token = addToken(result.userName, JWT_CONFIG.JWT_SECRET_KEY, JWT_CONFIG.JWT_TOKEN_LIFE);
  const refresh_token = addToken(result.id, JWT_CONFIG.JWT_REFRESH_SECRET_KEY, JWT_CONFIG.JWT_REFRESH_TOKEN_LIFE);
  // 2.将 token 通过 cookie的形式返回
  ctx.cookies.set('ac_t', access_token, { httpOnly: true, maxAge: 1000 * 60 });
  ctx.cookies.set('ref_t', refresh_token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 48 });
  // 3.将userInfo 返回到结果里面去
  ctx.body = new SuccessModel(result);
}

module.exports = { login };
