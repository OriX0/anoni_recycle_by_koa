/*
 * @Description:超级管理员相关api
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-04 16:52:52
 */
const router = require('koa-router')();
const { initAdmin } = require('../../controller/admin');
router.prefix('/api/admin');
router.post('/initAdmin', async (ctx, next) => {
  const { userName, realName, password, secret_key } = ctx.request.body;
  // 调用控制层
  const result = await initAdmin(secret_key, { userName, realName, password });
  ctx.body = result;
});

module.exports = router;
