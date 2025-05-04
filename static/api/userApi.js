import request from '@/static/api/requests.js'
import store from '@/store'

/**
 * 用户注册
 * @param {Object} userData - 用户注册数据
 * @param {string} userData.username - 用户名
 * @param {string} userData.password - 密码
 * @param {string} userData.email - 电子邮箱
 * @param {string} [userData.nickname] - 昵称
 * @param {string} [userData.phone] - 手机号码
 * @param {string} [userData.gender] - 性别(male/female/other)
 * @param {string} [userData.birth_date] - 出生日期(YYYY-MM-DD)
 * @param {string} [userData.bio] - 个人简介
 * @returns {Promise} 请求Promise对象
 */
export function register(userData) {
    return request({
        url: 'api/users/register/',
        method: 'POST',
        data: userData,
        noToken: true
    });
}

/**
 * 用户登录
 * @param {Object} credentials - 登录凭证
 * @param {string} credentials.username - 用户名
 * @param {string} credentials.password - 密码
 * @returns {Promise} 请求Promise对象，返回包含token和用户信息
 */
export function login(credentials) {
    return request({
        url: 'api/users/login/',
        method: 'POST',
        data: credentials,
        noToken: true
    });
}

/**
 * 刷新访问令牌
 * @param {Object} refreshData - 刷新token数据
 * @param {string} refreshData.refresh - 刷新token
 * @returns {Promise} 请求Promise对象，返回新的访问token
 */
export function refreshToken(refreshData) {
    return request({
        url: 'api/users/token/refresh/',
        method: 'POST',
        data: refreshData,
        noToken: true
    });
}

/**
 * 获取用户信息
 * @returns {Promise} 请求Promise对象，返回用户详细信息
 */
export function getUserInfo() {
    return request({
        url: 'api/users/profile/',
        method: 'GET',
    })
}

/**
 * 更新用户信息
 * @param {Object} userData - 要更新的用户数据
 * @param {string} [userData.nickname] - 昵称
 * @param {string} [userData.bio] - 个人简介
 * @param {string} [userData.phone] - 手机号码
 * @param {string} [userData.gender] - 性别(male/female/other)
 * @param {string} [userData.birth_date] - 出生日期(YYYY-MM-DD)
 * @returns {Promise} 请求Promise对象，返回更新后的用户信息
 */
export function updateUserInfo(userData) {
    return request({
        url: 'api/users/profile/',
        method: 'PATCH',
        data: userData,
    })
}

/**
 * 上传用户头像
 * @param {File} avatarFile - 头像文件
 * @returns {Promise} 请求Promise对象，返回包含新头像URL的响应
 */
export function uploadAvatar(avatarFile) {
    let formData = new FormData();
    formData.append('avatar', avatarFile);
    
    return request({
        url: 'api/users/upload-avatar/',
        method: 'PUT',
        data: formData,
        header: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
