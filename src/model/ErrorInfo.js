/*
 * @Description: 失败信息的集合
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-10 15:43:54
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
  notAdminInfo: {
    errCode: 10013,
    message: '当前无权限进行该操作',
  },
  passwordResetFailInfo: {
    errCode: 10014,
    message: '用户密码重置失败',
  },
  changeUserLockFalInfo: {
    errCode: 10015,
    message: '用户锁定状态调整失败',
  },
  userInfoGetFailInfo: {
    errCode: 10020,
    message: '用户详情获取失败',
  },
  paramsInvalidInfo: {
    errCode: 10021,
    message: '参数不合法 无法进行相关操作',
  },
  // acc or ref token 验证失败
  authTokenUnableValidInfo: {
    errCode: 10022,
    message: 'acc 或 ref token无法验证',
  },
  // token在黑名单中 需要重新登录
  authTokenOverdueInfo: {
    errCode: 10023,
    message: '这个token已经被注销了请重新登录',
  },
  // ref_token验证失败
  authTokeRefUnableValidInfo: {
    errCode: 10024,
    message: 'ref_token无法验证 请重新登录',
  },
  // acc_token 验证失败
  authTokeAccUnableValidInfo: {
    errCode: 10025,
    message: 'acc_token无法验证 请重新登录',
  },
};
