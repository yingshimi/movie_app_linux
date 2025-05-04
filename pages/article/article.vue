<template>
	<view class="article-container">
<!-- 		<u-skeleton style="margin: 30rpx;" :rowsHeight="30" :titleHeight="28" rows="6" title v-if="loading"></u-skeleton> -->
		<!-- 文章内容 -->
		<block v-if="!loading">
			<!-- 文章头部 -->
			<view class="article-header">
				<!-- 				<view class="article-cover-placeholder" :style="{ backgroundColor: '#e0e0e0' }">
					<image class="article-cover" :src="article.cover_img" mode="aspectFill"></image>
				</view> -->
				<view class="article-info">
					<text class="article-title">{{article.title}}</text>
					<view class="article-meta">
						<view class="author-info">
							<view class="author-avatar-placeholder" :style="{ backgroundColor: '#e0e0e0' }">
								<image class="author-avatar"
									:src="article.author.avatar || '/static/images/default-avatar.jpg'"
									mode="aspectFill"></image>
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
				<!-- <rich-text :nodes="article.content" class="rich-content"></rich-text> -->
				<mp-html class="rich-content" :content="article.content" :tag-style="tagStyle" />
				<!-- <u-parse :content="article.content"></u-parse> -->
			</view>

			<!-- 文章底部 -->
			<view class="article-footer">


				<!-- 相关文章 -->

			</view>
		</block>
	</view>
</template>

<script>
	import {
		getArticle,
		likeArticle,
		shareArticle
	} from '@/static/api/articles.js';

	export default {
		data() {
			return {
				loading: true,
				article: {
					id: null,
					title: '',
					content: '',
					summary: '',
					cover_image_url: '',
					category: '',
					tags: [],
					author: {
						username: '',
						avatar: ''
					},
					is_published: false,
					publish_time: '',
					allow_comments: true,
					views: 0,
					likes: 0,
					comments_count: 0
				},
				tagStyle: {
					img: 'border-radius: 8px; display: block; margin: 0 auto; min-width: 100%; height: auto;'
				},
				error: false,
				errorMessage: '加载文章失败，请稍后重试',
				articleId: null
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
			}

		},
		methods: {
			// 获取文章详情
			fetchArticle() {
				this.loading = true;
				this.error = false;

				getArticle(this.articleId)
					.then(res => {
						console.log('文章数据:', res.data);
						const articleData = res.data || res;
						// 更新文章数据，确保所有字段都有默认值
						this.article = {
							...this.article,
							...articleData,
							author: {
								username: articleData.author?.username || '',
								avatar: articleData.author?.avatar || '/static/images/default-avatar.jpg'
							},
							views: articleData.views || 0,
							likes: articleData.likes || 0,
							comments_count: articleData.comments_count || 0
						};
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

			// 设置代码块复制按钮的事件监听
			setupCodeCopyListeners() {
				// 获取所有复制按钮
				const copyButtons = document.querySelectorAll('.copy-button');
				if (copyButtons && copyButtons.length > 0) {
					copyButtons.forEach(button => {
						button.addEventListener('click', (e) => {
							e.stopPropagation();
							const blockId = button.getAttribute('data-id');
							const code = decodeURIComponent(button.getAttribute('data-code'));
							this.copyCode(blockId, code, button);
						});
					});
				}
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
			copyCode(blockId, code, buttonElement) {
				if (!code) return;

				uni.setClipboardData({
					data: code,
					success: () => {
						// 更新按钮状态
						if (buttonElement) {
							const originalHTML = buttonElement.innerHTML;
							buttonElement.innerHTML =
								'<text class="copy-icon">✓</text><text class="copy-text">已复制</text>';

							// 2秒后恢复原始文本
							setTimeout(() => {
								buttonElement.innerHTML = originalHTML;
							}, 2000);
						}

						uni.showToast({
							title: '代码已复制',
							icon: 'success'
						});
					},
					fail: () => {
						uni.showToast({
							title: '复制失败',
							icon: 'none'
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

<style lang="scss" scoped>
	.article-container {
		display: flex;
		flex-direction: column;
		padding-bottom: 30rpx;
		/* background-color: #f8f8f8; */
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
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
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
		padding: 30rpx;
		/* background-color: #fff; */
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
		margin-top: 20px;
		/* padding: 0 0 0 20px; */
	}

	.article-header .article-info .article-meta .author-info {
		display: flex;
		align-items: center;
	}

	.article-header .article-info .article-meta .author-info .author-avatar-placeholder {
		width: 35px;
		height: 35px;
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
		font-size: 16px;
		font-weight: 900;
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
</style>