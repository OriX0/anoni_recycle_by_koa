/*
 * @Description: 超级管理员相关api的控制层
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-06 19:23:57
 */
const { createUser, getUserInfo, upadateUserInfo } = require('../service/user');
const { SuccessModel, ErrorModel } = require('../model/BaseModel');
const { doCrypto } = require('../utils/crypto');
const { INIT_ADMIN_SECRET_KEY } = require('../conf/constant');
const {
  registerAdminIsExistInfo,
  registerAdminFailInfo,
  registerAdminSecretKeyFailInfo,
  registerUserIsExistInfo,
  registerUserFailInfo,
  paramsInvalidInfo,
  passwordResetFailInfo,
  changeUserLockFalInfo,
} = require('../model/ErrorInfo');
/**
 * 用于系统重置后初次新增最高权限的管理员
 * @param {Object} param0 新增管理员的参数
 * @param {String} userName 用户名
 * @param {String}  password 密码
 * @param {String}  realName 真实名字
 * @param {Number}  role 权限 这里设置为 1
 *
 */
async function initAdmin(secret_key, { userName, password, realName, role = 1 }) {
  // 1.先判断秘钥是否正确
  if (secret_key != INIT_ADMIN_SECRET_KEY) {
    return new ErrorModel(registerAdminSecretKeyFailInfo);
  }
  // 调用service层
  // 2. 根据role 等于1 判断是否已经存在超级管理员了
  const userIfo = await getUserInfo({ role: 1 });
  if (userIfo) {
    //  2.1存在 返回错误
    return new ErrorModel(registerAdminIsExistInfo);
  }
  //  2.2如果不存在  尝试注册
  try {
    const result = await createUser({
      userName,
      password: doCrypto(password),
      realName,
      role,
      city: 'noCity',
    });
    return new SuccessModel(result);
  } catch (error) {
    console.log(error.messgae, error.stack);
    return new ErrorModel(registerAdminFailInfo);
  }
}
/**
 * 增加用户-基于管理员
 * @param {Object} ctx 上下文
 * @returns
 */
async function addUser(ctx) {
  const { userName, password, realName, city } = ctx.request.body;
  // 调用service层
  try {
    await createUser({
      userName,
      password,
      realName,
      role: 2,
      city,
    });
    ctx.body = new SuccessModel();
  } catch (error) {
    console.log(error.messgae, error.stack);
    ctx.body = new ErrorModel(registerUserFailInfo);
  }
}
/**
 * 基于管理员 修改用户
 * 完成重置密码 + 修改用户禁用状态
 * @param {Object} ctx 上下文
 */
async function changeInfo(ctx) {
  const { userName } = ctx.params;
  const { type } = ctx.request.body;
  if (!type) {
    ctx.body = new ErrorModel(paramsInvalidInfo);
  }
  switch (type) {
    case 'RES_PWD':
      const result = await upadateUserInfo({ newPassword: doCrypto('888888') }, { userName });
      if (!result) {
        ctx.body = new ErrorModel(passwordResetFailInfo);
      }
      ctx.body = new SuccessModel({ newPassword: '888888' });
      break;
    case 'CHANGE_LOCK':
      const { newLock } = ctx.request.body;
      const result = await upadateUserInfo({ newLock }, { userName });
      if (!result) {
        ctx.body = new ErrorModel(changeUserLockFalInfo);
      }
      ctx.body = new SuccessModel();
      break;
    default:
      ctx.body = new ErrorModel(passwordResetFailInfo);
      break;
  }
}
module.exports = { initAdmin, addUser, changeInfo };
