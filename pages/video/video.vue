<template>
	<view class="movie-detail">
		<!-- 合并播放器和header区域 -->
		<view class="header-player-container">
			<!-- 头部区域：海报及基本信息 -->
			<view class="header" :class="{'header-hidden': isPlayerVisible}">
				<view class="poster-blur">
					<image class="blur-image" :src="'https://image.tmdb.org/t/p/original' + (detail && detail.backdrop_path)" mode="aspectFill"></image>
				</view>
				<view class="header-content">
					<view class="poster-container">
						<view class="movie-poster">
							<image class="poster-image" :src="'https://image.tmdb.org/t/p/original' + (detail && detail.poster_path)" mode="aspectFill"></image>
							<!-- 添加播放按钮 -->
							<view class="play-button" @tap="togglePlayer">
								<text class="play-icon">▶</text>
							</view>
							<view class="movie-types">
								<text v-for="(tag, index) in detail && detail.genres && detail.genres.slice(0, 3)" :key="index">{{ tag.name }}</text>
							</view>
						</view>
						<view class="movie-tag" v-if="detail && detail.quality">
							<text>{{ detail.quality || 'HD' }}</text>
						</view>
					</view>
					<view class="movie-basic-info">
						<view class="movie-title">
							<text>{{ detail && detail.title }}</text>
						</view>
						<view class="movie-original-title" v-if="detail && detail.original_title">
							<text>{{ detail.original_title }}</text>
						</view>
						<view class="movie-meta">
							<text>{{ detail && detail.release_date && detail.release_date.substring(0, 4) || '' }} / </text>
							<text>{{ detail && detail.origin_country && detail.origin_country.join(' ') || '' }} / </text>
							<text>{{ detail && detail.runtime || 0 }}分钟</text>
						</view>
						<view class="rating-box">
							<view class="rating-star">
								<text class="rating-score">{{ detail && detail.vote_average }}</text>
								<view class="star-container">
									<!-- 生成星星评分图标 -->
									<text v-for="i in 5" :key="i" class="star"
										:class="i <= Math.floor(detail && detail.vote_average/2) ? 'star-full' : (i-0.5 <= detail && detail.vote_average/2 ? 'star-half' : 'star-empty')">
										★
									</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 播放器区域 -->
			<view class="player-container" :class="{'player-visible': isPlayerVisible}">
				<!-- #ifdef APP-PLUS-ANDROID -->
				<!-- 安卓平台使用自定义播放器 -->
				<myvideo :video_url="video_url" :title="detail && detail.title || videoTitle || '视频播放'" ref="myvideo"></myvideo>
				<!-- #endif -->

				<!-- #ifndef APP-PLUS -->
				<!-- 非安卓平台使用播放器 -->
				<video id="video-player" :src="video_url" :title="detail && detail.title || videoTitle || '视频播放'"
					:poster="videoPoster" controls autoplay class="video-player" object-fit="contain"
					@fullscreenchange="fullscreenChange" @timeupdate="onTimeUpdate" @ended="onVideoEnded"
					enable-progress-gesture show-progress show-fullscreen-btn show-play-btn show-center-play-btn></video>
				<!-- #endif -->
				
				<!-- 返回到详情按钮 -->
				<view class="back-to-detail" @tap="togglePlayer">
					<text class="back-icon">✕</text>
				</view>
			</view>

			<!-- 错误提示 -->
			<view class="video-error-container" v-if="loadError">
				<text class="error-icon">&#xe605;</text>
				<text class="error-text">{{ errorInfo }}</text>
			</view>
		</view>

		<!-- 有mid字段的视频显示详细UI -->
		<view v-if="hasMid && detail">
			<!-- 快捷操作区域 -->
			<view class="action-bar">
				<view class="action-item" @tap="toggleCollect">
					<view class="action-icon" :class="{'action-active': isCollected}">
						<text class="iconfont">{{ isCollected ? '♥' : '♡' }}</text>
					</view>
					<text class="action-text">想看</text>
				</view>
				<view class="action-item" @tap="toggleSeen">
					<view class="action-icon" :class="{'action-active': isSeen}">
						<text class="iconfont">✓</text>
					</view>
					<text class="action-text">看过</text>
				</view>
				<view class="action-item">
					<view class="action-icon">
						<text class="iconfont">★</text>
					</view>
					<text class="action-text">评分</text>
				</view>
				<view class="action-item" @tap="togglePlayer">
					<view class="action-icon">
						<text class="iconfont">▶</text>
					</view>
					<text class="action-text">播放</text>
				</view>
			</view>
			
			<!-- 演职员表区域 -->
			<view class="content-section cast-crew">
				<view class="section-header">
					<text class="section-title">演职员</text>
					<text class="more-btn">全部 ></text>
				</view>
			
				<!-- 演员部分 -->
				<scroll-view class="cast-scroll" scroll-x="true" show-scrollbar="false">
					<view class="cast-list">
						<view class="cast-item" v-for="(actor, index) in detail.credits && detail.credits.cast && detail.credits.cast.slice(0,10) || []" :key="index">
							<view class="cast-avatar">
								<image class="avatar-image" :src="'https://image.tmdb.org/t/p/original'+actor.profile_path" mode="aspectFill"></image>
							</view>
							<view class="cast-info">
								<text class="cast-name">{{ actor.name }}</text>
								<text class="cast-role">{{ actor.character }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 剧情简介区域 -->
			<view class="content-section plot-summary">
				<view class="section-header">
					<text class="section-title">剧情简介</text>
				</view>
				<view class="summary-content" :class="{'expanded': isExpanded}">
					<text>{{ detail.overview }}</text>
				</view>
				<view class="expand-btn" @tap="toggleExpand">
					<text>{{ isExpanded ? '收起' : '展开' }}</text>
					<text class="expand-icon">{{ isExpanded ? '↑' : '↓' }}</text>
				</view>
			</view>

			<!-- 相关推荐区域 -->
			<view class="content-section recommend-section">
				<view class="section-header">
					<text class="section-title">相关推荐</text>
				</view>
				<scroll-view class="recommend-scroll" scroll-x="true" show-scrollbar="false">
					<view class="recommend-list">
						<view class="recommend-item" v-for="(movie, index) in detail.recommendations && detail.recommendations.results && detail.recommendations.results.slice(0,10) || []" :key="index">
							<view class="recommend-poster">
								<image class="poster-image" :src="'https://image.tmdb.org/t/p/original'+movie.poster_path" mode="aspectFill"></image>
							</view>
							<view class="recommend-info">
								<text class="recommend-title">{{ movie.title }}</text>
								<text class="recommend-rating">{{ movie.vote_average }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- 普通视频(没有mid字段)显示简单信息 -->
		<view v-else class="video-info-container">
			<view class="video-title-box">
				<text class="video-title">{{ detail && detail.title || videoTitle || '视频播放' }}</text>
			</view>

			<view class="video-meta">
				<view class="meta-item">
					<text class="meta-label">下载时间:</text>
					<text class="meta-value">{{ downloadTime }}</text>
				</view>

				<view class="meta-item">
					<text class="meta-label">文件大小:</text>
					<text class="meta-value">{{ fileSize }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		MEDIA_URL
	} from '@/static/api/index.js';
	import {
		youtubeApi
	} from '@/static/api/index.js';
	import fIconBtn from '../../components/myvideo/components/f-icon-btn.vue';
	// 使用条件编译导入组件
	// #ifdef APP-PLUS-ANDROID
	import myvideo from '@/components/myvideo/myvideo.vue';
	// #endif
	import {
		getDetail
	} from '@/static/api/other';

	export default {
		computed: {
			score() {
				return this.detail && this.detail.vote_average ? this.detail.vote_average.toFixed(1) : '0.0';
			},
			// 判断是否有mid字段
			hasMid() {
				return !!this.mid;
			}
		},
		components: {
			// 使用条件编译注册组件
			// #ifdef APP-PLUS-ANDROID
			myvideo,
			// #endif
			fIconBtn
		},
		onLoad(options) {
			console.log('接收到播放参数:', options);
			
			// 处理video_url
			if (options.video_url) {
				try {
					this.video_url = decodeURIComponent(options.video_url);
					console.log('设置视频URL:', this.video_url);
					
					// 检查URL是否为相对路径或本地路径，需要进行转换
					if (this.video_url.startsWith('C:\\') || this.video_url.startsWith('/')) {
						// 尝试将Windows路径转换为网络路径
						this.video_url = this.video_url.replace(/\\/g, '/');
						
						// 安全地获取文件名
						let fileName = '';
						if (this.video_url && typeof this.video_url === 'string') {
							const parts = this.video_url.split('/');
							if (parts && parts.length > 0) {
								fileName = parts[parts.length - 1] || '';
							}
						}
						
						if (fileName) {
							if (this.video_url.includes('/media/youtube_videos/')) {
								// 从路径中提取media部分起的路径
								const mediaIndex = this.video_url.indexOf('/media/');
								if (mediaIndex !== -1) {
									const mediaPath = this.video_url.substring(mediaIndex);
									this.video_url = MEDIA_URL + mediaPath;
								} else {
									this.video_url = MEDIA_URL + '/media/youtube_videos/' + fileName;
								}
							} else {
								this.video_url = MEDIA_URL + '/media/youtube_videos/' + fileName;
							}
						}
						console.log('转换后的视频URL:', this.video_url);
					}
					
					// 确保视频URL没有重复的基础URL
					if (this.video_url.includes(MEDIA_URL + MEDIA_URL) || this.video_url.includes(MEDIA_URL + '/' + MEDIA_URL)) {
						this.video_url = this.video_url.replace(MEDIA_URL + '/' + MEDIA_URL, MEDIA_URL);
						this.video_url = this.video_url.replace(MEDIA_URL + MEDIA_URL, MEDIA_URL);
					}
					
					console.log('最终处理后的视频URL:', this.video_url);
					
					// 添加调试log，验证最终URL是否为媒体URL
					setTimeout(() => {
						const videoElement = document.getElementById('video-player');
						if (videoElement) {
							console.log('实际加载到video元素的src:', videoElement.src);
							// 如果src属性不正确，手动设置
							if (videoElement.src !== this.video_url) {
								console.log('检测到URL不匹配，手动设置video.src');
								videoElement.src = this.video_url;
							}
						}
					}, 500);
				} catch (e) {
					console.error('处理视频URL时出错:', e);
					this.video_url = options.video_url;
				}
			}

			// 处理视频ID
			if (options.video_id) {
				this.videoId = options.video_id;
				console.log('获取到视频ID:', this.videoId);
			}

			// 处理mid字段
			if (options.id) {
				this.mid = options.id;
				this.getDetail(options.id);
			}

			// 其他信息处理
			if (options.title) {
				try {
					this.videoTitle = decodeURIComponent(options.title) || '未命名视频';
				} catch (e) {
					this.videoTitle = options.title || '未命名视频';
				}
			}

			if (options.poster) {
				try {
					this.videoPoster = decodeURIComponent(options.poster);
				} catch (e) {
					this.videoPoster = options.poster;
				}
			}

			if (options.description) {
				try {
					this.videoDescription = decodeURIComponent(options.description);
				} catch (e) {
					this.videoDescription = options.description || '';
				}
			}

			if (options.download_time) {
				try {
					this.downloadTime = decodeURIComponent(options.download_time);
				} catch (e) {
					this.downloadTime = options.download_time || '-';
				}
			}

			if (options.file_size) {
				try {
					this.fileSize = decodeURIComponent(options.file_size);
				} catch (e) {
					this.fileSize = options.file_size || '-';
				}
			}

			// 创建视频上下文
			this.createVideoContext();
		},
		onShow() {
			// 确保视频上下文在页面显示时被正确初始化
			if (!this.videoContext) {
				this.createVideoContext();
			}
		},
		data() {
			return {
				video_url: '',
				videoId: null,
				videoTitle: '',
				videoPoster: '',
				videoDescription: '',
				downloadTime: '-',
				fileSize: '-',
				videoContext: null,
				currentTime: 0,
				duration: 0,
				isPlaying: false,
				loadError: false,
				errorInfo: '',
				mid: '',
				detail: null,
				isCollected: false,
				isSeen: false,
				isExpanded: false,
				isPlayerVisible: false
			};
		},
		methods: {
			// 获取详细信息
			getDetail(mid) {
				getDetail(mid).then((resp) => {
					this.detail = resp.data.data;
				}).catch(err => {
					this.detail = null;
				});
			},

			// 创建视频上下文
			createVideoContext() {
				// #ifndef APP-PLUS-ANDROID
				// 非安卓平台创建视频上下文
				try {
					setTimeout(() => {
						this.videoContext = uni.createVideoContext('video-player', this);
						console.log('视频上下文创建成功');
					}, 300);
				} catch (e) {
					console.error('创建视频上下文失败:', e);
				}
				// #endif
			},

			// 处理全屏状态变化
			fullscreenChange(e) {},

			// 处理视频时间更新
			onTimeUpdate(e) {
				if (e.detail) {
					this.currentTime = e.detail.currentTime || 0;
					this.duration = e.detail.duration || 0;
				}

				// 每30秒保存播放进度
				if (Math.floor(this.currentTime) % 30 === 0 && this.currentTime > 0) {
					this.savePlaybackProgress();
				}
			},

			// 保存播放进度
			savePlaybackProgress() {
				if (this.currentTime <= 0 || this.duration <= 0) return;

				const progress = {
					url: this.video_url,
					title: this.videoTitle || (this.detail && this.detail.title) || '',
					currentTime: this.currentTime,
					duration: this.duration,
					timestamp: new Date().getTime()
				};

				try {
					let history = uni.getStorageSync('videoPlaybackHistory') || '[]';
					let historyArray = JSON.parse(history);

					const existingIndex = historyArray.findIndex(item => item.url === this.video_url);
					if (existingIndex !== -1) {
						historyArray[existingIndex] = progress;
					} else {
						historyArray.push(progress);
						if (historyArray.length > 50) {
							historyArray = historyArray.slice(-50);
						}
					}

					uni.setStorageSync('videoPlaybackHistory', JSON.stringify(historyArray));
				} catch (e) {}
			},

			// 视频播放结束
			onVideoEnded() {
				this.savePlaybackProgress();
			},
			
			// 尝试使用备用URL
			tryBackupUrl() {
				if (this.videoId) {
					uni.showLoading({
						title: '正在尝试备用播放源...'
					});

					youtubeApi.getDownloadDetail(this.videoId)
						.then(response => {
							uni.hideLoading();
							if (response.data && (response.data.media_url || response.data.download_path)) {
								// 使用备用URL
								const backupUrl = response.data.media_url || response.data.download_path;

								// 更新视频URL并重新加载
								this.video_url = backupUrl;
								this.loadError = false;
								this.errorInfo = '';

								// 重新加载播放器
								setTimeout(() => {
									if (this.videoContext) {
										this.videoContext.stop();
										this.videoContext.play();
									}
								}, 500);

								uni.showToast({
									title: '正在使用备用播放源',
									icon: 'none',
									duration: 2000
								});
							} else {
								this.showTrySystemPlayerDialog();
							}
						})
						.catch(err => {
							uni.hideLoading();
							this.showTrySystemPlayerDialog();
						});
				} else {
					this.showTrySystemPlayerDialog();
				}
			},

			// 显示尝试系统播放器对话框
			showTrySystemPlayerDialog() {
				uni.showToast({
					title: this.errorInfo,
					icon: 'none',
					duration: 3000
				});

				// #ifdef APP-PLUS
				uni.showModal({
					title: '播放失败',
					content: '是否尝试使用系统播放器打开此视频？',
					confirmText: '打开',
					success: (res) => {
						if (res.confirm) {
							plus.runtime.openFile(this.video_url, {}, (err) => {
								if (err) {
									uni.showToast({
										title: '无法打开系统播放器: ' + err.message,
										icon: 'none'
									});
								}
							});
						}
					}
				});
				// #endif
			},

			// 从detail.vue添加的方法
			toggleExpand() {
				this.isExpanded = !this.isExpanded;
			},
			
			toggleCollect() {
				this.isCollected = !this.isCollected;
				uni.showToast({
					title: this.isCollected ? '已添加到想看' : '已从想看移除',
					icon: 'none'
				});
			},
			
			toggleSeen() {
				this.isSeen = !this.isSeen;
				uni.showToast({
					title: this.isSeen ? '已标记为看过' : '已取消看过标记',
					icon: 'none'
				});
			},

			togglePlayer() {
				this.isPlayerVisible = !this.isPlayerVisible;
				
				// 处理播放器
				setTimeout(() => {
					if (this.isPlayerVisible) {
						// 显示播放器并开始播放
						// #ifdef APP-PLUS-ANDROID
						if (this.$refs.myvideo) {
							this.$refs.myvideo.play();
						}
						// #endif
						
						// #ifndef APP-PLUS-ANDROID
						if (this.videoContext) {
							this.videoContext.play();
						}
						// #endif
					} else {
						// 隐藏播放器并暂停播放
						// #ifdef APP-PLUS-ANDROID
						if (this.$refs.myvideo) {
							this.$refs.myvideo.pause();
						}
						// #endif
						
						// #ifndef APP-PLUS-ANDROID
						if (this.videoContext) {
							this.videoContext.pause();
						}
						// #endif
					}
				}, 50);
			}
		}
	}
</script>

<style>
	/* #ifndef APP-PLUS-ANDROID */
	.video-container {
		width: 100%;
		height: 225px;
		background-color: #000;
		position: relative;
	}

	.video-player {
		width: 100%;
		height: 100%;
	}
	/* #endif */

	/* 整体页面样式 */
	.movie-detail {
		background-color: #f7f7f7;
		position: relative;
		padding-bottom: 70px;
	}

	/* 头部播放器容器 */
	.header-player-container {
		position: relative;
		overflow: hidden;
		height: 250px; /* 根据需要调整高度 */
	}

	/* 头部区域样式 */
	.header {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #000;
		z-index: 10;
		transition: all 0.5s ease-in-out;
		opacity: 1;
	}

	.header-hidden {
		opacity: 0;
		transform: translateY(-100%);
		z-index: 1;
	}

	/* 播放器容器 */
	.player-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #000;
		z-index: 1;
		opacity: 0;
		transform: translateY(100%);
		transition: all 0.5s ease-in-out;
	}

	.player-visible {
		opacity: 1;
		transform: translateY(0);
		z-index: 11;
	}

	/* 返回到详情按钮 */
	.back-to-detail {
		position: absolute;
		top: 15px;
		right: 15px;
		width: 36px;
		height: 36px;
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 12;
		cursor: pointer;
	}

	.back-icon {
		color: #fff;
		font-size: 16px;
	}

	/* 海报中间的播放按钮 */
	.play-button {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 60px;
		height: 60px;
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 3;
		cursor: pointer;
		border: 2px solid rgba(255, 255, 255, 0.8);
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.movie-poster:hover .play-button {
		opacity: 1;
	}

	.play-icon {
		color: #fff;
		font-size: 28px;
	}

	.poster-blur {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0.7;
		z-index: 1;
		overflow: hidden;
	}

	.blur-image {
		width: 100%;
		height: 100%;
		filter: blur(20px);
		transform: scale(1.2);
		object-fit: cover;
	}

	.header-content {
		position: relative;
		z-index: 2;
		padding: 50px 15px 10px;
		display: flex;
	}

	.back-btn {
		position: absolute;
		top: 15px;
		left: 15px;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.3);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.back-btn .iconfont {
		color: #fff;
		font-size: 20px;
	}

	.poster-container {
		position: relative;
		margin-right: 15px;
		flex-shrink: 0;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
	}

	.movie-poster {
		width: 120px;
		height: 180px;
		border-radius: 8px;
		position: relative;
		overflow: hidden;
	}

	.poster-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.movie-types {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
		padding: 6px 5px 5px;
		display: flex;
		flex-wrap: wrap;
	}

	.movie-types text {
		color: #fff;
		font-size: 10px;
		margin-right: 3px;
		margin-bottom: 3px;
		background-color: rgba(255, 255, 255, 0.2);
		padding: 1px 4px;
		border-radius: 3px;
	}

	.movie-tag {
		position: absolute;
		right: 5px;
		top: 5px;
		background-color: rgba(0, 0, 0, 0.6);
		padding: 2px 6px;
		border-radius: 4px;
	}

	.movie-tag text {
		color: #fff;
		font-size: 10px;
		font-weight: bold;
	}

	.movie-basic-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.movie-title {
		margin-bottom: 4px;
	}

	.movie-title text {
		color: #fff;
		font-size: 22px;
		font-weight: bold;
		line-height: 1.3;
	}

	.movie-original-title {
		margin-bottom: 8px;
	}

	.movie-original-title text {
		color: rgba(255, 255, 255, 0.7);
		font-size: 16px;
	}

	.movie-meta {
		margin-bottom: 12px;
	}

	.movie-meta text {
		color: rgba(255, 255, 255, 0.6);
		font-size: 13px;
	}

	.rating-box {
		margin-top: 10px;
	}

	.rating-star {
		display: flex;
		align-items: center;
		margin-bottom: 4px;
	}

	.rating-score {
		color: #ffac2d;
		font-size: 22px;
		font-weight: bold;
		margin-right: 8px;
	}

	.star-container {
		display: flex;
	}

	.star {
		color: #ccc;
		font-size: 16px;
		margin-right: 2px;
	}

	.star-full {
		color: #ffac2d;
	}

	.star-half {
		color: #ffac2d;
	}

	.star-empty {
		color: rgba(255, 255, 255, 0.3);
	}

	.rating-count {
		color: rgba(255, 255, 255, 0.5);
		font-size: 12px;
	}

	/* 快捷操作区域 */
	.action-bar {
		display: flex;
		background-color: #fff;
		padding: 15px 10px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
	}

	.action-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.action-icon {
		width: 40px;
		height: 40px;
		background-color: #f0f0f0;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 5px;
	}

	.action-icon .iconfont {
		font-size: 22px;
		color: #666;
	}

	.action-active {
		background-color: #ffe4e1;
	}

	.action-active .iconfont {
		color: #ff4e66;
	}

	.action-text {
		font-size: 12px;
		color: #666;
	}

	/* 内容区域通用样式 */
	.content-section {
		background-color: #fff;
		margin-top: 10px;
		padding: 15px;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
	}

	.section-title {
		color: #333;
		font-size: 18px;
		font-weight: bold;
	}

	.more-btn {
		color: #4b8ccb;
		font-size: 14px;
	}

	/* 剧情简介区域 */
	.summary-content {
		max-height: 95px;
		overflow: hidden;
		transition: max-height 0.3s;
	}

	.summary-content.expanded {
		max-height: 1000px;
	}

	.summary-content text {
		font-size: 14px;
		color: #666;
		line-height: 1.6;
	}

	.expand-btn {
		margin-top: 8px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.expand-btn text {
		color: #4b8ccb;
		font-size: 14px;
	}

	.expand-icon {
		margin-left: 4px;
	}

	/* 演职员表区域 */
	.cast-scroll {
		white-space: nowrap;
	}

	.cast-list {
		display: flex;
	}

	.cast-item {
		margin-right: 12px;
		width: 80px;
	}

	.cast-avatar {
		width: 80px;
		height: 80px;
		border-radius: 5px;
		margin-bottom: 5px;
		overflow: hidden;
	}

	.avatar-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.cast-info {
		width: 100%;
	}

	.cast-name {
		font-size: 13px;
		color: #333;
		font-weight: bold;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;
	}

	.cast-role {
		font-size: 12px;
		color: #999;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;
	}

	/* 相关推荐区域 */
	.recommend-scroll {
		white-space: nowrap;
	}

	.recommend-list {
		display: flex;
	}

	.recommend-item {
		margin-right: 10px;
		width: 100px;
	}

	.recommend-poster {
		width: 100px;
		height: 150px;
		border-radius: 4px;
		margin-bottom: 5px;
		overflow: hidden;
	}

	.recommend-info {
		width: 100%;
	}

	.recommend-title {
		font-size: 13px;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;
	}

	.recommend-rating {
		font-size: 12px;
		color: #ffac2d;
	}

	/* 原视频页面的样式 */
	.video-info-container {
		flex: 1;
		padding: 15px;
		overflow-y: auto;
	}

	.video-title-box {
		margin-bottom: 20px;
	}

	.video-title {
		font-size: 18px;
		font-weight: bold;
		line-height: 1.4;
	}

	.video-meta {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 20px;
		padding: 10px 15px;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.meta-item {
		flex: 1;
		min-width: 50%;
		margin-bottom: 8px;
	}

	.meta-label {
		font-size: 14px;
		color: #666;
		margin-right: 5px;
	}

	.meta-value {
		font-size: 14px;
		color: #333;
		font-weight: 500;
	}

	/* 添加错误提示样式 */
	.video-error-container {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		z-index: 999;
	}

	.error-icon {
		font-size: 40px;
		color: #dd4b39;
		margin-bottom: 10px;
	}

	.error-text {
		color: #fff;
		text-align: center;
		padding: 0 20px;
	}

	.text-style {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 5;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
		letter-spacing: 2.5px;
		line-height: 1.5;
	}

	/* 页面滚动条隐藏 */
	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
	}
</style>