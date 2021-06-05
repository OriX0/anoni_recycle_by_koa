/*
 * @Description: 失败信息的集合
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-05 18:02:23
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
};
