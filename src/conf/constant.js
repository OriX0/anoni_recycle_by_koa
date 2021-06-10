/*
 * @Description:常量
 * @Author: OriX
 * @LastEditors: OriX
 */
const { isProd } = require('../utils/env');
let token_life = 60 * 60 * 1;
let ref_token_life = 60 * 60 * 1 * 2;
if (isProd) {
  token_life = 60 * 60 * 24; // 1d
  ref_token_life = 60 * 60 * 24 * 2; //2d
}
module.exports = {
  INIT_ADMIN_SECRET_KEY: 'msb@B5X_ori',
  CRYPTO_SECRET_KEY: '0i5o08oo5',
  JWT_CONFIG: {
    JWT_SECRET_KEY: 'GOX5`s&t8Fg',
    JWT_REFRESH_SECRET_KEY: 'Qr{{(ZL3',
    JWT_TOKEN_LIFE: token_life,
    JWT_REFRESH_TOKEN_LIFE: ref_token_life,
  },
  // 初始化超级管理员的配置项
  INIT_ADMIN_CONFIG: {
    userName: '666',
    password: '12345wszcx',
    realName: '超级管理员',
    role: 1,
    city: 'noCity',
  },
  USER_INIT_PASSWORD: 'ittest000',
  DEFAULT_PAGE_SIZE: 10,
  noTokenValidUrlList: ['/api/auth/login', '/api/admin/initAdmin'],
  justRefTokenValidUrlList: ['/api/auth/refreshToken'],
};
