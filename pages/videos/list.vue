<template>
  <div class="video-list-container">
    <div class="loading-container" v-if="loading">
      <uni-load-more status="loading" :contentText="loadingText"></uni-load-more>
    </div>
    <div class="error-container" v-else-if="error">
      <text class="error-text">{{errorMessage}}</text>
      <button class="retry-btn" @click="fetchVideos">重试</button>
    </div>
    <div class="video-grid" v-else>
      <div class="video-item" v-for="video in videos" :key="video.id" @click="playVideo(video)">
        <div class="video-cover">
          <image v-if="video.thumbnail_url" :src="video.thumbnail_url" mode="aspectFill" class="video-thumbnail"></image>
          <div class="video-placeholder" v-else></div>
          <div class="video-duration">{{formatDuration(video.duration)}}</div>
        </div>
        <div class="video-info">
          <h3 class="video-title">{{video.title}}</h3>
          <div class="video-meta">
            <div class="video-author">
              <image class="author-avatar" src="/static/images/default-avatar.png" mode="aspectFill" v-if="!video.uploader_avatar"></image>
              <span>{{video.uploader || '未知上传者'}}</span>
            </div>
            <div class="video-stats">
              <span class="view-count">{{formatViewCount(video.view_count)}}播放</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="empty-container" v-if="!loading && !error && videos.length === 0">
      <text class="empty-text">暂无视频</text>
    </div>
  </div>
</template>

<script>
import { request } from '@/static/api/index.js';

export default {
  name: 'VideoList',
  data() {
    return {
      videos: [],
      loading: true,
      error: false,
      errorMessage: '加载失败，请重试',
      loadingText: {
        contentdown: '上拉显示更多',
        contentrefresh: '正在加载...',
        contentnomore: '没有更多数据了'
      },
      page: 1,
      hasMore: true
    }
  },
  onLoad() {
    this.fetchVideos();
  },
  methods: {
    fetchVideos() {
      this.loading = true;
      this.error = false;
      
      request({
        url: 'api/videos/youtube/',
        method: 'GET'
      })
        .then(response => {
          console.log('获取视频列表成功:', response);
          if (response.data && response.data.results) {
            this.videos = response.data.results;
            // 调试封面URL
            this.videos.forEach(video => {
              console.log('视频封面URL:', video.thumbnail_url);
            });
            this.hasMore = !!response.data.next;
          } else {
            this.videos = [];
            this.hasMore = false;
          }
        })
        .catch(error => {
          console.error('获取视频列表失败:', error);
          this.error = true;
          this.errorMessage = error.message || '加载失败，请重试';
        })
        .finally(() => {
          this.loading = false;
        });
    },
    
    formatDuration(seconds) {
      if (!seconds) return '00:00';
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    
    formatViewCount(count) {
      if (!count) return '0';
      if (count < 10000) return count.toString();
      if (count < 100000000) return (count / 10000).toFixed(1) + '万';
      return (count / 100000000).toFixed(1) + '亿';
    },
    
    playVideo(video) {
      if (!video) return;
      
      console.log('播放视频:', video);
      
      // 构建参数对象
      const params = {
        video_id: video.id,
        video_url: video.media_url || '',
        title: encodeURIComponent(video.title || '未命名视频'),
        poster: encodeURIComponent(video.thumbnail_url || ''),
        description: encodeURIComponent(video.description || ''),
        download_time: encodeURIComponent(this.formatDate(video.created_at) || '-'),
        file_size: encodeURIComponent(video.file_size || '-')
      };
      
      // 构建查询字符串
      const queryString = Object.entries(params)
        .filter(([_, v]) => v)
        .map(([k, v]) => `${k}=${v}`)
        .join('&');
      
      // 导航到播放页面
      const url = `/pages/video/video?${queryString}`;
      console.log('跳转到:', url);
      
      uni.navigateTo({
        url: url,
        fail: (err) => {
          console.error('导航到播放页面失败:', err);
          uni.showToast({
            title: '无法打开播放页面',
            icon: 'none'
          });
        }
      });
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      
      try {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      } catch (e) {
        console.error('日期格式化错误:', e);
        return dateString;
      }
    },
    
    onPullDownRefresh() {
      console.log('视频列表页面下拉刷新');
      this.page = 1;
      this.fetchVideos();
      uni.stopPullDownRefresh();
    },
    
    onReachBottom() {
      if (this.hasMore && !this.loading) {
        this.page++;
        this.loading = true;
        
        request({
          url: `api/videos/youtube/?page=${this.page}`,
          method: 'GET'
        })
          .then(response => {
            if (response.data && response.data.results && response.data.results.length > 0) {
              this.videos = [...this.videos, ...response.data.results];
              this.hasMore = !!response.data.next;
            } else {
              this.hasMore = false;
            }
          })
          .catch(error => {
            console.error('加载更多视频失败:', error);
            this.page--; // 恢复页码
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.video-list-container {
  padding: 24rpx;
  background: #f8f8f8;
  height: 100vh;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.video-item {
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  .video-cover {
    position: relative;
    width: 100%;
    padding-top: 56.25%; // 16:9 比例

    .video-thumbnail {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8rpx 8rpx 0 0;
    }

    .video-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #e0e0e0;
      border-radius: 8rpx;
    }

    .video-duration {
      position: absolute;
      bottom: 8rpx;
      right: 8rpx;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      padding: 2rpx 8rpx;
      border-radius: 4rpx;
      font-size: 24rpx;
    }
  }

  .video-info {
    padding: 16rpx;
    height: 160rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .video-title {
      font-size: 28rpx;
      font-weight: 600;
      color: #2c3e50;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      transition: color 0.3s ease;
      flex: 1;
    }

    .video-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 24rpx;
      color: #94a3b8;
      margin-top: 8rpx;

      .video-author {
        display: flex;
        align-items: center;
        gap: 12rpx;

        .author-avatar {
          width: 36rpx;
          height: 36rpx;
          border-radius: 50%;
          border: 2rpx solid #e2e8f0;
        }

        span {
          color: #64748b;
          transition: color 0.3s ease;
        }
      }

      .video-stats {
        display: flex;
        align-items: center;
        gap: 16rpx;

        .view-count {
          color: #64748b;
        }
      }
    }
  }

  &:active {
    transform: scale(0.98);
    box-shadow: 0 1rpx 8rpx rgba(0, 0, 0, 0.03);
  }
}

.loading-container, .error-container, .empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
}

.error-text, .empty-text {
  font-size: 30rpx;
  color: #64748b;
  margin-bottom: 20rpx;
}

.retry-btn {
  padding: 10rpx 30rpx;
  background-color: #dd4b39;
  color: #fff;
  border-radius: 8rpx;
  font-size: 28rpx;
  border: none;
}
</style> 