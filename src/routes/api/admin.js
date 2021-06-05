/*
 * @Description:超级管理员相关api
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-05 21:54:55
 */
const router = require('koa-router')();
const { initAdmin, addUser } = require('../../controller/admin');
const { checkIsAdmin } = require('../../middleware/permissionVali');
router.prefix('/api/admin');
router.post('/initAdmin', async (ctx, next) => {
  const { secret_key } = ctx.request.body;
  // 调用控制层
  const result = await initAdmin(secret_key);
  ctx.body = result;
});
// 添加用户
router.post('/users', checkIsAdmin, addUser);

module.exports = router;
