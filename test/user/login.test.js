/*
 * @Description: 登录接口的测试
 * @Author: OriX
 * @LastEditors: OriX
 */
const server = require('../server');
const { TEST_PASSWORD: password, TEST_USER_NAME: userName } = require('../testUserConf');
test('测试登录用户 应该成功 ', async () => {
  const result = await server.post('/api/auth/login').send({ userName, password });
  expect(result.body.errCode).toBe(0);
  const cookies = result.headers['set-cookie'].join(';');
  console.log('get cookies', cookies);
});
