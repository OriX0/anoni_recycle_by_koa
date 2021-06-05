/*
 * @Description: 全局异常捕捉中间件
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-05 18:03:05
 */
const { ErrorModel } = require('../model/BaseModel');
const { authFailInfo } = require('../model/ErrorInfo');

// 全局异常捕捉中间件
const Exception = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const { message, status } = err;
    // 拦截 401
    if (status === 401) {
      ctx.body = new ErrorModel(authFailInfo);
    }
  }
};

module.exports = Exception;
