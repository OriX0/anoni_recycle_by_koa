/*
 * @Description: 对service返回数据进行处理
 * @Author: OriX
 * @LastEditors: OriX
 */
const { DEFAULT_AVATAR_URL } = require('../conf/constant');
/**
 * 格式化处理用户头像
 * @param {Object} userObj  用户信息对象
 * @returns
 */
function _formateAvatarUrl(userObj) {
  if (userObj.avatar == null) {
    userObj.avatar == DEFAULT_AVATAR_URL;
  }
  return userObj;
}
/**
 * 格式化处理用户
 * @param {Object||Array} list
 * @returns
 */
function formateUser(list) {
  // 如果是null 直接返回
  if (list == null) return list;
  // 如果 传入的是数组 调用map方法进行批量处理
  if (Array.isArray(list)) {
    return list.map(_formateAvatarUrl);
  }
  // 如果是对象 直接处理
  return _formateAvatarUrl(list);
}

module.exports = {
  formateUser,
};
