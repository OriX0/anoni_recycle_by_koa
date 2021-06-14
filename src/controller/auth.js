/*
 * @Description:用户认证控制层
 * @Author: OriX
 * @LastEditors: OriX
 */
const { ErrorModel, SuccessModel } = require('../model/BaseModel');
const { loginFailInfo, authTokenUnableValidInfo } = require('../model/ErrorInfo');
const { getUserInfo } = require('../service/user');
const { doCrypto } = require('../utils/crypto');
const { addToken, getContentFromToken, decodeToken } = require('../utils/jwt_token');
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
  ctx.cookies.set('ref_t', refresh_token, { httpOnly: true, maxAge: 1000 * JWT_CONFIG.JWT_REFRESH_TOKEN_LIFE });
  ctx.cookies.set('acc_t', access_token, { httpOnly: true, maxAge: 1000 * JWT_CONFIG.JWT_TOKEN_LIFE });

  // 3.将userInfo 返回到结果里面去
  ctx.body = new SuccessModel({ userInfo: result, ori_acc_token: access_token });
}
/**
 * 刷新token
 * @param {String} ref_token 做刷新验证的token
 */
async function refreshToken(ctx, ref_token) {
  // 从 header头中解码出来获取加密值
  const userName = decodeToken(ref_token)['uniqueInfo'];
  // 重新获取 acc 和ref t
  const access_token = addToken(userName, JWT_CONFIG.JWT_SECRET_KEY, JWT_CONFIG.JWT_TOKEN_LIFE);
  const refresh_token = addToken(userName, JWT_CONFIG.JWT_REFRESH_SECRET_KEY, JWT_CONFIG.JWT_REFRESH_TOKEN_LIFE);
  ctx.cookies.set('ref_t', refresh_token, { httpOnly: true, maxAge: 1000 * JWT_CONFIG.JWT_REFRESH_TOKEN_LIFE });
  ctx.cookies.set('acc_t', access_token, { httpOnly: true, maxAge: 1000 * JWT_CONFIG.JWT_TOKEN_LIFE });
  // 6.返回新的acc token
  ctx.body = new SuccessModel();
}
/**
 * 退出登录 并吧相应的jwt token 加入到
 * @param {*} ctx
 * @param {*} next
 */
async function loginOut(ctx, next) {
  // 1.从header和cookie中分别拿到 ref 和acc
  const ref_token = ctx.cookies.get('ref_t');
  const acc_token = ctx.cookies.get('acc_t') || null;
  // 2.解析 token 获得加密值和 过期时间
  const ref_obj = getContentFromToken(ref_token);
  const acc_obj = acc_token ? getContentFromToken(acc_token) : { exp: 0 };
  // 3.在redis中设置
  const now = Math.ceil(Date.now() / 1000);
  try {
    set(acc_token, acc_obj.uniqueInfo, acc_obj.exp - now);
    if (acc_token) set(ref_token, ref_obj.uniqueInfo, ref_obj.exp - now);
    ctx.body = new SuccessModel();
  } catch (error) {
    console.log(error.message, error.stack);
    ctx.body = new ErrorModel(authTokenUnableValidInfo);
  }
}
module.exports = { login, refreshToken, loginOut };
