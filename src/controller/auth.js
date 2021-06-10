/*
 * @Description:用户认证控制层
 * @Author: OriX
 * @LastEditors: OriX
 */
const { ErrorModel, SuccessModel } = require('../model/BaseModel');
const { loginFailInfo, authTokenUnableValidInfo } = require('../model/ErrorInfo');
const { getUserInfo } = require('../service/user');
const { doCrypto } = require('../utils/crypto');
const { addToken, verify_Token, getContentFromToken, decodeToken } = require('../utils/jwt_token');
const { JWT_CONFIG } = require('../conf/constant');
const { set } = require('../cache/_redis');

async function login(ctx) {
  const { userName, password } = ctx.request.body;
  const result = await getUserInfo({ userName, password: doCrypto(password) });
  // 查询不存在 报错
  if (!result) {
    ctx.status = 422;
    ctx.body = new ErrorModel(loginFailInfo);
    return;
  }
  // 查询存在
  // 1.获取jwt 设置jwt
  const access_token = addToken(result.userName, JWT_CONFIG.JWT_SECRET_KEY, JWT_CONFIG.JWT_TOKEN_LIFE);
  const refresh_token = addToken(result.userName, JWT_CONFIG.JWT_REFRESH_SECRET_KEY, JWT_CONFIG.JWT_REFRESH_TOKEN_LIFE);
  // 2.将 token 通过 cookie的形式返回
  ctx.cookies.set('ref_t', refresh_token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 48 });
  // 3.将userInfo 返回到结果里面去
  ctx.body = new SuccessModel({ userInfo: result, access_token, expires_in: JWT_CONFIG.JWT_TOKEN_LIFE });
}
/**
 * 刷新token
 * @param {*} ctx 上下文
 * @param {*} next
 */
async function refreshToken(ctx, next) {
  const ref_token = ctx.cookies.get('ref_t');
  // 验证 cookie头里面是否有ref token
  if (!ref_token) {
    console.log('not ref');
    ctx.status = 401;
    // 返回token 无法验证
    ctx.body = new ErrorModel(authTokenUnableValidInfo);
    return;
  }
  // 验证这个 token 是否有效
  let verify_r = verify_Token(ref_token, 2);
  if (verify_r != 1) {
    ctx.status = 401;
    // 返回token 无法验证
    ctx.body = new ErrorModel(authTokenUnableValidInfo);
    return;
  }
  // 3.返回 ref token  eyJhbGci...的形式
  // 4.从 header头中解码出来获取加密值
  const userName = decodeToken(ref_token)['uniqueInfo'];
  // 5.重新获取 acc 和ref t
  const access_token = addToken(userName, JWT_CONFIG.JWT_SECRET_KEY, JWT_CONFIG.JWT_TOKEN_LIFE);
  const refresh_token = addToken(userName, JWT_CONFIG.JWT_REFRESH_SECRET_KEY, JWT_CONFIG.JWT_REFRESH_TOKEN_LIFE);
  ctx.cookies.set('ref_t', refresh_token, { httpOnly: true, maxAge: 1000 * JWT_CONFIG.JWT_REFRESH_TOKEN_LIFE });
  // 6.返回新的acc token
  ctx.body = new SuccessModel({ access_token, expires_in: JWT_CONFIG.JWT_TOKEN_LIFE });
}
/**
 * 退出登录 并吧相应的jwt token 加入到
 * @param {*} ctx
 * @param {*} next
 */
async function loginOut(ctx, next) {
  // 1.从header和cookie中分别拿到 ref 和acc
  const ref_token = ctx.cookies.get('ref_t');
  const acc_token = ctx.header.authorization;
  // 2.解析 token 获得加密值和 过期时间
  const ref_obj = getContentFromToken(ref_token);
  const acc_obj = getContentFromToken(acc_token, true);
  // 3.在redis中设置
  try {
    set(acc_token, acc_obj.uniqueInfo, acc_obj.exp - now);
    set(ref_token, ref_obj.uniqueInfo, ref_obj.exp - now);
    ctx.body = new SuccessModel();
  } catch (error) {
    console.log(error.message, error.stack);
    ctx.body = new ErrorModel(authTokenUnableValidInfo);
  }
}
module.exports = { login, refreshToken, loginOut };
