/*
 * @Description: user model
 * @Author: OriX
 * @LastEditors: OriX
 * @LastEditTime: 2021-06-04 16:09:27
 */
const seq = require('../seq');
const { STRING, DECIMAL } = require('../types');
const User = seq.define('user', {
  userName: {
    type: STRING,
    allowNull: false,
    unique: true,
    comment: '用户名 唯一 本系统中用钉钉工号代替',
  },
  password: {
    type: STRING,
    allowNull: false,
    comment: '用户密码',
  },
  avatar: {
    type: STRING,
    comment: '用户头像 url',
  },
  realName: {
    type: STRING,
    allowNull: false,
    comment: '员工的真实名称',
  },
  city: {
    type: STRING,
    allowNull: false,
    defaultValue: '杭州',
    comment: '用户所属的城市 （杭州/北京）',
  },
  role: {
    type: DECIMAL,
    allowNull: false,
    defaultValue: 2,
    comment: '用户角色 1为管理员 2为普通用户(IT-test) ',
  },
  is_locked: {
    type: DECIMAL,
    allowNull: false,
    defaultValue: 0,
    comment: '用户是否锁定 0正常 1锁定',
  },
});
module.exports = User;
