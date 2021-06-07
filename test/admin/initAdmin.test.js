/*
 * @Description: 初始化 超级管理员api
 * @Author: OriX
 * @LastEditors: OriX
 */

const server = require('../server');
const { INIT_ADMIN_SECRET_KEY } = require('../testUserConf');
const { HAVE_INIT_ADMIN } = require('../testUserConf');
// 测试初始化管理员 不带秘钥应该失败
test('测试初始化管理员 不带秘钥应该失败 ', async () => {
  const result = await server.post('/api/admin/initAdmin');
  expect(result.body.errCode).not.toBe(0);
});
if (!HAVE_INIT_ADMIN) {
  // 测试初始化管理员 应该成功
  test('测试初始化管理员 应该成功 ', async () => {
    const result = await server.post('/api/admin/initAdmin').send({ secret_key: INIT_ADMIN_SECRET_KEY });
    expect(result.body.errCode).toBe(0);
  });
}

// 再次发送请求 会报错 告知管理员已经设置
test('再次发送请求 会报错 告知管理员已经设置', async () => {
  const result = await server.post('/api/admin/initAdmin').send({ secret_key: INIT_ADMIN_SECRET_KEY });
  expect(result.body.errCode).not.toBe(0);
});
