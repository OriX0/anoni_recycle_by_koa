/*
 * @Description: sequelize 同步数据库操作
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-03 17:41:22
 */
const seq = require('./seq');
// 引入模型
require('./model/index');
// 测试连接
seq
  .authenticate()
  .then(() => {
    console.log('auth ok');
  })
  .catch(() => {
    console.log('auth err');
  });
// 执行同步
seq.sync({ force: true }).then(() => {
  console.log('sync ok');
  process.exit();
});
