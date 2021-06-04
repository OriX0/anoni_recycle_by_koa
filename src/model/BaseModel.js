/*
 * @Description: 控制层统一的返回格式
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-03 21:37:15
 */
class BaseModel {
  constructor({ errCode, data, message }) {
    this.errCode = errCode;
    if (data) {
      this.data = data;
    }
    if (message) {
      this.message = message;
    }
  }
}

class SuccessModel extends BaseModel {
  constructor(data = {}) {
    super({
      errCode: 0,
      data,
    });
  }
}
class ErrorModel extends BaseModel {
  constructor({ errCode, message }) {
    super({
      errCode,
      message,
    });
  }
}
module.exports = {
  SuccessModel,
  ErrorModel,
};
