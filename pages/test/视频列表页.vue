<template>
    <div class="video-list-container">
      <div class="video-grid">
        <div class="video-item" v-for="video in videos" :key="video.id">
          <div class="video-cover">
            <div class="video-placeholder"></div>
            <div class="video-duration">{{video.duration}}</div>
          </div>
          <div class="video-info">
            <h3 class="video-title">{{video.title}}</h3>
            <div class="video-meta">
              <div class="video-author">
                <img :src="video.authorAvatar" class="author-avatar" v-if="video.authorAvatar">
                <span>{{video.author}}</span>
              </div>
              <div class="video-stats">
                <span class="view-count">{{video.viewCount}}播放</span>
              </div>
            </div>
          </div>
  <!--        <div class="video-options">
            <i class="more-icon">...</i>
          </div> -->
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'VideoList',
    data() {
      return {
        videos: [
          {
            id: 1,
            title: 'CF怀旧服，预约开启~',
            coverUrl: '/path/to/cover1.jpg',
            duration: '1:32',
            author: '穿越火线',
            authorAvatar: '/path/to/avatar1.jpg',
            viewCount: '104万'
          },
          {
            id: 2,
            title: '逆天芒果TV强行让speed体验中国的酒桌文化',
            coverUrl: '/path/to/cover2.jpg',
            duration: '13:22',
            author: '玖玖记录',
            authorAvatar: '/path/to/avatar2.jpg',
            viewCount: '3.7万'
          },
          {
            id: 3,
            title: '【原神】4.4版本「彩鹞栉春风」前瞻特别节目',
            coverUrl: '/path/to/cover3.jpg',
            duration: '42:15',
            author: '原神',
            authorAvatar: '/path/to/avatar3.jpg',
            viewCount: '286万'
          },
          {
            id: 4,
            title: '2024年春节联欢晚会节目单正式发布',
            coverUrl: '/path/to/cover4.jpg',
            duration: '5:47',
            author: 'CCTV春晚',
            authorAvatar: '/path/to/avatar4.jpg',
            viewCount: '92万'
          },
          {
            id: 5,
            title: '【美食探店】探秘广州最火爆的茶餐厅',
            coverUrl: '/path/to/cover5.jpg',
            duration: '15:32',
            author: '吃货请闭眼',
            authorAvatar: '/path/to/avatar5.jpg',
            viewCount: '12.8万'
          },
          {
            id: 6,
            title: '2024年第一场大型电竞赛事精彩回顾',
            coverUrl: '/path/to/cover6.jpg',
            duration: '23:45',
            author: '电竞时刻',
            authorAvatar: '/path/to/avatar6.jpg',
            viewCount: '45.2万'
          }
        ]
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
  
    .video-options {
      position: absolute;
      top: 12rpx;
      right: 12rpx;
      color: #fff;
      font-size: 32rpx;
      padding: 8rpx;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 50%;
      width: 40rpx;
      height: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4px);
      transition: all 0.3s ease;
  
      &:active {
        transform: scale(0.9);
      }
    }
  
    &:active {
      transform: scale(0.98);
      box-shadow: 0 1rpx 8rpx rgba(0, 0, 0, 0.03);
    }
  }
  </style>