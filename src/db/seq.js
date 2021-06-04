/*
 * @Description: 根据本数据库配置 创建一个sequelize实例
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-03 17:23:20
 */
const Sequelize = require('sequelize');
const { isTest } = require('../utils/env');
const { MYSQL_CONF } = require('../conf/db');
const { host, database, prot, user, password } = MYSQL_CONF;
const conf = {
  host,
  dialect: 'mysql',
};
// 如果是测试环境 就不让输出 mysql的语句了
if (isTest) {
  conf.logging = () => {};
}
const seq = new Sequelize(database, user, password, conf);
module.exports = seq;
