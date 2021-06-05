/*
 * @Description:认证相关api
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-05 19:27:34
 */
const router = require('koa-router')();
const { login } = require('../../controller/auth');
router.prefix('/api/auth');
router.post('/login', login);

module.exports = router;
