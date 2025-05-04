/**
 * API接口统一入口文件
 * 集中导出所有API接口，便于统一管理
 */

// 导入所有API模块
import request from '@/static/api/requests.js';
import { BASE_URL, MEDIA_URL, API_ENDPOINTS, HTTP_STATUS, fixResponseUrls } from '@/static/api/config.js';
import * as youtubeApi from '@/static/api/youtube.js';
import * as userApi from '@/static/api/userApi.js';
import * as videosApi from '@/static/api/videosApi.js';
import * as articlesApi from '@/static/api/articles.js';
import * as uploadApi from '@/static/api/uploadApi.js';
import * as commentsApi from '@/static/api/commentsApi.js';
import * as contentBlocksApi from '@/static/api/contentBlocks.js';
import * as playlistsApi from '@/static/api/playlistsApi.js';
import * as movieApi from '@/static/api/movie.js';
import * as searchApi from '@/static/api/search.js';
import * as fileApi from '@/static/api/file.js';
import * as otherApi from '@/static/api/other.js';
import * as homeApi from '@/static/api/home.js';

// 统一导出所有API
export {
  BASE_URL,
  MEDIA_URL,
  API_ENDPOINTS,
  HTTP_STATUS,
  request,
  youtubeApi,
  userApi,
  videosApi,
  articlesApi,
  uploadApi,
  commentsApi,
  contentBlocksApi,
  playlistsApi,
  movieApi,
  searchApi,
  fileApi,
  otherApi,
  homeApi
};

// 文章相关接口
const articleApi = {
  // 获取文章列表
  getArticlesList(data) {
    return request({
      url: 'api/articles/',
      method: 'GET',
      data
    });
  },
  
  // 获取文章详情
  getArticleDetail(id) {
    return request({
      url: `api/articles/${id}/`,
      method: 'GET'
    });
  },
  
  // 创建文章
  createArticle: (data) => request({
    url: 'api/articles/',
    method: 'POST',
    data
  })
};

// 评论相关接口
const commentApi = {
  // 获取评论列表
  getCommentsList(data) {
    return request({
      url: 'api/comments/',
      method: 'GET',
      data
    });
  },
  
  // 发表评论
  addComment: (data) => request({
    url: 'api/comments/',
    method: 'POST',
    data
  })
};

// 视频相关接口
const videoApi = {
  // 获取视频列表
  getVideosList(data) {
    return request({
      url: 'api/videos/',
      method: 'GET',
      data
    });
  },
  
  // 获取视频详情
  getVideoDetail: (id) => request({
    url: `api/videos/${id}/`,
    method: 'GET'
  }),
  
  // 获取推荐视频
  getRecommendVideos: (data) => request({
    url: 'api/videos/recommend/',
    method: 'GET',
    data
  }),
  
  // 获取热门视频
  getHotVideos: (params) => request({
    url: 'api/videos/hot/',
    method: 'GET',
    params
  })
};

// 导出直接定义的API对象，避免命名冲突
export {
  articleApi,
  commentApi,
  videoApi
};

// YouTube相关API
export const youtubeApiObj = {
  // 获取YouTube视频下载列表
  getDownloadList() {
    return request({
      url: 'api/videos/youtube/',
      method: 'GET'
    });
  }
}; 