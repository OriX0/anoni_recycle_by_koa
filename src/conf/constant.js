/*
 * @Description:常量
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-05 21:57:43
 */
module.exports = {
  INIT_ADMIN_SECRET_KEY: 'msb@B5X_ori',
  CRYPTO_SECRET_KEY: '0i5o08oo5',
  JWT_CONFIG: {
    JWT_SECRET_KEY: 'GOX5`s&t8Fg',
    JWT_REFRESH_SECRET_KEY: 'Qr{{(ZL3',
    JWT_TOKEN_LIFE: 60 * 60 * 24, // 24h
    JWT_REFRESH_TOKEN_LIFE: 60 * 60 * 24 * 2, //2day
  },
  // 初始化超级管理员的配置项
  INIT_ADMIN_CONFIG: {
    userName: '666',
    password: '12345wszcx',
    realName: '超级管理员',
    role: 1,
    city: 'noCity',
  },
};
