import request from '@/static/api/requests.js';

/**
 * 执行综合搜索 
 * @param {Object} params - 搜索参数
 * @param {String} params.keyword - 搜索关键词
 * @param {String} params.type - 搜索类型，可选值: all, video, movie, article
 * @param {Number} params.page - 页码
 * @param {Number} params.page_size - 每页条数
 */
export function search(params) {
  return request({
    url: 'api/search/',
    method: 'GET',
    params
  });
}

/**
 * 获取热门搜索词
 */
export function getHotSearchKeywords() {
  return request({
    url: 'api/search/hot_keywords/',
    method: 'GET'
  });
}

/**
 * 获取搜索历史
 */
export function getSearchHistory() {
  return request({
    url: 'api/search/history/',
    method: 'GET'
  });
}

/**
 * 清除搜索历史
 */
export function clearSearchHistory() {
  return request({
    url: 'api/search/history/',
    method: 'DELETE'
  });
}
