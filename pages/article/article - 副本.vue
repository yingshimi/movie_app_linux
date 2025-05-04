<template>
	<view class="article-container">
		<!-- 加载状态 -->
		<view v-if="loading" class="loading-container">
			<view class="loading-spinner"></view>
			<text class="loading-text">加载中...</text>
		</view>

		<!-- 错误提示 -->
		<view v-else-if="error" class="error-container">
			<text class="error-text">{{errorMessage}}</text>
			<view class="retry-button" @tap="fetchArticle">重试</view>
		</view>

		<!-- 文章内容 -->
		<block v-else>
			<!-- 文章头部 -->
			<view class="article-header">
				<view class="article-cover-placeholder" :style="{ backgroundColor: '#e0e0e0' }">
					<image class="article-cover" :src="article.cover_img" mode="aspectFill"></image>
				</view>
				<view class="article-info">
					<text class="article-title">{{article.title}}</text>
					<view class="article-meta">
						<view class="author-info">
							<view class="author-avatar-placeholder" :style="{ backgroundColor: '#e0e0e0' }">
								<image class="author-avatar" :src="article.author.avatar || '/static/images/default-avatar.jpg'" mode="aspectFill"></image>
							</view>
							<text class="author-name">{{article.author.username}}</text>
						</view>
						<view class="article-stats">
							<text class="publish-date">{{formatDate(article.publish_date)}}</text>
							<text class="read-count">{{article.read_count}}阅读</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 文章内容 -->
			<view class="article-content">
				<rich-text :nodes="article.content" class="rich-content"></rich-text>
			</view>

			<!-- 文章底部 -->
			<view class="article-footer">
				<view class="interaction-bar">
					<view class="interaction-item" @tap="handleLike">
						<view class="icon-placeholder"
							:style="{ backgroundColor: article.is_liked ? '#ffebee' : '#f5f5f5' }">
							<image class="icon-image"
								:src="article.is_liked ? '/static/images/icon-liked.png' : '/static/images/icon-like.png'">
							</image>
						</view>
						<text class="interaction-count">{{article.like_count}}</text>
					</view>
					<view class="interaction-item" @tap="handleComment">
						<view class="icon-placeholder" :style="{ backgroundColor: '#f0f7ff' }">
							<image class="icon-image" src="/static/images/icon-comment.png"></image>
						</view>
						<text class="interaction-count">{{article.comment_count}}</text>
					</view>
					<view class="interaction-item" @tap="handleShare">
						<view class="icon-placeholder" :style="{ backgroundColor: '#f1f8e9' }">
							<image class="icon-image" src="/static/images/icon-share.png"></image>
						</view>
						<text class="interaction-count">分享</text>
					</view>
				</view>

				<!-- 相关文章 -->
				<view v-if="article.related_articles && article.related_articles.length > 0" class="related-articles">
					<text class="section-title">相关文章</text>
					<view class="related-list">
						<view v-for="(item, index) in article.related_articles" :key="index" class="related-item"
							@tap="navigateToArticle(item.id)">
							<view class="related-image-placeholder" :style="{ backgroundColor: '#e0e0e0' }">
								<image class="related-image" :src="item.cover_img" mode="aspectFill"></image>
							</view>
							<text class="related-title">{{item.title}}</text>
						</view>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import { getArticle, likeArticle, shareArticle } from '@/static/api/articles.js';
	
	export default {
		data() {
			return {
				article: {
					content: [] // 确保初始化content为数组
				}, 
				loading: true,
				error: false,
				errorMessage: '加载文章失败，请稍后重试',
				articleId: 15
			}
		},
		onLoad(options) {
			// 从路由参数中获取文章ID
			if (options.id) {
				this.articleId = options.id;
				this.fetchArticle();
			} else {
				this.error = true;
				this.errorMessage = '文章ID不存在';
				this.loading = false;
			}
		},
		methods: {
			// 获取文章详情
			fetchArticle() {
				this.loading = true;
				this.error = false;
				
				getArticle(this.articleId)
					.then(res => {
						// 确保文章数据正确处理
						this.article = res.data || res;
						
						// 确保content是字符串
						if (!this.article.content) {
							this.article.content = '';
						} else if (typeof this.article.content !== 'string') {
							this.article.content = String(this.article.content);
						}
						
						console.log('文章数据:', this.article);
					})
					.catch(err => {
						this.error = true;
						this.errorMessage = '获取文章失败，请稍后重试';
						console.error('获取文章失败:', err);
					})
					.finally(() => {
						this.loading = false;
					});
			},
			
			// 格式化日期
			formatDate(dateString) {
				if (!dateString) return '';
				
				const date = new Date(dateString);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				
				return `${year}-${month}-${day}`;
			},

			// 预览图片
			previewImage(url) {
				if (!url) return;
				
				const urls = this.article.content
					.filter(item => item.type === 'image' && item.url)
					.map(item => item.url);

				if (urls.length > 0) {
					uni.previewImage({
						current: url,
						urls: urls
					});
				}
			},

			// 复制代码
			copyCode(code) {
				if (!code) return;
				
				uni.setClipboardData({
					data: code,
					success: () => {
						uni.showToast({
							title: '代码已复制',
							icon: 'success'
						});
					}
				});
			},

			// 点赞
			handleLike() {
				// 检查用户是否登录
				const token = uni.getStorageSync('token');
				if (!token) {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					});
					return;
				}
				
				// 使用接口函数发送点赞请求
				likeArticle(this.article.id)
					.then(res => {
						// 更新点赞状态和数量
						this.article.is_liked = res.data.status === 'liked';
						this.article.like_count = res.data.like_count;
						
						uni.showToast({
							title: this.article.is_liked ? '点赞成功' : '已取消点赞',
							icon: 'success'
						});
					})
					.catch(err => {
						uni.showToast({
							title: '操作失败',
							icon: 'none'
						});
						console.error('点赞失败:', err);
					});
			},

			// 评论
			handleComment() {
				uni.navigateTo({
					url: `/pages/comment/comment?articleId=${this.article.id}`
				});
			},

			// 分享
			handleShare() {
				// 获取文章摘要
				let summary = '';
				if (this.article.content && this.article.content.length > 0) {
					const textBlock = this.article.content.find(block => block.type === 'text');
					if (textBlock) {
						summary = textBlock.content.substring(0, 40) + '...';
					}
				}
				
				// 调用分享接口记录分享行为
				shareArticle(this.article.id)
					.then(() => {
						console.log('分享记录成功');
					})
					.catch(err => {
						console.error('分享记录失败:', err);
					});
				
				// 调用系统分享
				uni.share({
					provider: 'weixin',
					scene: 'WXSceneSession',
					type: 0,
					title: this.article.title,
					summary: summary,
					imageUrl: this.article.cover_img,
					success: function(res) {
						console.log('分享成功：', res);
					},
					fail: function(err) {
						console.log('分享失败：', err);
					}
				});
			},

			// 跳转到相关文章
			navigateToArticle(id) {
				if (!id) return;
				
				uni.navigateTo({
					url: `/pages/article/article-detail?id=${id}`
				});
			}
		}
	}
</script>

<style>
.article-container {
	display: flex;
	flex-direction: column;
	padding-bottom: 30rpx;
	background-color: #f8f8f8;
	min-height: 100vh;
}

/* 加载状态样式 */
.loading-container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 300rpx;
	margin: 100rpx 0;
}

.loading-container .loading-spinner {
	width: 80rpx;
	height: 80rpx;
	border: 6rpx solid #f3f3f3;
	border-top: 6rpx solid #007aff;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

.loading-container .loading-text {
	margin-top: 30rpx;
	font-size: 28rpx;
	color: #666;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

/* 错误提示样式 */
.error-container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 300rpx;
	margin: 100rpx 0;
}

.error-container .error-text {
	font-size: 28rpx;
	color: #ff3b30;
	margin-bottom: 30rpx;
}

.error-container .retry-button {
	padding: 16rpx 40rpx;
	background-color: #007aff;
	color: #fff;
	font-size: 28rpx;
	border-radius: 8rpx;
}

/* 文章头部样式 */
.article-header {
	position: relative;
	width: 100%;
}

.article-header .article-cover-placeholder {
	width: 100%;
	height: 400rpx;
	position: relative;
	overflow: hidden;
}

.article-header .article-cover-placeholder .article-cover {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
}

.article-header .article-info {
	position: relative;
	margin-top: -60rpx;
	padding: 30rpx;
	background-color: #fff;
	border-radius: 20rpx 20rpx 0 0;
	box-shadow: 0 -4rpx 10rpx rgba(0, 0, 0, 0.05);
}

.article-header .article-info .article-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #333;
	line-height: 1.4;
	margin-bottom: 20rpx;
}

.article-header .article-info .article-meta {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.article-header .article-info .article-meta .author-info {
	display: flex;
	align-items: center;
}

.article-header .article-info .article-meta .author-info .author-avatar-placeholder {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	overflow: hidden;
	position: relative;
	margin-right: 15rpx;
}

.article-header .article-info .article-meta .author-info .author-avatar-placeholder .author-avatar {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
}

.article-header .article-info .article-meta .author-info .author-name {
	font-size: 28rpx;
	color: #666;
}

.article-header .article-info .article-meta .article-stats {
	display: flex;
	align-items: center;
}

.article-header .article-info .article-meta .article-stats .publish-date,
.article-header .article-info .article-meta .article-stats .read-count {
	font-size: 24rpx;
	color: #999;
	margin-left: 20rpx;
}

/* 文章内容样式 */
.article-content {
	background-color: #fff;
	padding: 30rpx;
}

.article-content .rich-content {
	line-height: 1.8;
	font-size: 30rpx;
	color: #333;
	text-align: justify;
}

.article-content .rich-content :deep(img) {
	max-width: 100%;
	height: auto;
	border-radius: 10rpx;
	margin: 20rpx 0;
}

.article-content .rich-content :deep(p) {
	margin-bottom: 20rpx;
}

.article-content .rich-content :deep(h1),
.article-content .rich-content :deep(h2),
.article-content .rich-content :deep(h3),
.article-content .rich-content :deep(h4),
.article-content .rich-content :deep(h5),
.article-content .rich-content :deep(h6) {
	margin: 30rpx 0 20rpx;
	font-weight: bold;
	color: #333;
}

.article-content .rich-content :deep(pre) {
	margin: 20rpx 0;
	padding: 20rpx;
	background-color: #f5f5f5;
	border-radius: 10rpx;
	overflow-x: auto;
	font-family: 'Courier New', monospace;
	font-size: 26rpx;
	line-height: 1.5;
}

.article-content .rich-content :deep(blockquote) {
	margin: 20rpx 0;
	padding: 20rpx 30rpx;
	border-left: 8rpx solid #007aff;
	background-color: #f0f7ff;
	font-style: italic;
	color: #666;
}

.article-content .rich-content :deep(ul),
.article-content .rich-content :deep(ol) {
	margin: 20rpx 0;
	padding-left: 40rpx;
}

.article-content .rich-content :deep(li) {
	margin-bottom: 10rpx;
}

.article-content .rich-content :deep(a) {
	color: #007aff;
	text-decoration: none;
}

.article-content .rich-content :deep(a:hover) {
	text-decoration: underline;
}

/* 文章底部样式 */
.article-footer {
	margin-top: 20rpx;
}

.article-footer .interaction-bar {
	display: flex;
	justify-content: space-around;
	align-items: center;
	padding: 20rpx 0;
	background-color: #fff;
	border-radius: 10rpx;
	margin: 0 20rpx 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.article-footer .interaction-bar .interaction-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.article-footer .interaction-bar .interaction-item .icon-placeholder {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 10rpx;
}

.article-footer .interaction-bar .interaction-item .icon-placeholder .icon-image {
	width: 40rpx;
	height: 40rpx;
}

.article-footer .interaction-bar .interaction-item .interaction-count {
	font-size: 24rpx;
	color: #666;
}

.article-footer .related-articles {
	background-color: #fff;
	border-radius: 10rpx;
	margin: 0 20rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.article-footer .related-articles .section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.article-footer .related-articles .related-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.article-footer .related-articles .related-list .related-item {
	width: 48%;
	margin-bottom: 20rpx;
}

.article-footer .related-articles .related-list .related-item .related-image-placeholder {
	width: 100%;
	height: 160rpx;
	border-radius: 8rpx;
	position: relative;
	overflow: hidden;
	margin-bottom: 10rpx;
}

.article-footer .related-articles .related-list .related-item .related-image-placeholder .related-image {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
}

.article-footer .related-articles .related-list .related-item .related-title {
	font-size: 26rpx;
	color: #333;
	line-height: 1.4;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}</style>
</style>