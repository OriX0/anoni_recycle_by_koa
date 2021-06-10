/*
 * @Description: 全局验证中间件
 * @Author: OriX
 * @LastEditors: OriX
 */
const { get } = require('../cache/_redis');
const { authTokenOverdueInfo, authTokeRefUnableValidInfo, authTokenUnableValidInfo } = require('../model/ErrorInfo');
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
  const refInBlackList = await get(ref_token);
  const accInBlackList = await get(acc_token);
  // 3.1 如果存在于黑名单 返回401 让重新登录
  if (refInBlackList && accInBlackList) {
    ctx.status = 401;
    ctx.body = new ErrorModel(authTokenOverdueInfo);
  }
  // 4.判断是否有效
  const ref_verify = verify_Token(ref_token, 2) == 1;
  const acc_verify = verify_Token(acc_token, 1) == 1;
  // 4.1判断当前的url是否只用验证 ref_verify
  if (justRefTokenValidUrlList.includes(currentUrl)) {
    //  如果验证不通过 返回错误
    if (!ref_verify) {
      ctx.status = 401;
      ctx.body = new ErrorModel(authTokeRefUnableValidInfo);
      return;
    }
    // 验证通过 调用next
    await next();
    return;
  }
  // 4.2 如果 验证不通过
  if (!(ref_verify && acc_verify)) {
    ctx.status = 401;
    ctx.body = new ErrorModel(authTokenUnableValidInfo);
    return;
  }
  await next();
}
module.exports = ValidateToken;
