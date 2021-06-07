/*
 * @Description: 超级管理员相关api的控制层
 * @Author: OriX
 * @LastEditors: OriX
 */
const { createUser, getUserInfo, upadateUserInfo } = require('../service/user');
const { SuccessModel, ErrorModel } = require('../model/BaseModel');
const { doCrypto } = require('../utils/crypto');
const { INIT_ADMIN_SECRET_KEY, INIT_ADMIN_CONFIG, USER_INIT_PASSWORD } = require('../conf/constant');
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
async function initAdmin(secret_key) {
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
    const result = await createUser({ ...INIT_ADMIN_CONFIG, password: doCrypto(INIT_ADMIN_CONFIG.password) });
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
  const { userName, realName, city } = ctx.request.body;
  // 先判断该用户名是否存在了
  const userInfo = await getUserInfo({ userName });
  if (userInfo) {
    return new ErrorModel(registerUserIsExistInfo);
  }
  // 不存在 调用service层 创建用户
  try {
    await createUser({
      userName,
      password: doCrypto(USER_INIT_PASSWORD),
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
  const { userName, type } = ctx.params;
  if (!type) {
    ctx.body = new ErrorModel(paramsInvalidInfo);
  }
  switch (type) {
    case 'resetPwd':
      const result = await upadateUserInfo({ newPassword: doCrypto(USER_INIT_PASSWORD) }, { userName });
      if (!result) {
        ctx.body = new ErrorModel(passwordResetFailInfo);
      }
      ctx.body = new SuccessModel({ newPassword: USER_INIT_PASSWORD });
      break;
    case 'lock':
      const { newLock } = ctx.request.body;
      const resultLock = await upadateUserInfo({ newLock }, { userName });
      if (!resultLock) {
        ctx.body = new ErrorModel(changeUserLockFalInfo);
      }
      ctx.body = new SuccessModel();
      break;
    default:
      ctx.body = new ErrorModel(paramsInvalidInfo);
      break;
  }
}
module.exports = { initAdmin, addUser, changeInfo };
