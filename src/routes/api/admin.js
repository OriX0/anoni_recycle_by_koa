/*
 * @Description:超级管理员相关api
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-05 20:25:42
 */
const router = require('koa-router')();
const { initAdmin, addUser } = require('../../controller/admin');
router.prefix('/api/admin');
router.post('/initAdmin', async (ctx, next) => {
  const { userName, realName, password, secret_key } = ctx.request.body;
  // 调用控制层
  const result = await initAdmin(secret_key, { userName, realName, password });
  ctx.body = result;
});
// 添加用户
router.post('/users', addUser);

module.exports = router;
