import request from '@/static/api/requests.js'
import { API_ENDPOINTS, fixResponseUrls } from '@/static/api/config.js'

/**
 * 为视频数据添加流媒体URL
 * @param {Object} videoData - 视频数据对象
 * @returns {Object} 添加了流媒体URL的视频数据
 */
function addStreamUrls(videoData) {
  if (!videoData) return videoData;
  
  // 为格式列表添加流媒体URL
  if (videoData.formats && Array.isArray(videoData.formats)) {
    videoData.formats.forEach(format => {
      if (format.url) {
        format.stream_url = `${API_ENDPOINTS.YOUTUBE.PROXY_VIDEO}?url=${encodeURIComponent(format.url)}&stream=true`;
      }
    });
    
    // 添加最佳流媒体URL到主数据中
    if (!videoData.stream_url) {
      const bestFormat = videoData.formats.find(f => f.acodec !== 'none' && f.vcodec !== 'none') || videoData.formats[0];
      if (bestFormat && bestFormat.url) {
        videoData.stream_url = `${API_ENDPOINTS.YOUTUBE.PROXY_VIDEO}?url=${encodeURIComponent(bestFormat.url)}&stream=true`;
      }
    }
  }
  
  return videoData;
}

/**
 * 获取视频信息
 * @param {Object} data - 请求参数
 * @param {String} data.url - YouTube视频URL
 * @param {String} data.cookie_file - Cookie文件路径(可选)
 * @returns {Promise} 请求Promise对象
 */
export function getVideoInfo(data) {
  console.log('获取视频信息:', data);
  
  return request({
    url: API_ENDPOINTS.YOUTUBE.GET_VIDEO_INFO,
    method: 'POST',
    data: data
  }).then(response => {
    console.log('获取视频信息成功');
    
    // 处理响应中的URL，确保它们是完整的
    response.data = fixResponseUrls(response.data);
    
    // 添加流媒体URL
    response.data = addStreamUrls(response.data);
    
    return response;
  }).catch(error => {
    console.error('获取视频信息失败:', error);
    
    // 处理并增强错误信息
    processApiError(error);
    
    throw error;
  });
}

/**
 * 创建下载任务
 * @param {Object} data - 请求参数
 * @param {String} data.url - YouTube视频URL
 * @param {String} data.format_type - 下载格式类型 (best, audio_only, with_subtitle) - 与format_id互斥
 * @param {String} data.format_id - 特定格式ID - 与format_type互斥
 * @param {Boolean} data.direct - 是否直接下载而不使用后台任务
 * @param {String} data.cookie_file - Cookie文件路径(可选)
 * @param {String} data.output_path - 输出路径(可选)
 * @returns {Promise} 请求Promise对象
 */
export function createDownloadTask(data) {
  console.log('创建下载任务:', data);
  
  // 构建请求URL，支持直接下载选项
  let url = API_ENDPOINTS.YOUTUBE.CREATE_DOWNLOAD;
  if (data.direct) {
    url += '?direct=true';
    delete data.direct; // 从请求体中移除
  }
  
  // 确保format_id和format_type不会同时存在，format_id优先
  if (data.format_id) {
    // 如果有format_id，则移除format_type
    if (data.format_type) {
      delete data.format_type;
    }
  }
  
  // 提示用户开始下载
  uni.showToast({
    title: '开始下载视频，请耐心等待...',
    icon: 'loading',
    duration: 6000
  });
  
  // 这是一个可能长时间运行的请求，设置较长的超时时间
  return request({
    url: url,
    method: 'POST',
    data: data,
    timeout: 1800000, // 30分钟超时，给视频下载足够的时间
    enableKeepAlive: true, // 启用连接保持，避免连接被中断
  }).then(response => {
    console.log('创建下载任务成功:', response.data);
    
    // 处理响应中的URL，确保它们是完整的
    response.data = fixResponseUrls(response.data);
    
    // 提示用户下载任务创建成功
    uni.showToast({
      title: '下载任务创建成功',
      icon: 'success',
      duration: 2000
    });
    
    return response;
  }).catch(error => {
    console.error('创建下载任务失败:', error);
    
    // 处理并增强错误信息
    processApiError(error);
    
    // 显示用户友好的错误消息
    uni.showToast({
      title: error.userFriendlyMessage || '下载任务创建失败，请重试',
      icon: 'none',
      duration: 3000
    });
    
    throw error;
  });
}

/**
 * 获取下载列表
 * @param {Object} params - 请求参数（可选）
 * @param {Number} params.page - 页码
 * @param {Number} params.page_size - 每页条数
 * @returns {Promise} 请求Promise对象
 */
export function getDownloadList(params = {}) {
  return request({
    url: API_ENDPOINTS.YOUTUBE.GET_DOWNLOADS,
    method: 'GET',
    params: params,
    timeout: 60000, // 60秒超时
  }).then(response => {
    console.log('获取下载列表成功');
    
    // 处理响应中的URL，确保它们是完整的
    response.data = fixResponseUrls(response.data);
    
    return response;
  }).catch(error => {
    console.error('获取下载列表失败:', error);
    throw error;
  });
}

/**
 * 获取单个下载任务详情
 * @param {Number} id - 下载任务ID
 * @returns {Promise} 请求Promise对象
 */
export function getDownloadDetail(id) {
  const url = API_ENDPOINTS.YOUTUBE.GET_SINGLE_DOWNLOAD.replace('{id}', id);
  
  return request({
    url: url,
    method: 'GET'
  }).then(response => {
    console.log('获取下载详情成功');
    
    // 处理响应中的URL，确保它们是完整的
    response.data = fixResponseUrls(response.data);
    
    return response;
  }).catch(error => {
    console.error(`获取下载详情失败 (${id}):`, error);
    throw error;
  });
}

/**
 * 获取下载进度
 * @param {Number} id - 下载任务ID
 * @returns {Promise} 请求Promise对象
 */
export function getDownloadProgress(id) {
  const url = API_ENDPOINTS.YOUTUBE.DOWNLOAD_STATUS.replace('{id}', id);
  
  return request({
    url: url,
    method: 'GET'
  }).then(response => {
    // 处理响应中的URL，确保它们是完整的
    response.data = fixResponseUrls(response.data);
    
    return response;
  }).catch(error => {
    console.error(`获取下载进度失败 (${id}):`, error);
    throw error;
  });
}

/**
 * 取消下载任务
 * @param {Number} id - 下载任务ID
 * @returns {Promise} 请求Promise对象
 */
export function cancelDownload(id) {
  const url = API_ENDPOINTS.YOUTUBE.CANCEL_DOWNLOAD.replace('{id}', id);
  
  return request({
    url: url,
    method: 'POST'
  }).then(response => {
    console.log('取消下载任务成功');
    return response;
  }).catch(error => {
    console.error(`取消下载任务失败 (${id}):`, error);
    throw error;
  });
}

/**
 * 重试下载任务或更改下载格式
 * @param {Number} id - 下载任务ID
 * @param {Object} data - 请求参数
 * @param {String} data.format_id - 格式ID (可选)
 * @param {String} data.format_type - 格式类型 (可选)
 * @param {Boolean} direct - 是否直接下载
 * @param {Boolean} showFormats - 是否只显示格式列表
 * @returns {Promise} 请求Promise对象
 */
export function retryDownload(id, data = {}, direct = false, showFormats = false) {
  let url = API_ENDPOINTS.YOUTUBE.RETRY_DOWNLOAD.replace('{id}', id);
  
  // 添加查询参数
  if (direct) {
    url += (url.includes('?') ? '&' : '?') + 'direct=true';
  }
  
  if (showFormats) {
    url += (url.includes('?') ? '&' : '?') + 'show_formats=true';
  }
  
  return request({
    url: url,
    method: 'POST',
    data: data
  }).then(response => {
    console.log('重试下载任务成功');
    
    // 处理响应中的URL，确保它们是完整的
    response.data = fixResponseUrls(response.data);
    
    return response;
  }).catch(error => {
    console.error(`重试下载任务失败 (${id}):`, error);
    throw error;
  });
}

/**
 * 检查Cookie是否有效
 * @returns {Promise} 请求Promise对象
 */
export function checkCookie() {
  return request({
    url: API_ENDPOINTS.YOUTUBE.CHECK_COOKIE,
    method: 'GET'
  }).then(response => {
    console.log('检查Cookie成功');
    return response;
  }).catch(error => {
    console.error('检查Cookie失败:', error);
    throw error;
  });
}

/**
 * 上传Cookie文件
 * @param {FormData} formData - 包含cookie_file字段的FormData对象
 * @returns {Promise} 请求Promise对象
 */
export function uploadCookie(formData) {
  return request({
    url: API_ENDPOINTS.YOUTUBE.UPLOAD_COOKIE,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(response => {
    console.log('上传Cookie成功');
    return response;
  }).catch(error => {
    console.error('上传Cookie失败:', error);
    throw error;
  });
}

/**
 * 从浏览器导出Cookie
 * @param {String} browser - 浏览器名称 (chrome, firefox, edge, safari, opera, brave)
 * @returns {Promise} 请求Promise对象
 */
export function exportBrowserCookies(browser) {
  return request({
    url: API_ENDPOINTS.YOUTUBE.EXPORT_BROWSER_COOKIES,
    method: 'POST',
    data: { browser }
  }).then(response => {
    console.log('从浏览器导出Cookie成功');
    return response;
  }).catch(error => {
    console.error('从浏览器导出Cookie失败:', error);
    throw error;
  });
}

/**
 * 获取视频流媒体URL
 * @param {String} videoId - 视频ID
 * @param {Object} options - 选项
 * @returns {String} 流媒体URL
 */
export function getVideoStreamUrl(videoId, options = {}) {
  if (!videoId) return '';
  
  const baseUrl = API_ENDPOINTS.YOUTUBE.STREAM_VIDEO.replace('{id}', videoId);
  
  // 构建查询参数
  const queryParams = [];
  for (const key in options) {
    if (options.hasOwnProperty(key) && options[key] !== undefined) {
      queryParams.push(`${key}=${encodeURIComponent(options[key])}`);
    }
  }
  
  // 添加查询参数
  const url = queryParams.length > 0 
    ? `${baseUrl}?${queryParams.join('&')}` 
    : baseUrl;
  
  return url;
}

/**
 * 处理API错误
 * @param {Error} error - 错误对象
 */
function processApiError(error) {
  // 如果错误已经处理过，直接返回
  if (error.userFriendlyMessage) return;
  
  // 默认错误消息
  error.userFriendlyMessage = '操作失败，请重试';
  
  // 根据错误消息内容判断错误类型
  const errorMsg = error.message || '';
  
  // 解析特定错误模式
  if (errorMsg.includes('This video is only available for registered users')) {
    error.isLoginRequired = true;
    error.isCookieIssue = true;
    error.userFriendlyMessage = '此视频需要登录才能观看，请上传有效的Cookie文件';
  } 
  else if (errorMsg.includes('This video is not available in your country')) {
    error.isRegionRestricted = true;
    error.userFriendlyMessage = '此视频在您的国家/地区不可用，请使用VPN或代理';
  } 
  else if (errorMsg.includes('Video unavailable') || errorMsg.includes('Private video')) {
    error.isVideoUnavailable = true;
    error.userFriendlyMessage = '视频不可用或已被设为私有';
  } 
  else if (errorMsg.includes('Unable to extract') || errorMsg.includes('Sign in to confirm')) {
    error.isLoginRequired = true;
    error.isCookieIssue = true;
    error.userFriendlyMessage = '需要登录才能获取此视频信息，请上传有效的Cookie文件';
  } 
  else if (errorMsg.includes('network') || errorMsg.includes('timeout') || errorMsg.includes('connection')) {
    error.isNetworkIssue = true;
    error.userFriendlyMessage = '网络连接问题，请检查您的网络连接并重试';
  } 
  else if (errorMsg.includes('server') || errorMsg.includes('500') || errorMsg.includes('503')) {
    error.isServerIssue = true;
    error.userFriendlyMessage = '服务器暂时不可用，请稍后重试';
  }
  
  return error;
} 