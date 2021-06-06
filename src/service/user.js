/*
 * @Description: 对user表操作的 服务层
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-06 17:16:50
 */
const { User } = require('../db/model/index');
/**
 * 获取用户信息 根据指定条件
 * @param {Object} param0  用于查询的参数
 */
async function getUserInfo({ userName, password, role }) {
  const whereObj = {};
  if (userName) whereObj.userName = userName;
  if (password) whereObj.password = password;
  if (role) whereObj.role = role;
  const result = await User.findOne({
    where: whereObj,
    attributes: ['id', 'userName', 'realName', 'city', 'avatar', 'role', 'is_locked'],
  });
  // 如果查询不到返回null
  if (result === null) {
    return null;
  }
  return result.dataValues;
}
/**
 * 数据库新增用户
 * @param {Object} param0 新增用户的参数
 * @param {String} userName 用户名
 * @param {String}  password 密码
 * @param {String}  realName 真实名字
 * @param {Number}  role 权限
 * @param {city} city 所属城市
 * @returns
 */
async function createUser({ userName, password, realName, role, city }) {
  const createObj = {
    userName,
    password,
    realName,
  };
  if (role) createObj.role = role;
  if (city) createObj.city = city;
  const result = await User.create(createObj);
  return result.dataValues;
}
/**
 * 数据库 更新某个用户
 * @param {Object} param0 要修改的信息
 * @param {Object} param1 原来的信息
 * @returns
 */
async function upadateUserInfo({ newPassword, newCity, newLock, newRealName, newPicture }, { userName, password }) {
  // 更新信息
  const updateObj = {};
  if (newPassword) {
    updateObj.password = newPassword;
  }
  if (newCity) {
    updateObj.city = newCity;
  }
  if (newLock) {
    updateObj.lock = newLock;
  }
  if (newRealName) {
    updateObj.relaName = newRealName;
  }
  if (newPicture) {
    updateObj.picture = newPicture;
  }
  // where条件
  const whereObj = {
    userName,
  };
  if (password) {
    whereObj.password = password;
  }
  const result = await User.update(updateObj, {
    where: whereObj,
  });
  return result[0] > 0;
}

module.exports = {
  createUser,
  getUserInfo,
  upadateUserInfo,
};
