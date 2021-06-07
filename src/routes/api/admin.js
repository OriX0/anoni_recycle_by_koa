/*
 * @Description:超级管理员相关api
 * @Author: OriX
 * @LastEditors: OriX
 */
const router = require('koa-router')();
const { initAdmin, addUser, changeInfo, getUserList } = require('../../controller/admin');
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
// 用户的禁用和启用 和重置密码
router.patch('/users/:userName/:type', checkIsAdmin, changeInfo);
// 获取所有用户
router.get('/users', checkIsAdmin, getUserList);
module.exports = router;
