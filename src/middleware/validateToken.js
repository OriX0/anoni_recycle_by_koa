/*
 * @Description: 全局验证中间件
 * @Author: OriX
 * @LastEditors: OriX
 */
const { get } = require('../cache/_redis');
const {
  authTokenOverdueInfo,
  authTokeRefUnableValidInfo,
  authTokenUnableValidInfo,
  authTokeAccUnableValidInfo,
} = require('../model/ErrorInfo');
const { ErrorModel } = require('../model/BaseModel');
const { noTokenValidUrlList, justRefTokenValidUrlList } = require('../conf/constant');
const { verify_Token, getContentFromToken } = require('../utils/jwt_token');
const { refreshToken } = require('../controller/auth');
async function ValidateToken(ctx, next) {
  const currentUrl = ctx.url;
  // 如果不需要鉴权验证 直接跳过验证
  if (noTokenValidUrlList.includes(currentUrl)) {
    await next();
    return;
  }
  // 1.从cookie中分别拿到 ref 和acc
  const ref_token = ctx.cookies.get('ref_t');
  const acc_token = ctx.cookies.get('acc_t');
  // 2.如果 ref_token和acc_token 其中一个无法获取到
  if (!ref_token) {
    ctx.status = 401;
    return;
  }
  // 3.从redis中取 相关键 判断是否在黑名单中
  let refInBlackList = null;
  try {
    refInBlackList = await get(ref_token);
  } catch (error) {
    ctx.status = 401;
    ctx.body = new ErrorModel(authTokenUnableValidInfo);
    return;
  }
  // 3.1 如果存在于黑名单 返回401 让重新登录
  if (refInBlackList) {
    ctx.status = 401;
    ctx.body = new ErrorModel(authTokenOverdueInfo);
  }
  // 4.判断是否合法且有效
  // 4.1 验证是否合法
  const ref_verify = verify_Token(ref_token, 2) == 1;
  const acc_verify = acc_token ? verify_Token(acc_token, 1) == 1 : false;
  // 4.2 获取是否过期
  const now = Math.ceil(Date.now() / 1000);
  const ref_obj = getContentFromToken(ref_token);
  const acc_obj = acc_token ? getContentFromToken(acc_token) : { exp: 0 };
  const ref_exp = (ref_obj.exp || 0) > now;
  const acc_exp = (acc_obj.exp || 0) > now;

  //  4.3.1如果验证ref_verify不通过 返回错误
  if (!ref_verify) {
    ctx.status = 401;
    ctx.body = new ErrorModel(authTokeRefUnableValidInfo);
    return;
  }
  // 4.3.2判断当前的url是否只用验证 如果运行到这一步 说明通过 直接进入下一个
  if (justRefTokenValidUrlList.includes(currentUrl)) {
    // 验证通过 调用next
    await next();
    return;
  }
  // 4.3.3 已知ref合法 判断acc是否过期
  if (!acc_exp) {
    if (ref_verify && ref_exp) {
      console.log('需要刷新token 正在刷新token');
      await refreshToken(ctx, ref_token);
      await next();
      return;
    }
  }

  // 4.4 如果 acc 没过期 那么判断一下 是否合法
  if (!acc_verify) {
    // 4.2 验证证acc
    ctx.status = 401;
    ctx.body = new ErrorModel(authTokeAccUnableValidInfo);
    return;
  }
  await next();
}
module.exports = ValidateToken;
