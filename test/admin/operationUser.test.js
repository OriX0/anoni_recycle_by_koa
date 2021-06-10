/*
 * @Description: 管理员操作其余用户
 * @Author: OriX
 * @LastEditors: OriX
 */

const server = require('../server');
const { admin_jwt_token, ref_jwt_token_in_cookie } = require('../testUserConf');
const base_date = Date.now();
const userName = `0${base_date}`;
const password = `1${base_date}`;
const realName = `TEST_${base_date}`;
const city = '杭州';
// 新建一个用户
test('新建一个用户 应该成功 ', async () => {
  const result = await server
    .post('/api/admin/users')
    .send({ userName, realName, city })
    .set('Authorization', admin_jwt_token)
    .set('cookie', ref_jwt_token_in_cookie);
  expect(result.body.errCode).toBe(0);
});
// 再次新建该用户 应该失败
test('再次新建该用户 应该失败 ', async () => {
  const result = await server
    .post('/api/admin/users')
    .send({ userName, realName, city })
    .set('Authorization', admin_jwt_token)
    .set('cookie', ref_jwt_token_in_cookie);

  expect(result.body.errCode).not.toBe(0);
});
// 重置这个用户的初始密码
test('重置这个用户 应该重置成功 ', async () => {
  const result = await server
    .patch(`/api/admin/users/${userName}/resetPwd`)
    .set('Authorization', admin_jwt_token)
    .set('cookie', ref_jwt_token_in_cookie);
  expect(result.body.errCode).toBe(0);
});

// 修改这个用户的锁定状态
test('修改这个用户的锁定状态 应该重置成功 ', async () => {
  const result = await server
    .patch(`/api/admin/users/${userName}/lock`)
    .send({ newLock: 1 })
    .set('Authorization', admin_jwt_token)
    .set('cookie', ref_jwt_token_in_cookie);

  expect(result.body.errCode).toBe(0);
});
// 获得这个用户的详情
test('获得这个用户的详情 ', async () => {
  const result = await server
    .get(`/api/admin/users/${userName}`)
    .set('Authorization', admin_jwt_token)
    .set('cookie', ref_jwt_token_in_cookie);
  expect(result.body.errCode).toBe(0);
  expect(result.body.data.is_locked).toBe('1');
});
