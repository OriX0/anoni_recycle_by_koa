/*
 * @Description: 当前登录用户权限
 * @Author: OriX
 * @LastEditors: OriX
 */
const { ErrorModel } = require('../model/BaseModel');
const { notAdminInof } = require('../model/ErrorInfo');
const { decodeToken } = require('../utils/jwt_token');
const { INIT_ADMIN_CONFIG } = require('../conf/constant');
/**
 * 检查是否为admin
 * 检查登录的用户名 是否为配置里的用户名
 */
async function checkIsAdmin(ctx, next) {
  const token = ctx.header.authorization;
  const payload = token.split(' ')[1];
  const userName = decodeToken(payload).uniqueInfo;
  if (userName !== INIT_ADMIN_CONFIG.userName) {
    ctx.status = 403;
    ctx.body = new ErrorModel(notAdminInof);
    return;
  }
  await next();
}

module.exports = {
  checkIsAdmin,
};
