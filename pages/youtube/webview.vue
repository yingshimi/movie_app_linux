<template>
	<view class="webview-container">
		<web-view :src="url" @message="handleMessage" @error="handleError"></web-view>
		
		<view class="loading-overlay" v-if="loading">
			<view class="loading-spinner"></view>
			<text class="loading-text">加载中...</text>
		</view>
		
		<view class="error-overlay" v-if="error">
			<image class="error-icon" src="/static/images/error.png" mode="aspectFit"></image>
			<text class="error-text">{{ errorMessage }}</text>
			<button class="retry-button" @click="retry">重试</button>
			<button class="back-button" @click="goBack">返回</button>
		</view>
		
		<view class="controls">
			<button class="control-button back" @click="goBack">返回</button>
			<button class="control-button browser" @click="openInBrowser">浏览器打开</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: '',
				originalUrl: '',
				loading: true,
				error: false,
				errorMessage: '加载失败'
			}
		},
		onLoad(options) {
			// 获取URL参数
			if (options.url) {
				this.originalUrl = decodeURIComponent(options.url);
				this.url = this.originalUrl;
				console.log('WebView加载URL:', this.url);
			} else {
				this.error = true;
				this.errorMessage = '未提供有效的URL';
			}
			
			// 添加页面标题
			uni.setNavigationBarTitle({
				title: '视频预览'
			});
		},
		methods: {
			// 处理WebView消息
			handleMessage(event) {
				console.log('WebView消息:', event);
			},
			
			// 处理WebView错误
			handleError(error) {
				console.error('WebView错误:', error);
				this.error = true;
				this.errorMessage = '加载失败: ' + (error.detail || '未知错误');
				this.loading = false;
			},
			
			// 重试加载
			retry() {
				this.error = false;
				this.loading = true;
				// 重新加载URL
				this.url = '';
				setTimeout(() => {
					this.url = this.originalUrl;
				}, 300);
			},
			
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},
			
			// 在浏览器中打开链接
			openInBrowser() {
				if (this.originalUrl) {
					plus.runtime.openURL(this.originalUrl);
				}
			}
		},
		// 监听页面首次渲染完成
		onReady() {
			// 延迟关闭加载状态，确保WebView有足够时间加载
			setTimeout(() => {
				this.loading = false;
			}, 1500);
		}
	}
</script>

<style>
	.webview-container {
		width: 100%;
		height: 100vh;
		position: relative;
	}
	
	web-view {
		width: 100%;
		height: 100%;
	}
	
	.loading-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, 0.9);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 100;
	}
	
	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid #f3f3f3;
		border-top: 3px solid #dd4b39;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 15px;
	}
	
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	
	.loading-text {
		font-size: 16px;
		color: #333;
	}
	
	.error-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 20px;
		z-index: 100;
	}
	
	.error-icon {
		width: 80px;
		height: 80px;
		margin-bottom: 20px;
	}
	
	.error-text {
		font-size: 16px;
		color: #333;
		text-align: center;
		margin-bottom: 20px;
	}
	
	.retry-button, .back-button {
		margin: 10px;
		padding: 8px 20px;
		background-color: #dd4b39;
		color: white;
		border: none;
		border-radius: 5px;
		font-size: 14px;
	}
	
	.back-button {
		background-color: #666;
	}
	
	.controls {
		position: absolute;
		bottom: 20px;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		padding: 0 20px;
		z-index: 50;
	}
	
	.control-button {
		padding: 8px 15px;
		background-color: rgba(0, 0, 0, 0.6);
		color: white;
		border: none;
		border-radius: 20px;
		font-size: 14px;
	}
	
	.control-button.back {
		background-color: rgba(221, 75, 57, 0.8);
	}
	
	.control-button.browser {
		background-color: rgba(0, 0, 0, 0.6);
	}
</style> 