/**
 * API配置文件
 * 集中管理API相关的配置信息
 */

// API基础URL
export const BASE_URL = 'http://192.168.88.200:9000/';

// 媒体服务器URL - 用于替换localhost等引用
export const MEDIA_URL = 'http://192.168.88.200:9000';

// API端点
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: 'api/users/token/',
    REFRESH: 'api/users/token/refresh/',
    REGISTER: 'api/users/register/',
    PROFILE: 'api/users/profile/',
  },
  
  // YouTube相关
  YOUTUBE: {
    GET_VIDEO_INFO: 'api/videos/youtube/get_video_info/',
    CREATE_DOWNLOAD: 'api/videos/youtube/',
    GET_DOWNLOADS: 'api/videos/youtube/',
    RETRY_DOWNLOAD: 'api/videos/youtube/{id}/download/',
    CANCEL_DOWNLOAD: 'api/videos/youtube/{id}/cancel/',
    DOWNLOAD_STATUS: 'api/videos/youtube/{id}/download_status/',
    CHECK_COOKIE: 'api/videos/youtube/check_cookie/',
    UPLOAD_COOKIE: 'api/videos/youtube/upload_cookie/',
    EXPORT_BROWSER_COOKIES: 'api/videos/youtube/export_browser_cookies/',
    PROXY_VIDEO: 'api/videos/youtube/proxy_video/',
    STREAM_VIDEO: 'api/videos/youtube/{id}/stream_video/',
    GET_SINGLE_DOWNLOAD: 'api/videos/youtube/{id}/',
  },
  
  // 其他API端点可以继续在此处添加...
};

// 请求超时时间 (毫秒)
export const REQUEST_TIMEOUT = 60000000000; // 1分钟

// HTTP状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

/**
 * 修复URL，确保完整的URL地址
 * @param {String} url - 需要修复的URL
 * @param {String} baseUrl - 基础URL，默认为MEDIA_URL
 * @returns {String} 修复后的完整URL
 */
export function fixUrl(url, baseUrl = MEDIA_URL) {
  if (!url) return '';
  
  // 如果已经是完整URL，直接返回
  if (url.startsWith('http')) {
    return url;
  }
  
  // 处理相对路径
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`;
  } else {
    return `${baseUrl}/${url}`;
  }
}

/**
 * 替换localhost为实际服务器地址
 * @param {String} url - 包含localhost的URL
 * @returns {String} 替换后的URL
 */
export function replaceLocalhost(url) {
  if (!url) return '';
  
  if (url.includes('localhost')) {
    return url.replace(/localhost:\d+/, MEDIA_URL.replace(/^https?:\/\//, ''));
  }
  
  return url;
}

/**
 * 修复响应中的所有URL字段
 * @param {Object} data - 响应数据
 * @param {Array<String>} urlFields - 需要修复的URL字段名列表
 * @returns {Object} 修复后的响应数据
 */
export function fixResponseUrls(data, urlFields = ['url', 'thumbnail', 'direct_url', 'media_url', 'download_path', 'thumbnail_url', 'stream_url']) {
  if (!data) return data;
  
  // 处理数组
  if (Array.isArray(data)) {
    return data.map(item => fixResponseUrls(item, urlFields));
  }
  
  // 处理对象
  if (typeof data === 'object') {
    const result = { ...data };
    
    // 修复指定的URL字段
    urlFields.forEach(field => {
      if (result[field]) {
        // 如果是流媒体URL，确保有stream参数
        if (field === 'stream_url' && !result[field].includes('stream=')) {
          // 添加stream参数
          const separator = result[field].includes('?') ? '&' : '?';
          result[field] = `${result[field]}${separator}stream=true`;
        }
        
        // 先替换localhost
        result[field] = replaceLocalhost(result[field]);
        // 再确保完整URL
        result[field] = fixUrl(result[field]);
      }
    });
    
    // 递归处理嵌套对象
    Object.keys(result).forEach(key => {
      if (typeof result[key] === 'object' && result[key] !== null) {
        result[key] = fixResponseUrls(result[key], urlFields);
      }
    });
    
    return result;
  }
  
  return data;
} 