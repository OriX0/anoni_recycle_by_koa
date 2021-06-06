/*
 * @Description: 超级管理员相关api的控制层
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-06 14:00:38
 */
const { createUser, getUserInfo } = require('../service/user');
const { SuccessModel, ErrorModel } = require('../model/BaseModel');
const { doCrypto } = require('../utils/crypto');
const { INIT_ADMIN_SECRET_KEY, INIT_ADMIN_CONFIG } = require('../conf/constant');
const {
  registerAdminIsExistInfo,
  registerAdminFailInfo,
  registerAdminSecretKeyFailInfo,
  registerUserIsExistInfo,
  registerUserFailInfo,
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
    ctx.body = new ErrorModel(registerAdminIsExistInfo);
    return;
  }
  //  2.2如果不存在  尝试注册
  try {
    const result = await createUser({ ...INIT_ADMIN_CONFIG, password: doCrypto(INIT_ADMIN_CONFIG.password) });
    ctx.body = new SuccessModel(result);
  } catch (error) {
    console.log(error.messgae, error.stack);
    return new ErrorModel(registerAdminFailInfo);
  }
}

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
    return new SuccessModel();
  } catch (error) {
    console.log(error.messgae, error.stack);
    return new ErrorModel(registerUserFailInfo);
  }
}
module.exports = { initAdmin, addUser };
