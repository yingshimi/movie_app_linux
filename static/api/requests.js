import { BASE_URL, HTTP_STATUS } from './config.js';
import store from '@/store';

// 用于防止无限刷新token
let isRefreshing = false;
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 3;

/**
 * 统一请求函数
 * @param {Object} params - 请求参数
 * @param {string} params.url - 请求地址
 * @param {string} params.method - 请求方法，默认为GET
 * @param {Object} params.data - 请求数据
 * @param {Object} params.header - 请求头
 * @param {boolean} params.noToken - 是否不携带token
 * @param {number} params.timeout - 请求超时时间，默认为30000ms (30秒)
 * @param {boolean} params.enableKeepAlive - 是否启用长连接保持，适用于长时间运行的请求
 * @param {boolean} params.silent - 是否静默模式，不显示请求错误提示
 * @returns {Promise} - 请求Promise对象
 */
const request = (params) => {
    const storeState = store.state;
    const url = params.url;
    const method = params.method || "GET";
    const data = params.data || {};
    const header = params.header || {};
    const noToken = params.noToken || false; // 是否不添加token
    const timeout = params.timeout || 30000; // 默认30秒超时
    const enableKeepAlive = params.enableKeepAlive || false; // 是否启用连接保持

    console.log(`发起请求: ${method} ${url}`, data);

    // 如果没有设置Content-Type，并且是POST请求，则默认为application/json
    if (method.toUpperCase() === "POST" && !header['Content-Type']) {
        header['Content-Type'] = 'application/json';
    }

    // 添加 Authorization 头，除非指定了noToken
    if (storeState.token && !noToken) {
        header['Authorization'] = 'Bearer ' + storeState.token;
    }
    
    // 如果启用了长连接保持
    if (enableKeepAlive) {
        // 添加防超时头部，告知服务器这是长时间运行的请求
        header['Connection'] = 'keep-alive';
        header['Keep-Alive'] = 'timeout=3600';  // 1小时
        
        // 提示开始长时间请求
        console.log('开始长时间请求，已启用连接保持机制');
    }

    return new Promise((resolve, reject) => {
        // 存储请求任务
        let requestTask;
        
        // 如果启用了长连接保持，设置一个定时器来保持连接活跃
        let keepAliveTimer = null;
        if (enableKeepAlive) {
            // 每60秒发送一个空的请求来保持连接活跃
            keepAliveTimer = setInterval(() => {
                console.log('发送保持连接活跃信号...');
                // 这里我们只是记录日志，实际的连接保持由底层实现
            }, 60000);
        }
        
        // 处理请求完成后的清理工作
        const cleanupRequest = () => {
            // 清除保持活跃的定时器
            if (keepAliveTimer) {
                clearInterval(keepAliveTimer);
                keepAliveTimer = null;
            }
            
            // 清除请求中状态
            requestTask = null;
            
            // 隐藏加载提示
            uni.hideLoading();
            uni.hideToast();
        };
        
        requestTask = uni.request({
            url: BASE_URL + url,
            method: method,
            header: header,
            data: data,
            timeout: timeout, // 设置超时时间
            success(response) {
                const res = response;
                console.log(`请求响应: ${method} ${url}`, res);
                
                if (res.statusCode === HTTP_STATUS.OK || res.statusCode === HTTP_STATUS.CREATED) {
                    // 请求成功（200 OK 或 201 Created），返回数据和状态码
                    resolve({ data: res.data, statusCode: res.statusCode });
                } else {
                    // 请求失败，返回状态码和错误信息
                    let errorMessage = '请求失败';
                    let errorData = res.data;
                    
                    // 尝试提取更详细的错误信息
                    if (res.data) {
                        if (typeof res.data === 'string') {
                            errorMessage = res.data;
                        } else if (res.data.message) {
                            errorMessage = res.data.message;
                        } else if (res.data.error) {
                            errorMessage = res.data.error;
                        } else if (res.data.detail) {
                            errorMessage = res.data.detail;
                        }
                    }
                    
                    console.error(`请求失败: ${method} ${url}`, res.statusCode, errorMessage, errorData);
                    
                    switch (res.statusCode) {
                        case HTTP_STATUS.UNAUTHORIZED:
                            errorMessage = "未授权，请重新登录";
                            
                            // 避免刷新token的接口本身401时进入死循环
                            if (url === 'api/users/token/refresh/') {
                                // 刷新token接口失败，清除用户信息并跳转到登录页
                                store.commit('removeUser');
                                uni.showModal({
                                    title: "登录已过期",
                                    content: "请重新登录",
                                    showCancel: false,
                                    success() {
                                        setTimeout(() => {
                                            uni.navigateTo({
                                                url: "/pages/login/login",
                                            });
                                        }, 1000);
                                    },
                                });
                                reject({ statusCode: res, message: errorMessage, data: errorData });
                                return;
                            }
                            
                            // 如果是noToken请求，不要尝试刷新token
                            if (noToken) {
                                reject({ statusCode: res, message: errorMessage, data: errorData });
                                return;
                            }
                            
                            // 尝试刷新token，但加入限制防止无限循环
                            if (storeState.refresh && !isRefreshing && refreshAttempts < MAX_REFRESH_ATTEMPTS) {
                                isRefreshing = true;
                                refreshAttempts++;
                                
                                // 导入刷新token函数并调用
                                import('@/static/api/userApi.js').then(userApi => {
                                    userApi.refreshToken({refresh: storeState.refresh})
                                        .then(response => {
                                            // 更新token
                                            store.commit('setToken', response.data.access);
                                            // 重置状态
                                            isRefreshing = false;
                                            
                                            // 重新发送之前的请求
                                            params.header = {
                                                ...header,
                                                'Authorization': 'Bearer ' + response.data.access
                                            };
                                            setTimeout(() => {
                                                // 重新调用请求函数
                                                request(params).then(resolve).catch(reject);
                                            }, 100);
                                        })
                                        .catch(() => {
                                            // 刷新token失败，清除用户信息并跳转到登录页
                                            isRefreshing = false;
                                            store.commit('removeUser');
                                            uni.showModal({
                                                title: "登录已过期",
                                                content: "请重新登录",
                                                showCancel: false,
                                                success() {
                                                    setTimeout(() => {
                                                        uni.navigateTo({
                                                            url: "/pages/login/login",
                                                        });
                                                    }, 1000);
                                                },
                                            });
                                            reject({ statusCode: res, message: errorMessage, data: errorData });
                                        });
                                }).catch(err => {
                                    isRefreshing = false;
                                    reject({ statusCode: res, message: '加载刷新模块失败', data: errorData });
                                });
                            } else {
                                // 没有刷新token或者已经达到最大尝试次数
                                if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
                                    // 重置尝试次数
                                    refreshAttempts = 0;
                                    isRefreshing = false;
                                    
                                    // 清除用户信息
                                    store.commit('removeUser');
                                }
                                
                                uni.showModal({
                                    title: "未授权",
                                    content: "登录失败，请检查用户名和密码",
                                    showCancel: false,
                                    success() {
                                        setTimeout(() => {
                                            uni.navigateTo({
                                                url: "/pages/login/login",
                                            });
                                        }, 1000);
                                    },
                                });
                                reject({ statusCode: res, message: errorMessage, data: errorData });
                            }
                            break;
                        case HTTP_STATUS.NOT_FOUND:
                            errorMessage = "请求地址不存在";
                            reject({ statusCode: res, message: errorMessage, data: errorData });
                            break;
                        case HTTP_STATUS.BAD_REQUEST:
                            errorMessage = "请求参数错误";
                            if (errorData && typeof errorData === 'object') {
                                // 尝试获取第一个错误信息
                                const firstErrorKey = Object.keys(errorData)[0];
                                if (firstErrorKey && Array.isArray(errorData[firstErrorKey])) {
                                    errorMessage = `${firstErrorKey}: ${errorData[firstErrorKey][0]}`;
                                }
                            }
                            reject({ statusCode: res, message: errorMessage, data: errorData });
                            break;
                        case HTTP_STATUS.SERVER_ERROR:
                            errorMessage = "服务器内部错误";
                            reject({ statusCode: res, message: errorMessage, data: errorData });
                            break;
                        default:
                            errorMessage = `服务器错误(${res.statusCode})，请重试`;
                            reject({ statusCode: res, message: errorMessage, data: errorData });
                            break;
                    }
                }
            },
            fail(err) {
                // 网络错误或其他异常
                console.error(`请求异常: ${method} ${url}`, err);
                
                let errorMessage = '网络异常';
                
                // 判断是否是超时错误
                if (err.errMsg && err.errMsg.indexOf('timeout') !== -1) {
                    errorMessage = '请求超时，请检查网络连接并重试';
                } 
                // 判断是否是网络连接错误
                else if (err.errMsg && err.errMsg.indexOf('request:fail') !== -1) {
                    if (err.errMsg.indexOf('socket') !== -1 || err.errMsg.indexOf('pipe') !== -1) {
                        // 如果是启用了长连接的请求，特殊处理
                        if (enableKeepAlive) {
                            errorMessage = '长时间请求连接中断，但服务端可能仍在处理，请稍后检查结果';
                        } else {
                            errorMessage = '网络连接断开，可能是服务器暂时不可用，请稍后重试';
                        }
                    } else {
                        errorMessage = '网络异常，请检查网络连接';
                    }
                } else {
                    errorMessage = '未知错误: ' + (err.errMsg || JSON.stringify(err));
                }
                
                // 只在非静默模式下显示提示
                if (!params.silent) {
                    uni.showToast({
                        title: errorMessage,
                        icon: "none",
                        duration: 3000
                    });
                }
                
                reject({ statusCode: err, message: errorMessage });
            },
            complete() {
                // 清理请求相关资源
                cleanupRequest();
            }
        });
        
        // 存储请求任务，以便可以在需要时中止请求
        if (params.requestTask) {
            params.requestTask(requestTask);
        }
    });
};

// 导出请求函数
export default request;