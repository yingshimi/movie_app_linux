<template>
	<view class="">
		<view style="width: 100%; background-color: white; position: fixed; z-index: 999999;top: 0;"
			:style="{ height: statusBarHeight + 'px' }"></view>
		<view style="width: 100%; position: fixed; z-index: 999999;height: 40px;"
			:style="{ top: statusBarHeight + 'px' }">
			<Search class="search" v-model="keyword" :goSearch="goSearch"></Search>
		</view>
		<view class="video-category-container" :style="{ marginTop: statusBarHeight+ 70 + 'px' }">
			<!-- 顶部分类标签栏 -->
			<view class="custom-tabs">
				<scroll-view scroll-x="true" class="scroll-view" show-scrollbar="false">
					<view class="tab-items">
						<view v-for="(category, index) in categories" :key="index" class="tab-item"
							:class="{active: currentCategory === index}" @tap="changeCategory(index)">
							{{ category.name }}
							<view class="underline" v-if="currentCategory === index"></view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 视频列表区域 -->
			<view class="videos-container">
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
							<image v-if="video.thumbnail_url" :src="video.thumbnail_url" mode="aspectFill"
								class="video-thumbnail"></image>
							<div class="video-placeholder" v-else></div>
							<div class="video-duration">{{formatDuration(video.duration)}}</div>
						</div>
						<div class="video-info">
							<h3 class="video-title">{{video.title}}</h3>
							<div class="video-meta">
								<div class="video-author">
									<image class="author-avatar" src="/static/images/default-avatar.png"
										mode="aspectFill" v-if="!video.uploader_avatar"></image>
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
					<text class="empty-text">暂无{{categories[currentCategory].name}}视频</text>
				</div>
			</view>
		</view>
	</view>

</template>

<script>
	import {
		request
	} from '@/static/api/index.js';

	export default {
		name: 'TestVideoCategory',
		data() {
			return {
				keyword: '',
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
				categories: [{
						name: '推荐',
						param: 'programming'
					},
					{
						name: '电影',
						param: 'movie'
					},
					{
						name: '剧集',
						param: 'movie'
					},
					{
						name: '音乐',
						param: 'music'
					},
					{
						name: '编程',
						param: 'behind_the_scenes'
					},
					{
						name: '花絮',
						param: 'behind_the_scenes'
					},

				],
				currentCategory: 0,
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
			goSearch() {},
			changeCategory(index) {
				if (this.currentCategory !== index) {
					this.currentCategory = index;
					this.page = 1;
					this.videos = [];
					this.fetchVideos();
				}
			},

			fetchVideos() {
				this.loading = true;
				this.error = false;

				// 根据当前分类确定请求参数
				const category = this.categories[this.currentCategory].param;

				request({
						url: `api/videos/youtube/?category=${category}&page=${this.page}`,
						method: 'GET'
					})
					.then(response => {
						console.log(`获取${this.categories[this.currentCategory].name}视频列表成功:`, response);
						if (response.data && response.data.results) {
							this.videos = this.page === 1 ? response.data.results : [...this.videos, ...response.data
								.results
							];
							this.hasMore = !!response.data.next;
						} else {
							if (this.page === 1) {
								this.videos = [];
							}
							this.hasMore = false;
						}
					})
					.catch(error => {
						console.error(`获取${this.categories[this.currentCategory].name}视频列表失败:`, error);
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
					category: encodeURIComponent(this.categories[this.currentCategory].name),
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
			}
		},
		onPullDownRefresh() {
			this.page = 1;
			this.fetchVideos();
			uni.stopPullDownRefresh();
		},

		onReachBottom() {
			if (this.hasMore && !this.loading) {
				this.page++;
				this.fetchVideos();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.video-category-container {
		display: flex;
		flex-direction: column;
		background: #fff;
		min-height: 100vh;
	}

	.custom-tabs {
		background: #fff;
		padding: 0;
		position: sticky;
		top: 0;
		z-index: 10;
		border-bottom: 1px solid #f5f5f5;
	}

	.scroll-view {
		width: 100%;
		white-space: nowrap;
	}

	.tab-items {
		display: flex;
		padding: 0 10px;
		height: 50px;
	}

	.tab-item {
		position: relative;
		padding: 14px 20px;
		font-size: 16px;
		color: #888;
		transition: all 0.3s;
		display: inline-block;
	}

	.tab-item.active {
		color: #000;
		font-weight: 500;
	}

	.underline {
		position: absolute;
		bottom: 0;
		left: 20px;
		right: 20px;
		height: 2px;
		background-color: #000;
	}

	.videos-container {
		flex: 1;
		padding: 15px;
	}

	.video-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 15px;
		padding-bottom: 20px;
	}

	.video-item {
		background: #fff;
		border-radius: 12px;
		overflow: hidden;
		position: relative;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
		margin-bottom: 5px;

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
			}

			.video-placeholder {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: #e0e0e0;
			}

			.video-duration {
				position: absolute;
				bottom: 8px;
				right: 8px;
				background: rgba(0, 0, 0, 0.7);
				color: #fff;
				padding: 2px 8px;
				border-radius: 4px;
				font-size: 12px;
			}
		}

		.video-info {
			padding: 10px;
			min-height: 80px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			flex: 1;

			.video-title {
				font-size: 14px;
				font-weight: 600;
				color: #333;
				line-height: 1.4;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				margin: 0 0 8px 0;
			}

			.video-meta {
				display: flex;
				flex-wrap: wrap;
				font-size: 12px;
				color: #777;
				margin-top: 5px;

				.video-author {
					display: flex;
					align-items: center;
					gap: 6px;
					margin-bottom: 4px;
					width: 100%;

					.author-avatar {
						width: 18px;
						height: 18px;
						border-radius: 50%;
					}
				}

				.video-stats {
					width: 100%;
					display: flex;
					justify-content: flex-start;

					.view-count {
						color: #999;
					}
				}
			}
		}

		&:active {
			transform: scale(0.98);
		}
	}

	.loading-container,
	.error-container,
	.empty-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 50px 0;
	}

	.error-text,
	.empty-text {
		font-size: 15px;
		color: #666;
		margin-bottom: 10px;
	}

	.retry-btn {
		padding: 5px 15px;
		background-color: #ff6b6b;
		color: #fff;
		border-radius: 4px;
		font-size: 14px;
		border: none;
	}
</style>