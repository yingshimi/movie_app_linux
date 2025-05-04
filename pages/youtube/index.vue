<template>
	<view class="youtube-container">
		<view class="h-carousel">
			<view class="header">
				<text class="page-title">YouTube下载</text>
				<view class="cookie-status" :class="cookieStatus ? 'cookie-valid' : 'cookie-invalid'"
					@click="showCookieOptions">
					<text>Cookie {{cookieStatus ? '有效' : '无效'}}</text>
				</view>
			</view>
			<image class="h-wave1" src="@/static/images/wave1.png" mode="aspectFill"></image>
			<image class="h-wave2" src="@/static/images/wave2.png" mode="aspectFill"></image>
		</view>

		<view class="content">
			<!-- 视频URL输入 -->
			<view class="url-input-container">
				<input class="url-input" type="text" v-model="videoUrl" placeholder="输入YouTube视频链接" />
				<button class="fetch-button" @click="getVideoInfo">获取信息</button>
			</view>

			<!-- Cookie管理 -->
			<view class="cookie-manager" v-if="showCookieManager">
				<view class="section-header">
					<text class="section-title">Cookie管理</text>
					<text class="section-close" @click="showCookieManager = false">×</text>
				</view>

				<view class="cookie-info">
					<text class="cookie-info-text">Cookie状态: <text
							:class="cookieStatus ? 'text-success' : 'text-danger'">{{cookieStatus ? '有效' : '无效'}}</text></text>
					<text
						class="cookie-info-text small">{{cookieTestVideo ? `测试视频: ${cookieTestVideo.title}` : ''}}</text>
				</view>

				<view class="cookie-actions">
					<button class="cookie-btn" @click="checkCookieStatus">检查状态</button>
					<button class="cookie-btn" @click="uploadCookieFile">上传Cookie</button>
					<button class="cookie-btn" @click="showBrowserSelect = true">从浏览器获取</button>
				</view>

				<!-- 浏览器选择 -->
				<view class="browser-select" v-if="showBrowserSelect">
					<text class="browser-select-title">选择浏览器</text>
					<view class="browser-options">
						<view class="browser-option" v-for="(browser, index) in browserOptions" :key="index"
							@click="exportBrowserCookies(browser.value)">
							<text class="browser-icon">{{browser.icon}}</text>
							<text class="browser-name">{{browser.label}}</text>
						</view>
					</view>
					<text class="browser-note">注意: 只有当服务端与浏览器在同一台电脑上时才有效</text>
				</view>
			</view>

			<!-- 视频信息展示 -->
			<view class="video-info" v-if="videoInfo">
				<view class="info-card">
					<view class="thumbnail">
						<image :src="videoInfo.thumbnail" mode="aspectFill"></image>
					</view>
					<view class="info-details">
						<text class="video-title">{{videoInfo.title || ''}}</text>
						<text class="video-uploader">上传者: {{videoInfo.uploader || '未知'}}</text>
						<text class="video-duration">时长: {{videoInfo.duration_string || '0:00'}}</text>
					</view>
				</view>

				<!-- 添加下载选项部分 -->
				<view class="format-selection">
					<text class="section-title">选择下载格式</text>
					<radio-group @change="formatChange">
						<label class="radio-item" v-for="(item, index) in formatOptions" :key="index">
							<radio :value="item.value" :checked="selectedFormat === item.value" />
							<text>{{item.label}}</text>
						</label>
					</radio-group>

					<view class="specific-format" v-if="selectedFormat === 'specific' && videoInfo.formats">
						<picker @change="specificFormatChange" :value="formatIndex" :range="formatRange">
							<view class="picker-view">
								<text>{{formatRange[formatIndex] || '选择具体格式'}}</text>
							</view>
						</picker>
					</view>
				</view>

<!-- 				<view class="download-options">
					<label class="checkbox-item">
						<checkbox :checked="directDownload" @click="directDownload = !directDownload" />
						<text>直接下载</text>
					</label>

					<view class="download-type-selector" v-if="directDownload">
						<radio-group @change="downloadTypeChange">
							<label class="radio-item">
								<radio value="direct_link" :checked="downloadType === 'direct_link'" />
								<text>使用原始链接(可能受限)</text>
							</label>
							<label class="radio-item">
								<radio value="proxy" :checked="downloadType === 'proxy'" />
								<text>使用代理(推荐)</text>
							</label>
							<label class="radio-item">
								<radio value="backend" :checked="downloadType === 'backend'" />
								<text>通过服务器(更稳定)</text>
							</label>
						</radio-group>
					</view>

					<view class="options-info">
						<text class="options-help">提示: 直接下载适合小文件，后台下载适合大文件</text>
					</view>
				</view> -->

				<button class="download-button" @click="createDownloadTask">开始下载</button>
			</view>

			<!-- 下载列表 -->
			<view class="download-list">
				<view class="download-list-header">
					<text class="section-title">已下载的视频</text>
					<text class="download-count"
						v-if="downloadList.length > 0">共{{downloadList.length}}个视频</text>
				</view>

				<view class="download-grid">
					<view class="download-item" v-for="(item, index) in downloadList" :key="index"
						@click.stop="onDownloadItemClick(item)">
						<view class="download-thumb">
							<image :src="item.thumbnail_url || '/static/images/default-poster.png'" mode="aspectFill">
							</image>
							<view class="download-duration" v-if="item.duration">{{formatDuration(item.duration)}}
							</view>
							<view class="download-play-overlay">
								<text class="play-icon">▶</text>
							</view>
						</view>
						<view class="download-info">
							<text class="download-title" :title="item.title || '未知标题'">{{item.title || '未知标题'}}</text>
							<view class="download-meta">
								<text class="download-uploader" v-if="item.uploader">{{item.uploader}}</text>
								<view class="download-stats">
									<text class="download-views"
										v-if="item.view_count">{{formatViewCount(item.view_count)}}</text>
									<text class="download-format" v-if="item.format_note">{{item.format_note}}</text>
								</view>
								<view class="download-file-meta">
									<text class="download-file-info" v-if="item.file_size">{{item.file_size}}</text>
									<text class="download-date"
										v-if="item.updated_at">{{formatDate(item.updated_at)}}</text>
								</view>
							</view>
							<view class="download-actions">
								<text class="action-play" @click.stop="playVideo(item)">播放</text>
								<text class="action-delete" @click.stop="confirmDeleteVideo(item)">删除</text>
							</view>
						</view>
					</view>
				</view>

				<view class="empty-list" v-if="downloadList.length === 0">
					<image src="/static/images/empty-box.png" mode="aspectFit" class="empty-image"></image>
					<text>暂无已下载的视频</text>
					<text class="empty-tip">输入YouTube链接并下载视频后将显示在这里</text>
				</view>
			</view>

			<!-- 加载提示 -->
			<view class="loading" v-if="isLoading">
				<text>{{errorMessage}}</text>
			</view>

			<!-- 添加直接下载模态框和进度条 -->
			<view class="direct-download-modal" v-if="showDirectDownloadModal">
				<view class="modal-content">
					<view class="modal-header">
						<text class="modal-title">正在下载视频</text>
						<text class="modal-close" @click="cancelDirectDownload">×</text>
					</view>

					<view class="video-download-info">
						<view class="download-video-thumb" v-if="directDownloadInfo.thumbnail">
							<image :src="directDownloadInfo.thumbnail" mode="aspectFill"></image>
						</view>
						<view class="download-video-details">
							<text class="download-video-title">{{directDownloadInfo.title || '正在下载...'}}</text>
							<text class="download-video-size"
								v-if="directDownloadInfo.size">{{directDownloadInfo.size}}</text>
						</view>
					</view>

					<view class="download-progress-container">
						<view class="download-progress-bar">
							<view class="download-progress-fill" :style="{width: `${downloadProgress}%`}"></view>
						</view>
						<view class="download-progress-text">
							<text>{{downloadProgress}}%</text>
							<text>{{downloadSpeed}}</text>
						</view>
					</view>

					<view class="download-actions-row">
						<button class="download-action-btn cancel" @click="cancelDirectDownload">取消</button>
						<button class="download-action-btn primary" v-if="downloadComplete"
							@click="openDownloadedFile">打开</button>
						<button class="download-action-btn primary" v-else disabled>下载中</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		youtubeApi,
		MEDIA_URL,
		API_ENDPOINTS
	} from '@/static/api/index.js';

	export default {
		data() {
			return {
				videoUrl: '',
				videoInfo: null,
				downloadList: [],
				isLoading: false,
				errorMessage: '',
				cookieStatus: false,
				cookieTestVideo: null,
				cookieFilePath: '',
				showCookieManager: false,
				showBrowserSelect: false,
				selectedFormat: 'best',
				formatIndex: 0,
				directDownload: false,
				downloadType: 'proxy', // 默认使用代理方式
				proxyUrl: 'http://192.168.88.200:9000/api/proxy/video/', // 代理服务器URL
				formatOptions: [
					// { label: '最佳质量', value: 'best' },
					{
						label: '仅音频 (MP3)',
						value: 'audio_only'
					},
					{
						label: '带字幕',
						value: 'with_subtitle'
					},
					{
						label: '指定格式',
						value: 'specific'
					}
				],
				browserOptions: [{
						label: 'Chrome',
						value: 'chrome',
						icon: '🌐'
					},
					{
						label: 'Firefox',
						value: 'firefox',
						icon: '🦊'
					},
					{
						label: 'Edge',
						value: 'edge',
						icon: '🌀'
					},
					{
						label: 'Safari',
						value: 'safari',
						icon: '🧭'
					},
					{
						label: 'Opera',
						value: 'opera',
						icon: '🎭'
					},
					{
						label: 'Brave',
						value: 'brave',
						icon: '🦁'
					}
				],
				showDirectDownloadModal: false,
				downloadProgress: 0,
				downloadSpeed: '0 KB/s',
				downloadComplete: false,
				downloadTask: null,
				directDownloadInfo: {
					title: '',
					size: '',
					thumbnail: '',
					tempFilePath: ''
				},
				pollTimer: null, // 轮询定时器
				activeDownloadTasks: {}, // 活跃下载任务状态跟踪
				progressUpdateInterval: 2000, // 轮询间隔(毫秒)
				socketTask: null, // WebSocket任务
				loadingDownloadList: false // 标记下载列表是否正在加载中
			}
		},
		computed: {
			formatRange() {
				if (!this.videoInfo || !this.videoInfo.formats) return ['暂无可选格式'];

				return this.videoInfo.formats.map(format => {
					let sizeInfo = format.filesize_mb ? `(${format.filesize_mb})` : '';
					return `${format.note || format.resolution || '未知'} - ${format.ext || '未知格式'} ${sizeInfo}`;
				});
			},
			validDownloadList() {
				if (!this.downloadList) return [];

				// 获取基本列表
				let baseList = [];
				if (!Array.isArray(this.downloadList)) {
					if (this.downloadList.results && Array.isArray(this.downloadList.results)) {
						baseList = this.downloadList.results.filter(item => item !== null);
					} else if (typeof this.downloadList === 'object') {
						baseList = [this.downloadList].filter(item => item !== null);
					}
				} else {
					baseList = this.downloadList.filter(item => item !== null);
				}

				// 只返回下载成功的项目
				return baseList.filter(item => {
					return this.inferItemStatus(item) === 'completed';
				});
			}
		},
		onLoad() {
			this.fetchDownloadList();
			this.checkCookieStatus();
		},
		onUnload() {
			// 页面卸载时清理资源
			this.stopProgressPolling();
			this.disconnectWebSocket();

			// 清理事件监听器
			uni.$off('refresh-download-list');
		},
		onPullDownRefresh() {
			this.fetchDownloadList();
			this.checkCookieStatus();
			uni.stopPullDownRefresh();
		},
		methods: {
			// 获取下载列表
			fetchDownloadList() {
				this.loadingDownloadList = true;

				youtubeApi.getDownloadList()
					.then(response => {
						this.loadingDownloadList = false;
						if (response.data && response.data.results) {
							this.downloadList = response.data.results;
						} else if (response.data && Array.isArray(response.data)) {
							this.downloadList = response.data;
						} else if (response.data) {
							// 如果返回单个对象，转为数组
							this.downloadList = [response.data];
						} else {
							this.downloadList = [];
						}
					})
					.catch(error => {
						this.loadingDownloadList = false;
						console.error('获取下载列表失败:', error);
						uni.showToast({
							title: '获取下载列表失败',
							icon: 'none'
						});
						this.downloadList = [];
					});
			},

			// 请求通知权限
			requestNotificationPermission() {
				if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !==
					'denied') {
					Notification.requestPermission();
				}
			},

			// 动态计算下载项目样式
			getDownloadItemClass(item) {
				// 推断下载状态：根据media_url, download_path等字段
				const status = this.inferItemStatus(item);
				return {
					'download-item': true,
					[status]: true
				};
			},

			// 根据项目的属性推断下载状态
			inferItemStatus(item) {
				// 如果有media_url或download_path，说明下载已完成
				if (item.media_url || (item.download_path && item.file_size)) {
					return 'completed';
				}
				// 如果有download_path但没有file_size，可能正在下载
				else if (item.download_path && !item.file_size) {
					return 'downloading';
				}
				// 如果是最近创建的（30分钟内），但没有media_url和download_path，可能是等待中
				else if (this.isRecentlyCreated(item.created_at, 30)) {
					return 'pending';
				}
				// 否则视为失败
				else {
					return 'failed';
				}
			},

			// 检查是否是最近创建的任务
			isRecentlyCreated(dateString, minutesThreshold = 30) {
				if (!dateString) return false;

				const createdDate = new Date(dateString);
				const now = new Date();
				const diffMinutes = (now - createdDate) / (1000 * 60);

				return diffMinutes <= minutesThreshold;
			},

			// 获取状态文本
			getStatusText(status) {
				const statusMap = {
					'pending': '等待中',
					'downloading': '下载中',
					'completed': '已完成',
					'failed': '失败'
				};
				return statusMap[status] || '未知状态';
			},

			// 获取视频信息
			getVideoInfo() {
				if (!this.videoUrl) {
					uni.showToast({
						title: '请输入有效的视频链接',
						icon: 'none'
					});
					return;
				}

				this.videoInfo = null;
				this.downloadFormats = [];
				this.isLoading = true;
				this.errorMessage = '';

				const data = {
					url: this.videoUrl
				};

				// 如果有有效的cookie文件，添加到请求中
				if (this.cookieStatus === 'valid' && this.cookieFilePath) {
					data.cookie_file = this.cookieFilePath;
				}

				youtubeApi.getVideoInfo(data)
					.then(response => {
						this.isLoading = false;
						this.videoInfo = response.data;

						// 移除直接下载链接，我们不想显示它
						if (this.videoInfo && this.videoInfo.direct_url) {
							delete this.videoInfo.direct_url;
						}

						// 确保视频信息中包含流媒体URL
						// if (this.videoInfo && !this.videoInfo.stream_url && this.videoInfo.formats && this.videoInfo.formats.length > 0) {
						// 	// 查找最佳格式
						// 	const bestFormat = this.videoInfo.formats.find(f => f.acodec !== 'none' && f.vcodec !== 'none') || this.videoInfo.formats[0];
						// 	if (bestFormat && bestFormat.url) {
						// 		// 使用API生成流媒体URL
						// 		this.videoInfo.stream_url = youtubeApi.getStreamVideoUrl(bestFormat.url);
						// 		console.log('生成流媒体URL:', this.videoInfo.stream_url);
						// 	}
						// }

						// 提取可下载的格式
						if (this.videoInfo.formats && this.videoInfo.formats.length > 0) {
							this.downloadFormats = this.videoInfo.formats.sort((a, b) => {
								// 首先按类型排序（视频+音频优先）
								if (a.acodec !== 'none' && a.vcodec !== 'none' && (b.acodec === 'none' || b
										.vcodec === 'none')) {
									return -1;
								}
								if (b.acodec !== 'none' && b.vcodec !== 'none' && (a.acodec === 'none' || a
										.acodec === 'none')) {
									return 1;
								}

								// 然后按分辨率/质量排序
								const resA = parseInt(a.height) || 0;
								const resB = parseInt(b.height) || 0;
								return resB - resA;
							});

							// 为每个格式添加流媒体URL（如果没有）
							this.downloadFormats.forEach(format => {
								if (format.url && !format.stream_url) {
									format.stream_url = youtubeApi.getStreamVideoUrl(format.url);
								}
							});
						} else {
							this.downloadFormats = [];
						}
					})
					.catch(err => {
						this.isLoading = false;
						this.videoInfo = null;
						this.downloadFormats = [];
						console.error('获取视频信息失败:', err);

						// 使用增强的错误处理
						let errorMsg = '获取视频信息失败';

						// 优先使用处理后的用户友好消息
						if (err.userFriendlyMessage) {
							errorMsg = err.userFriendlyMessage;
						} else if (err.isRegionRestricted) {
							errorMsg += '：视频有区域限制，请使用有效的Cookie';
							this.checkCookieStatus(); // 自动检查Cookie状态
						} else if (err.isLoginRequired) {
							errorMsg += '：视频需要登录才能访问，请使用有效的Cookie';
							this.checkCookieStatus(); // 自动检查Cookie状态
						} else if (err.isCookieIssue) {
							errorMsg += '：Cookie可能无效，请上传有效的Cookie';
							this.checkCookieStatus(); // 自动检查Cookie状态
						} else if (err.isVideoUnavailable) {
							errorMsg += '：视频不可用或已被删除';
						} else if (err.isNetworkIssue) {
							errorMsg += '：网络连接问题，请检查网络后重试';
						} else if (err.isServerIssue) {
							errorMsg += '：服务器暂时不可用，请稍后重试';
						} else if (err.response && err.response.data) {
							let detail = '';
							const data = err.response.data;

							if (typeof data === 'string') {
								detail = data;
							} else if (data.message) {
								detail = data.message;
							} else if (data.error) {
								detail = data.error;
							} else if (data.detail) {
								detail = data.detail;
							}

							if (detail) {
								errorMsg += '：' + detail;
							}
						}

						// 自动检查Cookie状态（如果是相关错误）
						if (err.isRegionRestricted || err.isLoginRequired || err.isCookieIssue) {
							this.checkCookieStatus();
						}

						this.errorMessage = errorMsg;
						uni.showToast({
							title: errorMsg,
							icon: 'none',
							duration: 3000
						});
					});
			},

			// 格式选择变更
			formatChange(e) {
				this.selectedFormat = e.detail.value;
				this.formatIndex = 0;
			},

			// 特定格式选择变更
			specificFormatChange(e) {
				this.formatIndex = e.detail.value;
			},

			// 下载类型切换
			downloadTypeChange(e) {
				this.downloadType = e.detail.value;
			},

			// 在浏览器中打开链接
			openInBrowser(url) {
				if (!url) return;

				// 确保链接有效
				if (!url.startsWith('http')) {
					url = 'http://' + url;
				}

				plus.runtime.openURL(url);
			},

			// 创建下载任务
			createDownloadTask() {
				if (!this.videoUrl) {
					uni.showToast({
						title: '请输入有效的视频链接',
						icon: 'none'
					});
					return;
				}

				if (!this.videoInfo) {
					uni.showToast({
						title: '请先获取视频信息',
						icon: 'none'
					});
					return;
				}

				// 准备请求参数
				const data = {
					url: this.videoUrl,
					title: this.videoInfo.title || '未命名视频'
				};

				// 如果有有效的cookie文件，添加到请求中
				if (this.cookieStatus === 'valid' && this.cookieFilePath) {
					data.cookie_file = this.cookieFilePath;
				}

				// 根据选择的格式设置下载参数
				if (this.selectedFormat === 'best') {
					data.format_type = 'best';
				} else if (this.selectedFormat === 'audio_only') {
					data.format_type = 'audio_only';
				} else if (this.selectedFormat === 'with_subtitle') {
					data.format_type = 'with_subtitle';
				} else if (this.selectedFormat === 'specific' && this.videoInfo.formats) {
					// 使用指定的格式ID
					const selectedFormat = this.videoInfo.formats[this.formatIndex];
					if (selectedFormat && selectedFormat.format_id) {
						data.format_id = selectedFormat.format_id;
					} else {
						uni.showToast({
							title: '所选格式无效，将使用最佳质量',
							icon: 'none'
						});
						data.format_type = 'best';
					}
				}

				// // 根据下载类型处理
				// if (this.downloadType === 'direct') {
				// 	// 直接下载方式
				// 	data.direct = true;

				// 	// 打开直接下载进度模态框
				// 	this.showDirectDownloadModal = true;
				// 	this.downloadProgress = 0;
				// 	this.downloadSpeed = '0 KB/s';
				// 	this.downloadComplete = false;

				// 	// 如果有缩略图，设置到下载信息中
				// 	if (this.videoInfo.thumbnail) {
				// 		this.directDownloadInfo.thumbnail = this.videoInfo.thumbnail;
				// 	}

				// 	// 设置视频标题
				// 	this.directDownloadInfo.title = this.videoInfo.title || '未命名视频';

				// 	// 执行直接下载，显示用户可以看到的UI反馈
				// 	uni.showToast({
				// 		title: '准备下载...',
				// 		icon: 'loading',
				// 		duration: 2000
				// 	});
				// } else {
				// 	// 后台下载方式 - 显示长时间下载的提示
				// 	uni.showModal({
				// 		title: '开始下载',
				// 		content: '视频将在后台下载，这可能需要一些时间，尤其是大型视频。请保持应用处于活动状态，直到收到下载完成通知。',
				// 		showCancel: false,
				// 		confirmText: '了解'
				// 	});
				// }

				// 开始创建下载任务
				youtubeApi.createDownloadTask(data)
					.then(response => {
						console.log('下载任务创建成功:', response.data);

						if (this.downloadType === 'direct') {
							// 直接下载方式，处理下载链接
							if (response.data && response.data.url) {
								// 开始直接下载文件
								this.startDirectDownload({
									direct_url: response.data.url,
									youtube_video: response.data
								});
							} else {
								// 没有直接链接
								this.showDirectDownloadModal = false;
								uni.showToast({
									title: '无法获取直接下载链接',
									icon: 'none'
								});
							}
						} else {
							// 后台下载方式，任务已创建，刷新下载列表
							this.loadDownloadList();

							// 显示成功提示
							uni.showToast({
								title: '下载任务已创建，将在后台进行',
								icon: 'success'
							});

							// 将新创建的任务ID添加到活跃任务中以进行进度跟踪
							if (response.data.id) {
								this.activeDownloadTasks[response.data.id] = {
									progress: 0,
									speed: '等待中...',
									eta: '-'
								};

								// 确保进度轮询已启动
								if (!this.pollTimer && !this.socketTask) {
									this.startProgressPolling();
								}
							}
						}
					})
					.catch(error => {
						console.error('创建下载任务失败:', error);

						// 关闭直接下载模态框（如果打开）
						if (this.showDirectDownloadModal) {
							this.showDirectDownloadModal = false;
						}

						// 处理特定的错误信息
						let errorMsg = '创建下载任务失败';
						if (error.userFriendlyMessage) {
							errorMsg = error.userFriendlyMessage;
						} else if (error.message) {
							errorMsg = error.message;
						}

						// 在Broken pipe错误的情况下提供更友好的反馈
						if (error.message && error.message.includes('pipe')) {
							// 错误信息已在API层处理
							// 自动延迟刷新下载列表
							setTimeout(() => {
								this.loadDownloadList();
							}, 3000);
						} else {
							// 显示错误提示
							uni.showToast({
								title: errorMsg,
								icon: 'none',
								duration: 3000
							});
						}
					});
			},

			// 使用原始YouTube链接直接下载
			startDirectLinkDownload() {
				console.log('使用原始链接直接下载');

				if (!this.videoInfo || !this.videoInfo.direct_url) {
					uni.showToast({
						title: '无法获取直接下载链接',
						icon: 'none'
					});
					return;
				}

				// 根据format_id优先规则获取下载链接
				let downloadUrl = this.videoInfo.direct_url;
				let videoTitle = this.videoInfo.title || '未知视频';
				let thumbnailUrl = this.videoInfo.thumbnail;

				// 如果选择了特定格式，找到对应的直接链接
				if (this.selectedFormat === 'specific' && this.videoInfo.formats) {
					const selectedFormat = this.videoInfo.formats[this.formatIndex];
					if (selectedFormat && selectedFormat.url && selectedFormat.format_id) {
						downloadUrl = selectedFormat.url;
					}
				}

				// 设置下载信息
				this.directDownloadInfo = {
					title: videoTitle,
					size: '', // 未知大小
					thumbnail: thumbnailUrl,
					tempFilePath: ''
				};

				console.log('直接链接下载信息设置完成');

				// 显示下载进度模态框
				this.showDirectDownloadModal = true;
				this.downloadProgress = 0;
				this.downloadSpeed = '准备下载...';
				this.downloadComplete = false;

				// 设置文件名和扩展名
				let ext = this.getFileExtension(downloadUrl);
				const fileName = `${videoTitle.replace(/[\/\\:*?"<>|]/g, '_')}.${ext}`;
				console.log('准备下载文件:', fileName);

				try {
					// 创建下载任务
					const downloadTask = uni.downloadFile({
						url: downloadUrl,
						filename: fileName,
						success: (res) => {
							console.log('下载完成，状态码:', res.statusCode, '临时文件路径:', res.tempFilePath);
							if (res.statusCode === 200) {
								this.directDownloadInfo.tempFilePath = res.tempFilePath;
								this.downloadComplete = true;
								this.downloadProgress = 100;
								this.downloadSpeed = '下载完成';

								// 保存到相册/文件夹
								uni.saveFile({
									tempFilePath: res.tempFilePath,
									success: (saveRes) => {
										console.log('文件保存成功:', saveRes.savedFilePath);
										this.directDownloadInfo.tempFilePath = saveRes
											.savedFilePath;
										uni.showToast({
											title: '文件已保存',
											icon: 'success'
										});

										// 显示通知
										this.showDownloadComplete(videoTitle);
									},
									fail: (err) => {
										console.error('保存文件失败:', err);
										uni.showToast({
											title: '文件保存失败: ' + (err.errMsg || JSON
												.stringify(err)),
											icon: 'none'
										});
									}
								});
							} else {
								console.error('下载失败，HTTP状态码:', res.statusCode);
								uni.showToast({
									title: '下载失败: 状态码 ' + res.statusCode,
									icon: 'none'
								});
							}
						},
						fail: (err) => {
							console.error('下载请求失败:', err);
							this.fallbackToBackendDownload('原始链接下载失败，可能因为CORS限制');
						}
					});

					// 监听下载进度
					let lastProgressUpdateTime = Date.now();
					let lastDownloadedSize = 0;

					downloadTask.onProgressUpdate((res) => {
						this.downloadProgress = res.progress;

						// 计算下载速度
						const now = Date.now();
						const timeDiff = (now - lastProgressUpdateTime) / 1000; // 秒

						if (timeDiff > 0.5) { // 每0.5秒更新一次速度
							const downloadedSize = res.totalBytesWritten;
							const downloadedDiff = downloadedSize - lastDownloadedSize;
							const speed = downloadedDiff / timeDiff; // 字节每秒

							this.downloadSpeed = this.formatSpeed(speed);

							lastProgressUpdateTime = now;
							lastDownloadedSize = downloadedSize;
						}
					});

					// 保存下载任务引用
					this.downloadTask = downloadTask;
				} catch (error) {
					console.error('创建直接链接下载任务异常:', error);
					uni.showToast({
						title: '启动下载失败: ' + (error.message || JSON.stringify(error)),
						icon: 'none',
						duration: 3000
					});
					this.showDirectDownloadModal = false;
				}
			},

			// 添加代理下载方法
			startProxyDownload() {
				console.log('使用代理服务器下载');

				if (!this.videoInfo || !this.videoInfo.direct_url) {
					uni.showToast({
						title: '无法获取下载链接',
						icon: 'none'
					});
					return;
				}

				// 根据format_id优先规则获取下载链接
				let downloadUrl = this.videoInfo.direct_url;
				let videoTitle = this.videoInfo.title || '未知视频';
				let thumbnailUrl = this.videoInfo.thumbnail;

				// 如果选择了特定格式，找到对应的直接链接
				if (this.selectedFormat === 'specific' && this.videoInfo.formats) {
					const selectedFormat = this.videoInfo.formats[this.formatIndex];
					if (selectedFormat && selectedFormat.url && selectedFormat.format_id) {
						downloadUrl = selectedFormat.url;
					}
				}

				// 使用代理服务器URL
				// 编码原始URL作为参数传递给代理服务器
				const proxyDownloadUrl = `${this.proxyUrl}?url=${encodeURIComponent(downloadUrl)}`;

				// 设置下载信息
				this.directDownloadInfo = {
					title: videoTitle,
					size: '', // 未知大小
					thumbnail: thumbnailUrl,
					tempFilePath: ''
				};

				console.log('代理下载信息设置完成');

				// 显示下载进度模态框
				this.showDirectDownloadModal = true;
				this.downloadProgress = 0;
				this.downloadSpeed = '准备下载...';
				this.downloadComplete = false;

				// 设置文件名和扩展名
				let ext = this.getFileExtension(downloadUrl);
				const fileName = `${videoTitle.replace(/[\/\\:*?"<>|]/g, '_')}.${ext}`;
				console.log('准备下载文件:', fileName, '代理URL:', proxyDownloadUrl);

				try {
					// 创建下载任务
					const downloadTask = uni.downloadFile({
						url: proxyDownloadUrl,
						filename: fileName,
						header: {
							'X-Requested-With': 'XMLHttpRequest',
							'Referer': this.proxyUrl
						},
						success: (res) => {
							console.log('下载完成，状态码:', res.statusCode, '临时文件路径:', res.tempFilePath);
							if (res.statusCode === 200) {
								this.directDownloadInfo.tempFilePath = res.tempFilePath;
								this.downloadComplete = true;
								this.downloadProgress = 100;
								this.downloadSpeed = '下载完成';

								// 保存到相册/文件夹
								uni.saveFile({
									tempFilePath: res.tempFilePath,
									success: (saveRes) => {
										console.log('文件保存成功:', saveRes.savedFilePath);
										this.directDownloadInfo.tempFilePath = saveRes
											.savedFilePath;
										uni.showToast({
											title: '文件已保存',
											icon: 'success'
										});

										// 显示通知
										this.showDownloadComplete(videoTitle);
									},
									fail: (err) => {
										console.error('保存文件失败:', err);
										uni.showToast({
											title: '文件保存失败: ' + (err.errMsg || JSON
												.stringify(err)),
											icon: 'none'
										});
									}
								});
							} else {
								console.error('下载失败，HTTP状态码:', res.statusCode);
								this.fallbackToBackendDownload('下载失败: 状态码 ' + res.statusCode);
							}
						},
						fail: (err) => {
							console.error('下载请求失败:', err);
							this.fallbackToBackendDownload('下载失败，可能是CORS限制');
						}
					});

					// 监听下载进度
					let lastProgressUpdateTime = Date.now();
					let lastDownloadedSize = 0;

					downloadTask.onProgressUpdate((res) => {
						this.downloadProgress = res.progress;

						// 计算下载速度
						const now = Date.now();
						const timeDiff = (now - lastProgressUpdateTime) / 1000; // 秒

						if (timeDiff > 0.5) { // 每0.5秒更新一次速度
							const downloadedSize = res.totalBytesWritten;
							const downloadedDiff = downloadedSize - lastDownloadedSize;
							const speed = downloadedDiff / timeDiff; // 字节每秒

							this.downloadSpeed = this.formatSpeed(speed);

							lastProgressUpdateTime = now;
							lastDownloadedSize = downloadedSize;
						}
					});

					// 保存下载任务引用
					this.downloadTask = downloadTask;
				} catch (error) {
					console.error('创建代理下载任务异常:', error);
					this.fallbackToBackendDownload('启动下载失败: ' + (error.message || JSON.stringify(error)));
				}
			},

			// 监控下载进度通过WebSocket
			connectWebSocket() {
				try {
					const token = uni.getStorageSync('token');
					if (!token) return;

					// WebSocket URL，根据服务器配置调整
					const wsUrl = 'ws://192.168.88.200:9000/ws/youtube/download/';

					this.socketTask = uni.connectSocket({
						url: wsUrl,
						header: {
							'Authorization': 'Bearer ' + token
						},
						success: () => {
							console.log('WebSocket连接创建成功');
						},
						fail: (err) => {
							console.error('WebSocket连接创建失败:', err);
							// 如果WebSocket失败，回退到轮询
							this.startProgressPolling();
						}
					});

					// 监听WebSocket事件
					if (this.socketTask) {
						this.socketTask.onOpen(() => {
							console.log('WebSocket连接已打开');
						});

						this.socketTask.onClose(() => {
							console.log('WebSocket连接已关闭');
							// 连接关闭后启用轮询
							this.startProgressPolling();
						});

						this.socketTask.onError((error) => {
							console.error('WebSocket错误:', error);
							// 出错后启用轮询
							this.startProgressPolling();
						});

						this.socketTask.onMessage((res) => {
							try {
								const data = JSON.parse(res.data);
								if (data.type === 'download_progress') {
									this.updateTaskProgress(data);
								}
							} catch (e) {
								console.error('解析WebSocket消息失败:', e);
							}
						});
					}
				} catch (error) {
					console.error('创建WebSocket连接时出错:', error);
					this.startProgressPolling();
				}
			},

			// 断开WebSocket连接
			disconnectWebSocket() {
				if (this.socketTask) {
					this.socketTask.close({
						success: () => {
							console.log('WebSocket连接已关闭');
						}
					});
					this.socketTask = null;
				}
			},

			// 开始轮询下载进度
			startProgressPolling() {
				// 已存在轮询任务则不重复创建
				if (this.pollTimer) return;

				// 获取进行中的下载任务ID列表
				const downloadingTasks = this.validDownloadList.filter(
					item => item.status === 'pending' || item.status === 'downloading'
				);

				if (downloadingTasks.length === 0) return;

				// 设置任务进度初始状态
				downloadingTasks.forEach(task => {
					this.activeDownloadTasks[task.id] = {
						progress: 0,
						speed: 'N/A',
						eta: 'N/A'
					};
				});

				// 创建轮询定时器
				this.pollTimer = setInterval(() => {
					this.pollDownloadProgress();
				}, this.progressUpdateInterval);
			},

			// 停止进度轮询
			stopProgressPolling() {
				if (this.pollTimer) {
					clearInterval(this.pollTimer);
					this.pollTimer = null;
				}
			},

			// 轮询下载进度
			pollDownloadProgress() {
				const downloadingTasks = this.validDownloadList.filter(
					item => item.status === 'pending' || item.status === 'downloading'
				);

				if (downloadingTasks.length === 0) {
					this.stopProgressPolling();
					return;
				}

				// 对每个任务请求进度更新
				downloadingTasks.forEach(task => {
					youtubeApi.getDownloadProgress(task.id)
						.then(response => {
							// 使用平滑过渡效果更新任务进度
							this.updateTaskProgress({
								task_id: task.id,
								...response.data
							});

							// 任务完成或失败时刷新下载列表
							if (response.data.status === 'completed' || response.data.status === 'failed') {
								this.loadDownloadList();

								// 显示通知
								if (response.data.status === 'completed') {
									this.showDownloadComplete(task.title || '视频');
								}
							}
						})
						.catch(error => {
							console.error(`获取任务${task.id}进度失败:`, error);
						});
				});
			},

			// 显示下载完成通知
			showDownloadComplete(title) {
				// 使用系统通知
				if ('Notification' in window && Notification.permission === 'granted') {
					new Notification('下载完成', {
						body: `${title} 已下载完成`,
						icon: '/static/images/logo.png'
					});
				} else {
					// 使用uni通知
					plus.push.createMessage(
						`${title} 已下载完成`,
						'下载完成', {
							cover: false
						}
					);
				}

				// 播放提示音
				const audio = new Audio('/static/sound/download-complete.mp3');
				audio.play().catch(e => console.log('无法播放通知声音'));
			},

			// 更新任务进度
			updateTaskProgress(data) {
				const taskIndex = this.downloadList.findIndex(item => item.id === data.task_id);
				if (taskIndex !== -1) {
					// 使用Vue的响应式更新
					this.$set(this.downloadList, taskIndex, {
						...this.downloadList[taskIndex],
						progress: data.progress || 0,
						speed: data.speed || 'N/A',
						eta: data.eta || 'N/A',
						status: data.status || this.downloadList[taskIndex].status
					});

					// 更新活跃任务状态
					if (data.status === 'downloading' || data.status === 'pending') {
						this.activeDownloadTasks[data.task_id] = {
							progress: data.progress || 0,
							speed: data.speed || 'N/A',
							eta: data.eta || 'N/A'
						};
					} else {
						delete this.activeDownloadTasks[data.task_id];
					}
				}
			},

			// 取消下载
			cancelDownload(id) {
				uni.showModal({
					title: '取消下载',
					content: '确定要取消这个下载任务吗？',
					success: (res) => {
						if (res.confirm) {
							youtubeApi.cancelDownload(id)
								.then(response => {
									uni.showToast({
										title: '任务已取消',
										icon: 'success'
									});
									// 刷新下载列表
									this.loadDownloadList();
								})
								.catch(error => {
									console.error('取消下载失败:', error);
									uni.showToast({
										title: error.message || '取消下载失败',
										icon: 'none'
									});
								});
						}
					}
				});
			},

			// 加载下载列表
			loadDownloadList() {
				this.loading = true;
				// 防止同时多次请求
				if (this.loadingDownloadList) {
					console.log('已有下载列表加载请求进行中，跳过');
					return;
				}

				this.loadingDownloadList = true;
				console.log('开始加载下载列表...');

				youtubeApi.getDownloadList()
					.then(res => {
						this.loadingDownloadList = false;
						// 确保数据是数组形式
						if (res.data && res.data.results && Array.isArray(res.data.results)) {
							this.downloadList = res.data.results;
						} else if (res.data && Array.isArray(res.data)) {
							this.downloadList = res.data;
						} else if (res.data) {
							// 如果返回单个对象，转为数组
							this.downloadList = [res.data];
						} else {
							this.downloadList = [];
						}

						console.log('下载列表数据:', JSON.stringify(this.downloadList));

						// 修正数据中的空值
						this.downloadList.forEach(item => {
							if (!item.title) {
								item.title = '未命名视频';
							}
							if (!item.thumbnail_url && item.url) {
								// 根据YouTube URL生成缩略图URL
								const videoId = this.extractYouTubeVideoId(item.url);
								if (videoId) {
									item.thumbnail_url = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
								}
							}

							// 如果有下载中的任务，确保启动进度监控
							if (item.status === 'downloading' || item.status === 'pending') {
								this.activeDownloadTasks[item.id] = {
									progress: item.progress || 0,
									speed: item.speed || 'N/A',
									eta: item.eta || 'N/A'
								};
							}
						});

						// 更新后检查是否需要开始轮询
						if (Object.keys(this.activeDownloadTasks).length > 0 && !this.pollTimer && !this.socketTask) {
							this.startProgressPolling();
						}

						this.loading = false;
					})
					.catch(err => {
						this.loadingDownloadList = false;
						console.error('获取下载列表失败:', err);

						// 更加用户友好的错误提示
						let errorMsg = '获取下载列表失败';
						if (err.message) {
							if (err.message.includes('网络连接断开') || err.message.includes('pipe')) {
								errorMsg = '获取下载列表失败: 网络连接中断，请稍后重试';
							} else if (err.message.includes('超时')) {
								errorMsg = '获取下载列表失败: 请求超时，请检查网络';
							} else {
								errorMsg = '获取下载列表失败: ' + err.message;
							}
						}

						uni.showToast({
							title: errorMsg,
							icon: 'none',
							duration: 3000
						});

						// 避免完全无数据
						if (!this.downloadList || this.downloadList.length === 0) {
							// 尝试从缓存加载
							const cachedList = uni.getStorageSync('youtubeDownloadList');
							if (cachedList) {
								try {
									this.downloadList = JSON.parse(cachedList);
									console.log('从缓存加载下载列表:', this.downloadList.length);
								} catch (e) {
									console.error('解析缓存列表失败:', e);
									this.downloadList = [];
								}
							} else {
								this.downloadList = [];
							}
						}

						this.loading = false;
					})
					.finally(() => {
						// 如果加载成功且有数据，缓存列表
						if (this.downloadList && this.downloadList.length > 0) {
							try {
								uni.setStorageSync('youtubeDownloadList', JSON.stringify(this.downloadList));
							} catch (e) {
								console.error('缓存下载列表失败:', e);
							}
						}
					});
			},

			// 提取YouTube视频ID
			extractYouTubeVideoId(url) {
				if (!url) return null;

				// 尝试匹配YouTube URL模式
				const patterns = [
					/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\?\/]+)/,
					/youtube\.com\/embed\/([^\/\?]+)/,
					/youtube\.com\/v\/([^\/\?]+)/
				];

				for (const pattern of patterns) {
					const match = url.match(pattern);
					if (match && match[1]) {
						return match[1];
					}
				}

				return null;
			},

			// 播放视频
			playVideo(item) {
				if (!item) {
					uni.showToast({
						title: '无效的视频数据',
						icon: 'none'
					});
					return;
				}

				console.log('准备播放视频:', JSON.stringify(item));

				// 检查是否有数据库ID
				if (item.id) {
					console.log('视频有数据库ID:', item.id);
					// 直接跳转到视频详情页面
					this.navigateToVideoPage(item);
					return;
				}

				// 对于没有ID的视频，回退到之前的处理方式
				// 优先使用stream_url作为流媒体播放源，其次使用media_url或download_path
				let videoUrl = '';

				// 检查是否有流媒体URL
				if (item.stream_url) {
					videoUrl = item.stream_url;
					console.log('使用流媒体URL播放:', videoUrl);
				} else if (item.media_url) {
					videoUrl = item.media_url;
					console.log('使用媒体URL播放:', videoUrl);
				} else if (item.download_path) {
					videoUrl = item.download_path;
					console.log('使用下载路径播放:', videoUrl);
				}

				if (!videoUrl) {
					uni.showToast({
						title: '视频链接不可用',
						icon: 'none'
					});
					return;
				}

				// 直接跳转到视频信息页面，不显示选择对话框
				this.navigateToVideoPage(item);
			},

			// 应用内直接播放
			playVideoInApp(item) {
				// 构建参数对象，确保所有字段都有值并且格式正确
				const videoUrl = item.media_url || item.download_path || '';

				// 在当前页面创建视频元素
				let videoEl = document.createElement('video');
				videoEl.setAttribute('src', videoUrl);
				videoEl.setAttribute('controls', 'true');
				videoEl.setAttribute('autoplay', 'true');
				videoEl.setAttribute('style',
					'position:fixed; top:0; left:0; width:100%; height:100%; z-index:9999; background:#000;');

				// 添加关闭按钮
				let closeBtn = document.createElement('div');
				closeBtn.setAttribute('style',
					'position:fixed; top:20px; right:20px; width:40px; height:40px; z-index:10000; color:#fff; font-size:30px; text-align:center; line-height:40px; cursor:pointer;'
				);
				closeBtn.innerText = '×';
				closeBtn.onclick = function() {
					document.body.removeChild(videoEl);
					document.body.removeChild(closeBtn);
				};

				// 添加到页面
				document.body.appendChild(videoEl);
				document.body.appendChild(closeBtn);
			},

			// 使用系统播放器
			playWithSystemPlayer(item) {
				const videoUrl = item.media_url || item.download_path || '';

				if (!videoUrl) {
					uni.showToast({
						title: '视频链接不可用',
						icon: 'none'
					});
					return;
				}

				console.log('使用系统播放器打开视频:', videoUrl);

				// 尝试使用系统默认应用打开
				plus.runtime.openFile(videoUrl, {}, (err) => {
					if (err) {
						console.error('打开系统播放器失败:', err);

						// 如果直接打开失败，尝试使用浏览器打开
						if (videoUrl.startsWith('http')) {
							console.log('尝试使用浏览器打开视频');
							plus.runtime.openURL(videoUrl);
						} else {
							uni.showToast({
								title: '无法打开视频，请检查文件路径',
								icon: 'none'
							});
						}
					}
				});
			},

			// 跳转到视频信息页面
			navigateToVideoPage(item) {
				// 直接使用media_url，不再使用stream URL
				let videoUrl = '';
				
				// 优先使用media_url
				if (item.media_url) {
					videoUrl = item.media_url;
					console.log('使用媒体URL:', videoUrl);
				} else if (item.download_path) {
					videoUrl = item.download_path;
					console.log('使用下载路径:', videoUrl);
				} else if (item.stream_url) {
					videoUrl = item.stream_url;
					console.log('使用已有流媒体URL:', videoUrl);
				} else if (item.id) {
					// 只有在没有其他URL的情况下才使用ID构建流媒体URL
					videoUrl = youtubeApi.getVideoStreamUrl(item.id);
					console.log('使用数据库ID构建流媒体URL:', videoUrl);
				}

				// 构建参数对象，确保所有字段都有值并且格式正确
				const params = {
					video_url: videoUrl || '',
					title: encodeURIComponent(item.title || '视频播放'),
					file_size: item.file_size || '-',
					download_time: item.updated_at ? new Date(item.updated_at).toLocaleString() : '-',
					poster: item.thumbnail_url || '',
					description: encodeURIComponent(item.description || '从YouTube下载的视频'),
					video_id: item.id || '' // 传递视频ID，以便播放器页面可以使用
				};

				// 构建查询字符串，确保正确编码
				const queryString = Object.keys(params)
					.map(key => `${key}=${params[key]}`)
					.join('&');

				console.log('播放参数:', params);

				// 确保使用正确的路径
				const targetUrl = `/pages/video/video?${queryString}`;
				console.log('跳转URL:', targetUrl);

				// 显示加载提示
				uni.showLoading({
					title: '正在打开播放器...'
				});

				console.log('=======================为什么页面没有跳转========================')
				console.log('=======================为什么页面没有跳转========================')
				console.log('=======================为什么页面没有跳转========================')

				// 导航到播放器页面
				uni.navigateTo({
					url: targetUrl,
					success: () => {
						console.log('成功跳转到播放页面');
						uni.hideLoading();
					},
					fail: (err) => {
						console.error('跳转到播放页面失败:', err);
						uni.hideLoading();

						// 显示更详细的错误信息并尝试替代方案
						const errMsg = err.errMsg || JSON.stringify(err);
						console.log('详细错误信息:', errMsg);

						// 尝试使用其他路径格式
						console.log('尝试使用其他路径格式');
						const alternativeUrls = [
							`../video/video?${queryString}`,
							`/pages/video/video?${queryString}`,
							`pages/video/video?${queryString}`
						];

						// 显示选择对话框
						uni.showActionSheet({
							itemList: ['使用方法1', '使用方法2', '使用方法3', '使用重定向'],
							success: (res) => {
								if (res.tapIndex === 3) {
									// 尝试使用redirectTo
									uni.redirectTo({
										url: targetUrl,
										fail: (redirectErr) => {
											console.error('重定向到播放页面也失败:', redirectErr);
											uni.showToast({
												title: '无法打开播放器，请检查应用配置',
												icon: 'none',
												duration: 3000
											});
										}
									});
								} else if (res.tapIndex >= 0 && res.tapIndex < 3) {
									// 尝试使用不同的路径格式
									const altUrl = alternativeUrls[res.tapIndex];
									console.log(`尝试路径${res.tapIndex + 1}:`, altUrl);

									uni.navigateTo({
										url: altUrl,
										success: () => {
											console.log(`使用路径${res.tapIndex + 1}跳转成功`);
										},
										fail: (altErr) => {
											console.error(
												`使用路径${res.tapIndex + 1}跳转失败:`,
												altErr);
											uni.showToast({
												title: '所有路径均失败，请联系开发者',
												icon: 'none',
												duration: 3000
											});
										}
									});
								}
							}
						});
					}
				});
			},

			// 重试下载
			retryDownload(id) {
				this.loading = true;
				youtubeApi.retryDownload(id)
					.then(res => {
						uni.showToast({
							title: '重试任务已创建',
							icon: 'success'
						});
						this.loadDownloadList();
						this.loading = false;
					})
					.catch(err => {
						console.error('重试下载失败:', err);

						// 使用增强的错误处理
						let errorMsg = '重试下载失败';

						// 优先使用处理后的用户友好消息
						if (err.userFriendlyMessage) {
							errorMsg = err.userFriendlyMessage;
						} else if (err.isRegionRestricted) {
							errorMsg += '：视频有区域限制，请使用有效的Cookie';
						} else if (err.isLoginRequired) {
							errorMsg += '：视频需要登录才能访问，请使用有效的Cookie';
						} else if (err.isCookieIssue) {
							errorMsg += '：Cookie可能无效，请上传有效的Cookie';
						} else if (err.isVideoUnavailable) {
							errorMsg += '：视频不可用或已被删除';
						} else if (err.isNetworkIssue) {
							errorMsg += '：网络连接问题，请检查网络后重试';
						} else if (err.isServerIssue) {
							errorMsg += '：服务器暂时不可用，请稍后重试';
						} else if (err.response && err.response.data) {
							let detail = '';
							const data = err.response.data;

							if (typeof data === 'string') {
								detail = data;
							} else if (data.message) {
								detail = data.message;
							} else if (data.error) {
								detail = data.error;
							} else if (data.detail) {
								detail = data.detail;
							}

							if (detail) {
								errorMsg += '：' + detail;
							}
						}

						// 自动检查Cookie状态（如果是相关错误）
						if (err.isRegionRestricted || err.isLoginRequired || err.isCookieIssue) {
							this.checkCookieStatus();
						}

						uni.showToast({
							title: errorMsg,
							icon: 'none',
							duration: 3000
						});
						this.loading = false;
					});
			},

			// 显示Cookie选项
			showCookieOptions() {
				this.showCookieManager = true;
				this.showBrowserSelect = false;
			},

			// 检查Cookie状态
			checkCookieStatus() {
				this.loading = true;
				youtubeApi.checkCookie()
					.then(res => {
						this.cookieStatus = res.data.cookie_valid;
						this.cookieTestVideo = res.data.test_video || null;
						this.cookieFilePath = res.data.path || '';
						this.loading = false;

						if (!res.data.cookie_valid) {
							uni.showModal({
								title: 'Cookie无效',
								content: '请上传有效的Cookie文件，否则某些视频可能无法下载',
								showCancel: false
							});
						}
					})
					.catch(err => {
						console.error('检查Cookie状态失败:', err);
						this.cookieStatus = false;
						this.loading = false;
					});
			},

			// 上传Cookie文件
			uploadCookieFile() {
				uni.chooseFile({
					count: 1,
					type: 'file',
					extension: ['.txt'],
					success: (res) => {
						const tempFilePath = res.tempFilePaths[0];
						const formData = new FormData();
						formData.append('cookie_file', {
							uri: tempFilePath,
							type: 'text/plain',
							name: 'youtube_cookies.txt'
						});

						this.loading = true;
						youtubeApi.uploadCookie(formData)
							.then(res => {
								this.cookieStatus = res.data.cookie_valid;
								this.cookieTestVideo = res.data.test_video || null;
								this.cookieFilePath = res.data.path || '';

								uni.showToast({
									title: res.data.message || 'Cookie上传成功',
									icon: 'success'
								});
								this.loading = false;
							})
							.catch(err => {
								console.error('上传Cookie失败:', err);
								uni.showToast({
									title: err.message || '上传Cookie失败',
									icon: 'none'
								});
								this.loading = false;
							});
					}
				});
			},

			// 从浏览器导出Cookie
			exportBrowserCookies(browser) {
				this.loading = true;
				this.showBrowserSelect = false;

				youtubeApi.exportBrowserCookies({
						browser
					})
					.then(res => {
						this.cookieStatus = res.data.cookie_valid;
						this.cookieTestVideo = res.data.test_video || null;
						this.cookieFilePath = res.data.path || '';

						uni.showToast({
							title: res.data.message || 'Cookie导出成功',
							icon: 'success'
						});
						this.loading = false;
					})
					.catch(err => {
						console.error('从浏览器导出Cookie失败:', err);
						uni.showToast({
							title: err.message || '从浏览器导出Cookie失败',
							icon: 'none'
						});
						this.loading = false;
					});
			},

			// 复制直接下载链接
			copyDirectUrl() {
				if (!this.videoInfo || !this.videoInfo.direct_url) return;

				// 根据当前选择的格式，可能会复制特定格式的链接
				let urlToCopy = this.videoInfo.direct_url;

				// 如果选择了特定格式，尝试找到对应的链接
				if (this.selectedFormat === 'specific' && this.videoInfo.formats && this.videoInfo.formats.length > 0) {
					const selectedFormat = this.videoInfo.formats[this.formatIndex];
					if (selectedFormat && selectedFormat.url && selectedFormat.format_id) {
						urlToCopy = selectedFormat.url;
					}
				}

				uni.setClipboardData({
					data: urlToCopy,
					success: () => {
						uni.showToast({
							title: '链接已复制',
							icon: 'success'
						});
					}
				});
			},

			// 打开直接下载链接
			openDirectUrl(item) {
				if (!item || (!item.direct_url && !item.media_url)) {
					console.error('下载链接为空:', item);
					uni.showToast({
						title: '无效的下载链接',
						icon: 'none'
					});
					return;
				}

				// 检查URL格式
				let downloadUrl = item.direct_url || item.media_url;
				console.log('原始下载链接:', downloadUrl);

				// 确保URL是正确格式
				if (!downloadUrl.startsWith('http')) {
					// 尝试补充基础URL
					if (downloadUrl.startsWith('/')) {
						// 如果是相对路径，使用完整URL
						downloadUrl = MEDIA_URL + downloadUrl;
					} else {
						downloadUrl = MEDIA_URL + '/' + downloadUrl;
					}
					console.log('修正后的下载链接:', downloadUrl);
				}

				// 询问用户下载选项
				uni.showActionSheet({
					itemList: ['直接下载', '使用代理下载', '浏览器打开', '内置浏览器打开'],
					success: (res) => {
						switch (res.tapIndex) {
							case 0: // 直接下载
								this.startDirectDownload({
									direct_url: downloadUrl,
									youtube_video: item
								});
								break;
							case 1: // 使用代理下载
								this.startDirectDownload({
									direct_url: `${this.proxyUrl}?url=${encodeURIComponent(downloadUrl)}`,
									youtube_video: item
								});
								break;
							case 2: // 浏览器打开
								plus.runtime.openURL(downloadUrl);
								break;
							case 3: // 内置浏览器打开
								this.openInWebView(downloadUrl);
								break;
						}
					}
				});
			},

			// 开始直接下载
			startDirectDownload(data) {
				console.log('开始直接下载，数据:', JSON.stringify(data));

				if (!data || !data.direct_url) {
					console.error('直接下载失败: 无法获取下载链接', data);
					uni.showToast({
						title: '获取下载链接失败',
						icon: 'none'
					});
					return;
				}

				// 确保URL是正确格式
				let downloadUrl = data.direct_url;
				if (!downloadUrl.startsWith('http')) {
					// 尝试补充基础URL
					if (downloadUrl.startsWith('/')) {
						// 如果是相对路径，使用完整URL
						downloadUrl = MEDIA_URL + downloadUrl;
					} else {
						downloadUrl = MEDIA_URL + '/' + downloadUrl;
					}
					console.log('修正后的下载链接:', downloadUrl);
					data.direct_url = downloadUrl;
				}

				// 设置下载信息
				this.directDownloadInfo = {
					title: data.youtube_video ? data.youtube_video.title : (this.videoInfo.title || '未知视频'),
					size: data.youtube_video ? data.youtube_video.file_size : '',
					thumbnail: data.youtube_video ? data.youtube_video.thumbnail_url : this.videoInfo.thumbnail,
					tempFilePath: ''
				};

				console.log('下载信息设置完成:', JSON.stringify(this.directDownloadInfo));

				// 显示下载进度模态框
				this.showDirectDownloadModal = true;
				this.downloadProgress = 0;
				this.downloadSpeed = '准备下载...';
				this.downloadComplete = false;

				// 获取文件扩展名
				const url = data.direct_url;
				const ext = this.getFileExtension(url);

				// 设置文件名
				const fileName = `${this.directDownloadInfo.title.replace(/[\/\\:*?"<>|]/g, '_')}.${ext}`;
				console.log('准备下载文件:', fileName, '链接:', url);

				try {
					// 创建下载任务
					const downloadTask = uni.downloadFile({
						url: data.direct_url,
						filename: fileName, // 指定文件名
						success: (res) => {
							console.log('下载完成，状态码:', res.statusCode, '临时文件路径:', res.tempFilePath);
							if (res.statusCode === 200) {
								this.directDownloadInfo.tempFilePath = res.tempFilePath;
								this.downloadComplete = true;
								this.downloadProgress = 100;
								this.downloadSpeed = '下载完成';

								// 保存到相册/文件夹
								if (ext === 'mp3' || ext === 'mp4') {
									uni.saveFile({
										tempFilePath: res.tempFilePath,
										success: (saveRes) => {
											console.log('文件保存成功:', saveRes.savedFilePath);
											this.directDownloadInfo.tempFilePath = saveRes
												.savedFilePath;
											uni.showToast({
												title: '文件已保存',
												icon: 'success'
											});
										},
										fail: (err) => {
											console.error('保存文件失败:', err);
											uni.showToast({
												title: '文件保存失败: ' + (err.errMsg || JSON
													.stringify(err)),
												icon: 'none'
											});
										}
									});
								}
							} else {
								console.error('下载失败，HTTP状态码:', res.statusCode);
								uni.showToast({
									title: '下载失败: 状态码 ' + res.statusCode,
									icon: 'none'
								});
							}
						},
						fail: (err) => {
							console.error('下载请求失败:', err);
							this.fallbackToBackendDownload('下载失败: ' + (err.errMsg || JSON.stringify(err)));
						}
					});

					// 监听下载进度
					let lastProgressUpdateTime = Date.now();
					let lastDownloadedSize = 0;

					downloadTask.onProgressUpdate((res) => {
						this.downloadProgress = res.progress;

						// 计算下载速度
						const now = Date.now();
						const timeDiff = (now - lastProgressUpdateTime) / 1000; // 秒

						if (timeDiff > 0.5) { // 每0.5秒更新一次速度
							const downloadedSize = res.totalBytesWritten;
							const downloadedDiff = downloadedSize - lastDownloadedSize;
							const speed = downloadedDiff / timeDiff; // 字节每秒

							this.downloadSpeed = this.formatSpeed(speed);

							lastProgressUpdateTime = now;
							lastDownloadedSize = downloadedSize;
						}
					});

					// 保存下载任务引用
					this.downloadTask = downloadTask;
				} catch (error) {
					console.error('创建下载任务异常:', error);
					uni.showToast({
						title: '启动下载失败: ' + (error.message || JSON.stringify(error)),
						icon: 'none',
						duration: 3000
					});
				}
			},

			// 获取文件扩展名
			getFileExtension(url) {
				// 尝试从URL中提取文件扩展名
				const urlPath = url.split('?')[0]; // 移除查询参数
				const ext = urlPath.substring(urlPath.lastIndexOf('.') + 1).toLowerCase();

				// 检查是否是合法的视频或音频扩展名
				const validExts = ['mp4', 'mp3', 'webm', 'mkv', 'avi', 'mov'];
				if (validExts.includes(ext)) {
					return ext;
				}

				// 如果不是有效扩展名，默认返回mp4
				return 'mp4';
			},

			// 取消直接下载
			cancelDirectDownload() {
				if (this.downloadTask && !this.downloadComplete) {
					this.downloadTask.abort();
				}
				this.showDirectDownloadModal = false;
				this.downloadTask = null;
			},

			// 打开已下载的文件
			openDownloadedFile() {
				if (!this.directDownloadInfo.tempFilePath) return;

				plus.runtime.openFile(this.directDownloadInfo.tempFilePath, {}, (err) => {
					uni.showToast({
						title: '无法打开文件',
						icon: 'none'
					});
				});
			},

			// 格式化下载速度
			formatSpeed(bytesPerSecond) {
				if (bytesPerSecond < 1024) {
					return bytesPerSecond.toFixed(0) + ' B/s';
				} else if (bytesPerSecond < 1024 * 1024) {
					return (bytesPerSecond / 1024).toFixed(1) + ' KB/s';
				} else {
					return (bytesPerSecond / (1024 * 1024)).toFixed(1) + ' MB/s';
				}
			},

			// 添加回退到后端下载的方法
			fallbackToBackendDownload(errorMessage) {
				uni.showModal({
					title: '直接下载失败',
					content: errorMessage + '\n\n是否尝试通过服务器下载？',
					success: (res) => {
						if (res.confirm) {
							this.downloadType = 'backend';
							this.showDirectDownloadModal = false;
							this.createDownloadTask();
						} else {
							uni.showToast({
								title: '下载取消',
								icon: 'none'
							});
							this.showDirectDownloadModal = false;
						}
					}
				});
			},

			// 添加打开视频链接到WebView的方法
			openInWebView(url) {
				if (!url) return;

				// 将URL编码后传递给WebView页面
				const encodedUrl = encodeURIComponent(url);
				uni.navigateTo({
					url: `/pages/youtube/webview?url=${encodedUrl}`
				});
			},

			// 在methods部分添加处理点击事件的函数
			onDownloadItemClick(item) {
				console.log('下载项被点击:', item);

				// 显示加载提示
				uni.showLoading({
					title: '准备播放...'
				});

				// 延迟执行以确保UI响应
				setTimeout(() => {
					// 直接调用导航到视频页面
					this.navigateToVideoPage(item);
					uni.hideLoading();
				}, 100);
			},

			// 格式化日期
			formatDate(dateString) {
				if (!dateString) return '';

				try {
					const date = new Date(dateString);
					const now = new Date();
					const diff = Math.floor((now - date) / 1000); // 秒数差

					// 如果是今天
					if (diff < 86400 && date.getDate() === now.getDate()) {
						// 1小时内
						if (diff < 3600) {
							const minutes = Math.floor(diff / 60);
							return minutes <= 0 ? '刚刚' : `${minutes}分钟前`;
						}
						// 今天内的其他时间
						const hours = Math.floor(diff / 3600);
						return `${hours}小时前`;
					}

					// 昨天
					const yesterday = new Date(now);
					yesterday.setDate(yesterday.getDate() - 1);
					if (date.getDate() === yesterday.getDate() &&
						date.getMonth() === yesterday.getMonth() &&
						date.getFullYear() === yesterday.getFullYear()) {
						return '昨天';
					}

					// 一周内
					if (diff < 604800) {
						const days = Math.floor(diff / 86400);
						return `${days}天前`;
					}

					// 超过一周，显示具体日期
					return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
				} catch (e) {
					console.error('日期格式化错误:', e);
					return dateString;
				}
			},

			// 确认删除视频
			confirmDeleteVideo(item) {
				uni.showModal({
					title: '确认删除',
					content: `确定要删除视频 "${item.title || '未知标题'}" 吗？`,
					confirmText: '删除',
					confirmColor: '#f44336',
					success: (res) => {
						if (res.confirm) {
							this.deleteVideo(item);
						}
					}
				});
			},

			// 删除视频
			deleteVideo(item) {
				uni.showLoading({
					title: '正在删除...'
				});

				// 这里应该调用API删除视频
				// 示例：假设有一个删除API
				// youtubeApi.deleteVideo(item.id)
				//   .then(() => {
				//     this.loadDownloadList();
				//     uni.showToast({
				//       title: '删除成功',
				//       icon: 'success'
				//     });
				//   })
				//   .catch(err => {
				//     uni.showToast({
				//       title: '删除失败: ' + (err.message || '未知错误'),
				//       icon: 'none'
				//     });
				//   });

				// 临时解决方案：直接从列表中移除
				const index = this.downloadList.findIndex(i => i.id === item.id);
				if (index !== -1) {
					this.downloadList.splice(index, 1);
				}

				setTimeout(() => {
					uni.hideLoading();
					uni.showToast({
						title: '删除成功',
						icon: 'success'
					});
				}, 500);
			},

			// 格式化观看次数
			formatViewCount(count) {
				if (!count) return '';

				if (count >= 1000000) {
					return (count / 1000000).toFixed(1) + '百万次播放';
				} else if (count >= 10000) {
					return (count / 10000).toFixed(1) + '万次播放';
				} else if (count >= 1000) {
					return (count / 1000).toFixed(1) + '千次播放';
				} else {
					return count + '次播放';
				}
			},

			// 格式化视频时长
			formatDuration(seconds) {
				if (!seconds) return '';

				const hours = Math.floor(seconds / 3600);
				const minutes = Math.floor((seconds % 3600) / 60);
				const remainingSeconds = seconds % 60;

				if (hours > 0) {
					return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
				} else {
					return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
				}
			},
		}
	}
</script>

<style>
	.youtube-container {
		width: 100%;
		height: 100%;
		background-color: #f8f8f8;
	}

	.h-carousel {
		position: relative;
		height: 150px;
		background-color: #dd4b39;
	}

	.header {
		position: relative;
		z-index: 10;
		padding: 30px 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.page-title {
		color: #fff;
		font-size: 24px;
		font-weight: bold;
	}

	.cookie-status {
		padding: 6px 12px;
		border-radius: 20px;
		font-size: 12px;
		cursor: pointer;
	}

	.cookie-valid {
		background-color: #4CAF50;
		color: white;
	}

	.cookie-invalid {
		background-color: #f44336;
		color: white;
	}

	.h-wave1,
	.h-wave2 {
		position: absolute;
		bottom: 0;
		transition-duration: 0.4s, 0.4s;
		z-index: 1;
	}

	.h-wave1 {
		height: 75px;
		width: 100%;
	}

	.h-wave2 {
		height: 90px;
		width: calc(100% + 100px);
		left: -100px;
	}

	.content {
		padding: 20px;
		margin-top: -20px;
		position: relative;
		z-index: 2;
	}

	.url-input-container {
		display: flex;
		background-color: white;
		border-radius: 12px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		padding: 10px;
		margin-bottom: 20px;
	}

	.url-input {
		flex: 1;
		height: 40px;
		padding: 0 10px;
		font-size: 14px;
	}

	.fetch-button {
		width: 100px;
		height: 40px;
		background-color: #dd4b39;
		color: white;
		border: none;
		border-radius: 5px;
		font-size: 14px;
	}

	/* Cookie管理器样式 */
	.cookie-manager {
		background-color: white;
		border-radius: 12px;
		padding: 15px;
		margin-bottom: 20px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;
	}

	.section-close {
		font-size: 24px;
		color: #666;
		padding: 0 5px;
	}

	.cookie-info {
		margin-bottom: 15px;
	}

	.cookie-info-text {
		display: block;
		margin-bottom: 5px;
		font-size: 14px;
	}

	.cookie-info-text.small {
		font-size: 12px;
		color: #666;
	}

	.text-success {
		color: #4CAF50;
	}

	.text-danger {
		color: #f44336;
	}

	.cookie-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-bottom: 15px;
	}

	.cookie-btn {
		flex: 1;
		min-width: 100px;
		height: 36px;
		background-color: #f1f1f1;
		color: #333;
		border: none;
		border-radius: 5px;
		font-size: 13px;
	}

	.browser-select {
		margin-top: 15px;
		padding-top: 15px;
		border-top: 1px solid #eee;
	}

	.browser-select-title {
		display: block;
		font-size: 14px;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.browser-options {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.browser-option {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 70px;
		padding: 10px;
		background-color: #f8f8f8;
		border-radius: 8px;
	}

	.browser-icon {
		font-size: 24px;
		margin-bottom: 5px;
	}

	.browser-name {
		font-size: 12px;
	}

	.video-info {
		background-color: white;
		border-radius: 12px;
		padding: 15px;
		margin-bottom: 20px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.info-card {
		display: flex;
		margin-bottom: 15px;
	}

	.thumbnail {
		width: 120px;
		height: 90px;
		margin-right: 15px;
		border-radius: 8px;
		overflow: hidden;
	}

	.thumbnail image {
		width: 100%;
		height: 100%;
	}

	.info-details {
		flex: 1;
	}

	.video-title {
		font-size: 16px;
		font-weight: bold;
		display: block;
		margin-bottom: 5px;
	}

	.video-uploader,
	.video-duration {
		font-size: 14px;
		color: #666;
		display: block;
		margin-bottom: 5px;
	}

	.section-title {
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 10px;
		display: block;
	}

	.format-selection {
		margin-bottom: 15px;
	}

	.radio-item {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}

	.radio-item text {
		margin-left: 8px;
	}

	.specific-format {
		margin-top: 10px;
	}

	.picker-view {
		background-color: #f1f1f1;
		padding: 10px;
		border-radius: 5px;
	}

	.download-options {
		margin-bottom: 15px;
	}

	.checkbox-item {
		display: flex;
		align-items: center;
	}

	.checkbox-item text {
		margin-left: 8px;
		font-size: 14px;
	}

	.download-button {
		background-color: #dd4b39;
		color: white;
		border: none;
		border-radius: 5px;
		font-size: 16px;
		height: 45px;
		line-height: 45px;
		margin-top: 15px;
	}

	.direct-url {
		margin-top: 15px;
		padding-top: 15px;
		border-top: 1px solid #eee;
	}

	.url-box {
		display: flex;
		background-color: #f1f1f1;
		padding: 10px;
		border-radius: 5px;
	}

	.url-text {
		flex: 1;
		font-size: 12px;
		color: #666;
		word-break: break-all;
	}

	.url-copy {
		padding-left: 10px;
		color: #dd4b39;
		font-size: 14px;
	}

	/* 下载列表样式 */
	.download-list {
		background-color: white;
		border-radius: 12px;
		padding: 20px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		margin-top: 20px;
	}

	.download-list-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
		padding-bottom: 10px;
		border-bottom: 1px solid #eee;
	}

	.download-count {
		font-size: 13px;
		color: #666;
		background-color: #f0f0f0;
		padding: 2px 8px;
		border-radius: 10px;
	}

	.download-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
	}

	.download-item {
		display: flex;
		flex-direction: column;
		width: calc((100% - 20px) / 2);
		background-color: #f8f8f8;
		border-radius: 12px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease;
		cursor: pointer;
		overflow: hidden;
	}

	/* 在较小屏幕上每行显示一个项目 */
	@media (max-width: 600px) {
		.download-item {
			width: 100%;
		}
	}

	.download-item:hover {
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
		transform: translateY(-5px);
	}

	.download-thumb {
		width: 100%;
		height: 160px;
		overflow: hidden;
		position: relative;
	}

	.download-thumb image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.5s ease;
	}

	.download-item:hover .download-thumb image {
		transform: scale(1.05);
	}

	.download-play-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 70%);
		display: flex;
		justify-content: center;
		align-items: center;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.download-item:hover .download-play-overlay {
		opacity: 1;
	}

	.play-icon {
		font-size: 50px;
		color: white;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	}

	.download-info {
		flex: 1;
		padding: 15px;
		display: flex;
		flex-direction: column;
	}

	.download-title {
		font-size: 15px;
		font-weight: bold;
		color: #333;
		margin-bottom: 10px;
		/* 文本溢出处理 */
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		line-height: 1.4;
		max-height: 2.8em;
	}

	.download-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
		color: #666;
	}

	.download-file-info {
		font-size: 12px;
		background-color: #e8f5e9;
		color: #388e3c;
		padding: 2px 8px;
		border-radius: 10px;
	}

	.download-date {
		font-size: 12px;
		color: #999;
	}

	.download-actions {
		display: flex;
		justify-content: space-between;
		margin-top: auto;
	}

	.action-play,
	.action-delete {
		flex: 1;
		font-size: 14px;
		padding: 8px 0;
		border-radius: 4px;
		text-align: center;
		transition: all 0.2s;
	}

	.action-play {
		background-color: #4CAF50;
		color: white;
		margin-right: 10px;
	}

	.action-play:hover {
		background-color: #388e3c;
	}

	.action-delete {
		background-color: rgba(244, 67, 54, 0.1);
		color: #f44336;
	}

	.action-delete:hover {
		background-color: #f44336;
		color: white;
	}

	.empty-list {
		padding: 40px 0;
		text-align: center;
		color: #999;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.empty-image {
		width: 120px;
		height: 120px;
		margin-bottom: 15px;
		opacity: 0.7;
	}

	.empty-list text {
		font-size: 16px;
		margin-bottom: 8px;
	}

	.empty-tip {
		font-size: 14px;
		color: #999;
		max-width: 80%;
		line-height: 1.5;
	}

	/* 状态徽章样式 */
	.status-badge {
		padding: 3px 6px;
		border-radius: 10px;
		font-size: 12px;
		margin-left: 8px;
	}

	.status-completed {
		background-color: #4CAF50;
		color: #fff;
	}

	.status-downloading {
		background-color: #2196F3;
		color: #fff;
		animation: pulse 1.5s infinite;
	}

	@keyframes pulse {
		0% {
			opacity: 1;
		}

		50% {
			opacity: 0.7;
		}

		100% {
			opacity: 1;
		}
	}

	.download-file-info {
		font-size: 12px;
		color: #666;
		margin: 5px 0;
		display: block;
	}

	.loading {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}

	.loading text {
		background-color: white;
		padding: 15px 20px;
		border-radius: 5px;
	}

	/* 直接下载模态框样式 */
	.direct-download-modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.modal-content {
		width: 85%;
		background-color: white;
		border-radius: 12px;
		padding: 20px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.modal-title {
		font-size: 18px;
		font-weight: bold;
		color: #333;
	}

	.modal-close {
		font-size: 24px;
		color: #666;
		padding: 0 5px;
	}

	.video-download-info {
		display: flex;
		margin-bottom: 20px;
	}

	.download-video-thumb {
		width: 90px;
		height: 65px;
		border-radius: 6px;
		overflow: hidden;
		margin-right: 15px;
	}

	.download-video-thumb image {
		width: 100%;
		height: 100%;
	}

	.download-video-details {
		flex: 1;
	}

	.download-video-title {
		font-size: 15px;
		font-weight: 500;
		color: #333;
		display: block;
		margin-bottom: 5px;
		line-height: 1.4;
	}

	.download-video-size {
		font-size: 13px;
		color: #666;
	}

	.download-progress-container {
		margin-bottom: 20px;
	}

	.download-progress-bar {
		width: 100%;
		height: 8px;
		background-color: #f0f0f0;
		border-radius: 4px;
		overflow: hidden;
		position: relative;
	}

	.download-progress-fill {
		height: 100%;
		background-color: #dd4b39;
		border-radius: 4px;
		transition: width 0.5s ease-in-out;
		position: relative;
	}

	.download-progress-fill.active {
		background: linear-gradient(90deg, #dd4b39, #e47365, #dd4b39);
		background-size: 200% 100%;
		animation: progress-gradient 2s linear infinite;
	}

	@keyframes progress-gradient {
		0% {
			background-position: 0% 50%;
		}

		100% {
			background-position: 100% 50%;
		}
	}

	.download-progress-text {
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		color: #666;
	}

	.download-actions-row {
		display: flex;
		justify-content: space-between;
	}

	.download-action-btn {
		flex: 1;
		height: 40px;
		border: none;
		border-radius: 5px;
		font-size: 14px;
		margin: 0 5px;
	}

	.download-action-btn.cancel {
		background-color: #f1f1f1;
		color: #333;
	}

	.download-action-btn.primary {
		background-color: #dd4b39;
		color: white;
	}

	.download-action-btn:disabled {
		opacity: 0.7;
	}

	.browser-note {
		margin-top: 10px;
		font-size: 12px;
		color: #666;
		text-align: center;
	}

	.options-info {
		margin-top: 5px;
	}

	.options-help {
		font-size: 12px;
		color: #666;
		font-style: italic;
	}

	.download-title-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 5px;
	}

	@keyframes downloadPulse {
		0% {
			background-color: #f8f8f8;
		}

		50% {
			background-color: #e9f5ff;
		}

		100% {
			background-color: #f8f8f8;
		}
	}

	.section-tip {
		display: block;
		font-size: 12px;
		color: #777;
		margin-bottom: 15px;
	}
</style>