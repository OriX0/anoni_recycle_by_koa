/*
 * @Description:数据库配置
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-03 17:21:04
 */
const { isProd } = require('../utils/env');
let MYSQL_CONF = {
  host: '127.0.0.1',
  prot: '3306',
  user: 'root',
  password: '12345wszcx',
  database: 'aoni_recycle',
};
if (isProd) {
  MYSQL_CONF = {
    host: '生产环境的ip',
    prot: '3306',
    user: '生产环境的用户名',
    password: '生产环境的密码',
    database: '生产环境的数据库名',
  };
}

module.exports = { MYSQL_CONF };
