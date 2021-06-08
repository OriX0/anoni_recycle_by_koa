/*
 * @Description: 管理员和普通用户通用的控制层
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-08 23:33:42
 */
const { ErrorModel, SuccessModel } = require('../model/BaseModel');
const { userInfoGetFailInfo } = require('../model/ErrorInfo');
const { getUserInfo } = require('../service/user');
async function getInfoByUserName (ctx) {
  const { userName } = ctx.params;
  const result = await getUserInfo({ userName });
  if (!result) {
    ctx.status = 422;
    ctx.body = new ErrorModel(userInfoGetFailInfo);
  }
  ctx.body = new SuccessModel(result);
}
module.exports = { getInfoByUserName };
