/*
 * @Description: 失败信息的集合
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-04 16:55:27
 */
module.exports = {
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
