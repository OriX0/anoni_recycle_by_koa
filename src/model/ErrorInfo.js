/*
 * @Description: 失败信息的集合
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-05 21:49:41
 */
module.exports = {
  loginFailInfo: {
    errCode: 10001,
    message: '登录错误 请检查您的用户名和密码',
  },
  // 鉴权失败
  authFailInfo: {
    errCode: 10002,
    message: '登录信息无效 请重新登录',
  },
  registerUserFailInfo: {
    errCode: 10003,
    message: '注册失败',
  },
  registerUserIsExistInfo: {
    errCode: 10004,
    message: '用户名已存在',
  },
  // 超级管理员已存在 无法再次注册
  registerAdminIsExistInfo: {
    errCode: 10010,
    message: '超级管理员已存在 无法再次注册',
  },
  registerAdminFailInfo: {
    errCode: 10011,
    message: '超级管理员注册失败 请检查参数重试',
  },
  registerAdminSecretKeyFailInfo: {
    errCode: 10012,
    message: '秘钥验证失败 无法注册超级管理员',
  },
  notAdminInof: {
    errCode: 10013,
    message: '当前无权限进行该操作',
  },
};
