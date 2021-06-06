/*
 * @Description: 用于jest测试的临时服务器
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-06 14:17:43
 */
const supertest = require('supertest');
const app = require('../src/app');
const server = app.callback();
module.exports = supertest(server);
