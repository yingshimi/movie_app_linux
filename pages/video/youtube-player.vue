<template>
	<view class="yt-player-container">
		<view class="video-container">
			<video id="video-player"
				 :src="videoUrl" 
				 :title="videoTitle"
				 :poster="videoPoster"
				 controls 
				 autoplay
				 class="video-player" 
				 object-fit="contain"
				 @error="handleError"
				 @fullscreenchange="fullscreenChange"
				 @timeupdate="onTimeUpdate"
				 @ended="onVideoEnded"
				 enable-progress-gesture
				 show-progress
				 show-fullscreen-btn
				 show-play-btn
				 show-center-play-btn
			></video>
		</view>
		
		<view class="video-info-container">
			<view class="video-title-box">
				<text class="video-title">{{ videoTitle || '视频播放' }}</text>
			</view>
			
			<!-- 视频控制按钮 -->
			<view class="video-controls">
				<view class="control-btn" @click="playPrev" v-if="hasPlaylist">
					<text class="btn-icon">&#xe600;</text>
					<text class="btn-text">上一个</text>
				</view>
				
				<view class="control-btn primary" @click="playVideo">
					<text class="btn-icon">&#xe601;</text>
					<text class="btn-text">播放</text>
				</view>
				
				<view class="control-btn" @click="playNext" v-if="hasPlaylist">
					<text class="btn-icon">&#xe602;</text>
					<text class="btn-text">下一个</text>
				</view>
				
				<view class="control-btn" @click="showDownloadOptions">
					<text class="btn-icon">&#xe603;</text>
					<text class="btn-text">下载</text>
				</view>
				
				<view class="control-btn" @click="goBack">
					<text class="btn-icon">&#xe604;</text>
					<text class="btn-text">返回</text>
				</view>
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
			
			<!-- 下载选项弹窗 -->
			<view class="format-popup" v-if="showFormatOptions">
				<view class="format-popup-mask" @click="showFormatOptions = false"></view>
				<view class="format-popup-content">
					<view class="format-popup-header">
						<text class="format-popup-title">选择下载格式</text>
						<text class="format-popup-close" @click="showFormatOptions = false">×</text>
					</view>
					
					<scroll-view scroll-y="true" class="format-options-list">
						<view class="format-option" v-for="(format, index) in downloadFormats" :key="index" @click="downloadWithFormat(format)">
							<view class="format-option-info">
								<text class="format-name">{{format.name}}</text>
								<text class="format-details">{{format.details}}</text>
							</view>
							<text class="format-size">{{format.size || '未知'}}</text>
						</view>
					</scroll-view>
					
					<view class="format-popup-footer">
						<button class="format-cancel-btn" @click="showFormatOptions = false">取消</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { MEDIA_URL } from '@/static/api/index.js';
	import { youtubeApi } from '@/static/api/index.js';
	
	export default {
		data() {
			return {
				videoUrl: '',
				videoTitle: '',
				videoPoster: '',
				videoDescription: '',
				downloadTime: '-',
				fileSize: '-',
				videoContext: null,
				hasPlaylist: false,
				currentVideo: null,
				videoList: [],
				loadError: false,
				errorInfo: '',
				currentTime: 0,
				duration: 0,
				isPlaying: false,
				videoId: null,
				showFormatOptions: false,
				downloadFormats: [
					{ name: '最佳质量', details: '最高分辨率 MP4', size: '根据视频', value: 'best' },
					{ name: '仅音频', details: 'MP3 音频文件', size: '约 8MB', value: 'audio_only' },
					{ name: '带字幕', details: '包含中文和英文字幕', size: '根据视频', value: 'with_subtitle' },
					{ name: '高清(720p)', details: '720p MP4 视频', size: '约 100MB', value: 'mp4_720p' },
					{ name: '标清(480p)', details: '480p MP4 视频', size: '约 50MB', value: 'mp4_480p' }
				],
				youtubeUrl: '',
				// 如果来自已下载视频，尝试提取原始YouTube链接
				originalYoutubeUrl: ''
			}
		},
		onLoad(options) {
			console.log('接收到播放参数:', options);
			
			// 保存视频ID
			if (options.video_id) {
				this.videoId = options.video_id;
				console.log('获取到视频ID:', this.videoId);
				
				// 使用视频ID构建专用流媒体URL
				const streamUrl = youtubeApi.getVideoStreamUrl(this.videoId);
				console.log('使用专用流媒体URL:', streamUrl);
				
				// 如果有专用流媒体URL，优先使用
				if (streamUrl) {
					options.video_url = streamUrl;
				}
				
				// 获取视频详情，包括原始YouTube链接
				this.getVideoDetails(this.videoId);
			}
			
			// 处理URL参数
			if (options.video_url) {
				// 解码并确保URL格式正确
				let url = decodeURIComponent(options.video_url);
				
				// 检查是否是流媒体URL
				if (url.includes('stream=true')) {
					// 流媒体URL，直接使用
					console.log('使用流媒体URL:', url);
				}
				// 检查URL是否为相对路径或本地路径
				else if(url.startsWith('C:\\') || url.startsWith('/')) {
					// 如果是本地服务器路径，使用media_url代替
					if(options.media_url) {
						url = decodeURIComponent(options.media_url);
						console.log('使用media_url代替本地路径');
					} else {
						// 尝试将Windows路径转换为网络路径
						url = url.replace(/\\/g, '/');
						if (url.includes('/media/youtube_videos/')) {
							// 已经是相对正确的路径格式
							url = MEDIA_URL + url;
						} else {
							url = MEDIA_URL + '/media/youtube_videos/' + url.split('/').pop();
						}
						console.log('转换本地路径为网络路径:', url);
					}
				}
				
				// 确保URL是完整的HTTP链接
				if(!url.startsWith('http')) {
					if(url.startsWith('/')) {
						url = MEDIA_URL + url;
					} else {
						url = MEDIA_URL + '/' + url;
					}
				}
				
				this.videoUrl = url;
				console.log('最终视频URL:', this.videoUrl);
			}
			
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
			
			// 如果有原始YouTube URL，保存它
			if (options.youtube_url) {
				try {
					this.youtubeUrl = decodeURIComponent(options.youtube_url);
				} catch (e) {
					this.youtubeUrl = options.youtube_url;
				}
			}
			
			// 检查是否有视频列表
			if (options.list_id) {
				// TODO: 根据list_id加载视频列表
				this.hasPlaylist = true;
			}
			
			// 创建视频上下文
			this.createVideoContext();
			
			// 尝试恢复播放进度
			this.checkPlaybackProgress();
		},
		onReady() {
			this.createVideoContext();
		},
		methods: {
			// 获取视频详情
			getVideoDetails(videoId) {
				if(!videoId) return;
				
				youtubeApi.getDownloadDetail(videoId)
					.then(response => {
						console.log('获取视频详情成功:', response);
						if(response.data && response.data.url) {
							this.youtubeUrl = response.data.url;
						}
					})
					.catch(error => {
						console.error('获取视频详情失败:', error);
					});
			},
			
			createVideoContext() {
				// 创建视频上下文
				this.videoContext = uni.createVideoContext('video-player', this);
			},
			
			// 显示下载选项
			showDownloadOptions() {
				if (!this.videoId && !this.youtubeUrl) {
					uni.showToast({
						title: '无法获取此视频的下载信息',
						icon: 'none'
					});
					return;
				}
				
				// 显示下载格式选项
				this.showFormatOptions = true;
			},
			
			// 使用选定格式下载视频
			downloadWithFormat(format) {
				// 关闭格式选择弹窗
				this.showFormatOptions = false;
				
				if (!this.youtubeUrl && !this.videoId) {
					uni.showToast({
						title: '缺少YouTube视频链接',
						icon: 'none'
					});
					return;
				}
				
				// 准备下载参数
				const downloadParams = {
					url: this.youtubeUrl,
					format_type: format.value,
					title: this.videoTitle
				};
				
				// 如果有视频ID但没有URL，走重试下载路径
				if (!this.youtubeUrl && this.videoId) {
					this.retryDownloadWithFormat(format);
					return;
				}
				
				// 显示加载提示
				uni.showLoading({
					title: '正在准备下载...'
				});
				
				// 调用API创建下载任务
				youtubeApi.createDownloadTask(downloadParams)
					.then(response => {
						uni.hideLoading();
						console.log('创建下载任务成功:', response);
						
						uni.showToast({
							title: '下载任务已创建',
							icon: 'success'
						});
						
						// 可以跳转到下载列表页
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/youtube/index'
							});
						}, 1500);
					})
					.catch(error => {
						uni.hideLoading();
						console.error('创建下载任务失败:', error);
						
						uni.showToast({
							title: error.userFriendlyMessage || '下载失败，请重试',
							icon: 'none',
							duration: 3000
						});
					});
			},
			
			// 重试下载，适用于已有视频ID的情况
			retryDownloadWithFormat(format) {
				if (!this.videoId) return;
				
				uni.showLoading({
					title: '正在准备下载...'
				});
				
				// 准备参数
				const params = {
					format_type: format.value
				};
				
				// 调用重试接口
				youtubeApi.retryDownload(this.videoId, params)
					.then(response => {
						uni.hideLoading();
						console.log('重试下载成功:', response);
						
						uni.showToast({
							title: '下载任务已创建',
							icon: 'success'
						});
						
						// 可以跳转到下载列表页
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/youtube/index'
							});
						}, 1500);
					})
					.catch(error => {
						uni.hideLoading();
						console.error('重试下载失败:', error);
						
						uni.showToast({
							title: error.userFriendlyMessage || '下载失败，请重试',
							icon: 'none',
							duration: 3000
						});
					});
			},
			
			// 重新下载
			downloadAgain() {
				this.showDownloadOptions();
			},
			
			// 尝试恢复播放进度
			checkPlaybackProgress() {
				if (!this.videoUrl) return;
				
				try {
					// 从本地存储中获取播放历史
					let history = uni.getStorageSync('videoPlaybackHistory') || '[]';
					let historyArray = JSON.parse(history);
					
					// 查找当前视频的播放记录
					const record = historyArray.find(item => item.url === this.videoUrl);
					if (record && record.currentTime && record.duration) {
						// 计算剩余时间，如果超过30秒则询问是否恢复播放
						const remainingTime = record.duration - record.currentTime;
						if (remainingTime > 30 && record.currentTime > 10) {
							this.currentTime = record.currentTime;
							
							// 询问用户是否从上次播放位置继续观看
							uni.showModal({
								title: '恢复播放',
								content: `是否从上次观看的位置继续播放？(${this.formatTime(record.currentTime)})`,
								confirmText: '继续',
								cancelText: '从头播放',
								success: (res) => {
									if (res.confirm) {
										// 从上次位置继续播放
										setTimeout(() => {
											if (this.videoContext) {
												console.log('恢复播放位置:', record.currentTime);
												this.videoContext.seek(record.currentTime);
											}
										}, 500);
									}
								}
							});
						}
					}
				} catch (e) {
					console.error('获取播放进度失败:', e);
				}
			},
			
			// 格式化时间
			formatTime(seconds) {
				if (!seconds) return '00:00';
				
				const min = Math.floor(seconds / 60);
				const sec = Math.floor(seconds % 60);
				return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
			},
			
			// 播放视频
			playVideo() {
				if (this.videoContext) {
					this.videoContext.play();
					this.isPlaying = true;
				}
			},
			
			// 暂停视频
			pauseVideo() {
				if (this.videoContext) {
					this.videoContext.pause();
					this.isPlaying = false;
				}
			},
			
			// 上一个视频
			playPrev() {
				if (!this.hasPlaylist) return;
				
				// TODO: 播放列表中的上一个视频
				uni.showToast({
					title: '播放上一个视频',
					icon: 'none'
				});
			},
			
			// 下一个视频
			playNext() {
				if (!this.hasPlaylist) return;
				
				// TODO: 播放列表中的下一个视频
				uni.showToast({
					title: '播放下一个视频',
					icon: 'none'
				});
			},
			
			// 返回
			goBack() {
				uni.navigateBack();
			},
			
			// 处理视频加载错误
			handleError(e) {
				console.error('视频加载错误:', e);
				this.loadError = true;
				let errorCode = '';
				
				if (e.detail && e.detail.errMsg) {
					errorCode = e.detail.errMsg;
				} else if (e.detail && e.detail.error) {
					errorCode = e.detail.error;
				}
				
				// 根据错误类型显示不同的错误信息
				if (errorCode.includes('NOT_FOUND') || errorCode.includes('404')) {
					this.errorInfo = '视频文件不存在，可能已被删除或移动。';
				} else if (errorCode.includes('NETWORK_ERROR') || errorCode.includes('FAILED_CONNECT')) {
					this.errorInfo = '网络连接问题，请检查您的网络连接并重试。';
				} else if (errorCode.includes('FORMAT_ERROR') || errorCode.includes('MEDIA_ERR_SRC_NOT_SUPPORTED')) {
					this.errorInfo = '不支持的视频格式，请尝试转换视频格式。';
				} else {
					this.errorInfo = '视频播放出错: ' + (errorCode || '未知错误');
				}
				
				// 显示错误提示对话框，替代自定义错误容器
				uni.showModal({
					title: '视频加载失败',
					content: this.errorInfo,
					confirmText: '尝试修复',
					cancelText: '返回',
					success: (res) => {
						if (res.confirm) {
							// 尝试修复视频播放
							this.tryFixVideo();
						} else {
							// 返回上一页
							uni.navigateBack();
						}
					}
				});
				
				// 如果是流媒体URL出错，尝试使用备用URL
				if (this.videoId && this.videoUrl.includes('stream_video')) {
					this.tryFixVideo();
				}
			},
			
			// 尝试修复视频播放问题
			tryFixVideo() {
				// 如果有视频ID且URL包含stream_video，尝试使用备用URL
				if (this.videoId && this.videoUrl.includes('stream_video')) {
					console.log('流媒体URL播放失败，尝试使用备用URL...');
					
					// 尝试获取视频详情，获取其他可用URL
					uni.showLoading({
						title: '正在尝试备用播放源...'
					});
					
					youtubeApi.getDownloadDetail(this.videoId)
						.then(response => {
							uni.hideLoading();
							if (response.data && (response.data.media_url || response.data.download_path)) {
								// 使用备用URL
								const backupUrl = response.data.media_url || response.data.download_path;
								console.log('找到备用URL:', backupUrl);
								
								// 更新视频URL并重新加载
								this.videoUrl = backupUrl;
								this.loadError = false;
								
								// 重新初始化播放器
								setTimeout(() => {
									if (this.videoContext) {
										this.videoContext.stop();
										this.videoContext.play();
									}
								}, 500);
								
								// 提示用户
								uni.showToast({
									title: '正在使用备用播放源',
									icon: 'none',
									duration: 2000
								});
							} else {
								// 没有找到备用URL，显示错误并提示尝试系统播放器
								this.trySystemPlayer();
							}
						})
						.catch(err => {
							uni.hideLoading();
							console.error('获取备用URL失败:', err);
							// 显示错误并提示尝试系统播放器
							this.trySystemPlayer();
						});
				} else {
					// 非流媒体URL或无视频ID，直接提示尝试系统播放器
					this.trySystemPlayer();
				}
			},
			
			// 尝试使用系统播放器
			trySystemPlayer() {
				// 展示错误信息
				uni.showToast({
					title: this.errorInfo,
					icon: 'none',
					duration: 3000
				});
				
				// 尝试使用系统播放器打开
				uni.showModal({
					title: '播放失败',
					content: '是否尝试使用系统播放器打开此视频？',
					confirmText: '打开',
					success: (res) => {
						if (res.confirm) {
							// 尝试使用系统默认应用打开
							plus.runtime.openFile(this.videoUrl, {}, (err) => {
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
			},
			
			// 处理全屏状态变化
			fullscreenChange(e) {
				console.log('全屏状态变化:', e);
				// 可以根据全屏状态变化做一些界面调整
			},
			
			// 处理视频时间更新
			onTimeUpdate(e) {
				if (e.detail) {
					this.currentTime = e.detail.currentTime || 0;
					this.duration = e.detail.duration || 0;
				}
				
				// 每隔30秒保存播放进度
				if (Math.floor(this.currentTime) % 30 === 0 && this.currentTime > 0) {
					this.savePlaybackProgress();
				}
			},
			
			// 保存视频播放进度
			savePlaybackProgress() {
				if (this.currentTime <= 0 || this.duration <= 0) return;
				
				const progress = {
					url: this.videoUrl,
					title: this.videoTitle,
					currentTime: this.currentTime,
					duration: this.duration,
					timestamp: new Date().getTime()
				};
				
				try {
					// 获取已有的播放历史
					let history = uni.getStorageSync('videoPlaybackHistory') || '[]';
					let historyArray = JSON.parse(history);
					
					// 检查是否已存在该视频的记录
					const existingIndex = historyArray.findIndex(item => item.url === this.videoUrl);
					if (existingIndex !== -1) {
						// 更新现有记录
						historyArray[existingIndex] = progress;
					} else {
						// 添加新记录
						historyArray.push(progress);
						// 限制历史记录数量
						if (historyArray.length > 50) {
							historyArray = historyArray.slice(-50);
						}
					}
					
					// 保存回本地存储
					uni.setStorageSync('videoPlaybackHistory', JSON.stringify(historyArray));
					console.log('已保存播放进度:', this.currentTime);
				} catch (e) {
					console.error('保存播放进度失败:', e);
				}
			},
			
			// 视频播放完成
			onVideoEnded() {
				console.log('视频播放完成');
				this.savePlaybackProgress();
				
				// 如果有播放列表，可以自动播放下一个
				if (this.hasPlaylist) {
					// 提示用户是否播放下一个
					uni.showModal({
						title: '视频播放完成',
						content: '是否播放下一个视频？',
						confirmText: '播放',
						success: (res) => {
							if (res.confirm) {
								this.playNext();
							}
						}
					});
				}
			}
		}
	}
</script>

<style>
	.yt-player-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100vh;
		background-color: #f5f5f5;
	}
	
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
	
	.video-controls {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20px;
		padding: 10px 0;
		border-bottom: 1px solid #eee;
	}
	
	.control-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10px;
	}
	
	.btn-icon {
		font-size: 24px;
		color: #666;
		font-family: "iconfont";
		margin-bottom: 5px;
	}
	
	.btn-text {
		font-size: 12px;
		color: #666;
	}
	
	.control-btn.primary .btn-icon,
	.control-btn.primary .btn-text {
		color: #dd4b39;
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
	
	.video-description {
		padding: 15px;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}
	
	.description-title {
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 10px;
		display: block;
	}
	
	.description-content {
		font-size: 14px;
		color: #333;
		line-height: 1.6;
	}
	
	.format-popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}
	
	.format-popup-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
	
	.format-popup-content {
		background-color: #fff;
		padding: 20px;
		border-radius: 10px;
		width: 80%;
		max-width: 400px;
	}
	
	.format-popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}
	
	.format-popup-title {
		font-size: 18px;
		font-weight: bold;
	}
	
	.format-popup-close {
		font-size: 24px;
		color: #666;
		cursor: pointer;
	}
	
	.format-options-list {
		max-height: 200px;
		overflow-y: auto;
	}
	
	.format-option {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		border-bottom: 1px solid #eee;
		cursor: pointer;
	}
	
	.format-option:last-child {
		border-bottom: none;
	}
	
	.format-option-info {
		flex: 1;
	}
	
	.format-name {
		font-size: 16px;
		font-weight: bold;
	}
	
	.format-details {
		font-size: 14px;
		color: #666;
	}
	
	.format-size {
		font-size: 14px;
		color: #333;
	}
	
	.format-popup-footer {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}
	
	.format-cancel-btn {
		padding: 10px 20px;
		background-color: #dd4b39;
		color: #fff;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}
</style> 