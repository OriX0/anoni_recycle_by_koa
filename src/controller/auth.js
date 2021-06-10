/*
 * @Description:用户认证控制层
 * @Author: OriX
 * @LastEditors: OriX
 */
const { ErrorModel, SuccessModel } = require('../model/BaseModel');
const { loginFailInfo, authTokenUnableValidInfo } = require('../model/ErrorInfo');
const { getUserInfo } = require('../service/user');
const { doCrypto } = require('../utils/crypto');
const { addToken, verify_Token } = require('../utils/jwt_token');
const { JWT_CONFIG } = require('../conf/constant');

async function login (ctx) {
  const { userName, password } = ctx.request.body;
  const result = await getUserInfo({ userName, password: doCrypto(password) });
  // 查询不存在 报错
  if (!result) {
    ctx.status = 422;
    ctx.body = new ErrorModel(loginFailInfo);
  }
  // 查询存在
  // 1.获取jwt 设置jwt
  const access_token = addToken(result.userName, JWT_CONFIG.JWT_SECRET_KEY, JWT_CONFIG.JWT_TOKEN_LIFE);
  const refresh_token = addToken(result.id, JWT_CONFIG.JWT_REFRESH_SECRET_KEY, JWT_CONFIG.JWT_REFRESH_TOKEN_LIFE);
  // 2.将 token 通过 cookie的形式返回
  ctx.cookies.set('ref_t', refresh_token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 48 });
  // 3.将userInfo 返回到结果里面去
  ctx.body = new SuccessModel({ userInfo: result, access_token, expires_in: JWT_CONFIG.JWT_TOKEN_LIFE });
}
async function refreshToken (ctx, next) {
  const ref_token = ctx.cookies.get('ref_t');
  if (!ref_token) {
    console.log('not ref')
    ctx.status = 401;
    // 返回token 无法验证
    ctx.body = new ErrorModel(authTokenUnableValidInfo)
  }
  let verify_r = verify_Token(ref_token, 2);
  if (verify_r != 1) {
    ctx.status = 401;
    // 返回token 无法验证
    ctx.body = new ErrorModel(authTokenUnableValidInfo)
  }
  // TODO:解码出 用户名 然后重新加密发回
  let access_t = addToken('待加密', JWT_CONFIG.JWT_SECRET_KEY, JWT_CONFIG.JWT_TOKEN_LIFE);
  ctx.body = new SuccessModel();
  let refresh_t = addToken('待加密', JWT_CONFIG.JWT_REFRESH_SECRET_KEY, JWT_CONFIG.JWT_REFRESH_TOKEN_LIFE);
  ctx.cookies.set('ref_t', refresh_t, { httpOnly: true, maxAge: 1000 * 60 * 60 * 48 });
  ctx.body = new SuccessModel({ access_token: access_t, expires_in: JWT_CONFIG.JWT_TOKEN_LIFE });
}

module.exports = { login, refreshToken };
