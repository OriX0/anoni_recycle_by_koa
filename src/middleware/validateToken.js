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
const { verify_Token } = require('../utils/jwt_token');
async function ValidateToken(ctx, next) {
  const currentUrl = ctx.url;
  // 如果不需要鉴权验证 直接跳过验证
  if (noTokenValidUrlList.includes(currentUrl)) {
    await next();
    return;
  }
  // 1.从header和cookie中分别拿到 ref 和acc
  const ref_token = ctx.cookies.get('ref_t');
  let acc_token = ctx.header.authorization;
  // 2.如果 ref_token和acc_token 其中一个无法获取到
  if (!(ref_token && acc_token)) {
    ctx.status = 401;
    return;
  }
  // 修改acc_token
  acc_token = acc_token.split(' ')[1];
  // 3.从redis中取 相关键 判断是否在黑名单中
  let refInBlackList = null;
  let accInBlackList = null;
  try {
    refInBlackList = await get(ref_token);
    accInBlackList = await get(acc_token);
  } catch (error) {
    ctx.status = 401;
    ctx.body = new ErrorModel(authTokenUnableValidInfo);
    return;
  }
  // 3.1 如果存在于黑名单 返回401 让重新登录
  if (refInBlackList && accInBlackList) {
    ctx.status = 401;
    ctx.body = new ErrorModel(authTokenOverdueInfo);
  }
  // 4.判断是否有效
  const ref_verify = verify_Token(ref_token, 2) == 1;
  const acc_verify = verify_Token(acc_token, 1) == 1;

  //  如果验证ref_verify不通过 返回错误
  if (!ref_verify) {
    ctx.status = 401;
    ctx.body = new ErrorModel(authTokeRefUnableValidInfo);
    return;
  }
  // 4.1判断当前的url是否只用验证 如果运行到这一步 说明通过 直接进入下一个
  if (justRefTokenValidUrlList.includes(currentUrl)) {
    // 验证通过 调用next
    await next();
    return;
  }
  // 4.2 验证证acc
  if (!acc_verify) {
    ctx.status = 401;
    ctx.body = new ErrorModel(authTokeAccUnableValidInfo);
    return;
  }
  await next();
}
module.exports = ValidateToken;
