/*
 * @Description: sequelize的类型 统一管理
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-03 17:31:04
 */
const Sequelize = require('sequelize');
module.exports = {
  STRING: Sequelize.STRING,
  TEXT: Sequelize.TEXT,
  DECIMAL: Sequelize.DECIMAL,
  INTEGER: Sequelize.INTEGER,
  BOOLEAN: Sequelize.BOOLEAN,
};
