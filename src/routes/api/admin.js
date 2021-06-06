/*
 * @Description:超级管理员相关api
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-06 19:17:11
 */
const router = require('koa-router')();
const { initAdmin, addUser, changeInfo } = require('../../controller/admin');
const { checkIsAdmin } = require('../../middleware/permissionVali');
const { getInfoByUserName } = require('../../controller/common');
router.prefix('/api/admin');
router.post('/initAdmin', async (ctx, next) => {
  const { secret_key } = ctx.request.body;
  // 调用控制层
  const result = await initAdmin(secret_key);
  ctx.body = result;
});
// 添加用户
router.post('/users', checkIsAdmin, addUser);
// 获取用户详情
router.get('/users/:userName', checkIsAdmin, getInfoByUserName);
// 用户的禁用和启用
router.patch('/users/:userName/lock', checkIsAdmin, changeInfo);
// 用户重置密码
router.patch('/users/:userName/resetPwd', checkIsAdmin, changeInfo);
module.exports = router;
