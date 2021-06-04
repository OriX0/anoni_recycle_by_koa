/*
 * @Description: 环境变量 判断当前的执行环境
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-03 17:02:01
 */
const ENV = process.env.NODE_ENV;
module.exports = {
  isDev: ENV === 'dev',
  notDev: ENV !== 'dev',
  isProd: ENV === 'production',
  notProd: ENV !== 'production',
  isTest: ENV === 'test',
  notTest: ENV !== 'test',
};
