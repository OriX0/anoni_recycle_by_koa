/*
 * @Description:认证相关api
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-10 11:11:19
 */
const router = require('koa-router')();
const { login, refreshToken, loginOut } = require('../../controller/auth');
router.prefix('/api/auth');
router.post('/login', login);
router.post('/refreshToken', refreshToken);
router.post('/logout', loginOut);
module.exports = router;
