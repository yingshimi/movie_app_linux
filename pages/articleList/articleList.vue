<template>
	<view>
		<view class="tabs-container">
			<scroll-view scroll-x class="tabs-scroll-view" :scroll-left="scrollLeft">
				<view class="tabs-wrapper">
					<view 
						v-for="(item, index) in list1" 
						:key="index" 
						class="tab-item" 
						:class="{active: current === index}"
						@click="changeTab({index})"
					>
						<text>{{ item.name }}</text>
						<view class="tab-line" v-if="current === index"></view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="article-list-container" v-if="current === 0">
			<!-- 文章列表 -->
			<view class="article-list">
				<view class="article-item" v-for="article in articles" :key="article.id"
					@click="navigateToArticle(article.id)">
					<!-- 文章封面图 -->
					<view class="article-cover">
						<image :src="article.cover_img || ''" mode="aspectFill" @error="handleImageError(article)" />
					</view>
					<!-- 文章信息 -->
					<view class="article-info">
						<text class="article-title">{{ article.title }}</text>
						<view class="article-meta">
							<view class="article-stats">
								<text class="views-count">{{ article.views_count || 0 }} 阅读</text>
								<text class="comments-count">{{ article.comments_count || 0 }} 评论</text>
							</view>
							<text class="publish-date">{{ formatDate(article.updated_date) }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="article-list-container" v-if="current === 1">
			<!-- 文章列表 -->
			<view class="article-list">
				<view class="article-item" v-for="article in articles" :key="article.id"
					@click="navigateToArticle(article.id)">
					<!-- 文章封面图 -->
					<view class="article-cover">
						<image :src="article.cover_img || ''" mode="aspectFill" @error="handleImageError(article)" />
					</view>
					<!-- 文章信息 -->
					<view class="article-info">
						<text class="article-title">{{ article.title }}</text>
						<view class="article-meta">
							<view class="article-stats">
								<text class="views-count">{{ article.views_count || 0 }} 阅读</text>
								<text class="comments-count">{{ article.comments_count || 0 }} 评论</text>
							</view>
							<text class="publish-date">{{ formatDate(article.updated_date) }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="article-list-container" v-if="current === 2">
			<!-- 文章列表 -->
			<view class="article-list">
				<view class="article-item" v-for="article in articles" :key="article.id"
					@click="navigateToArticle(article.id)">
					<!-- 文章封面图 -->
					<view class="article-cover">
						<image :src="article.cover_img || ''" mode="aspectFill" @error="handleImageError(article)" />
					</view>
					<!-- 文章信息 -->
					<view class="article-info">
						<text class="article-title">{{ article.title }}</text>
						<view class="article-meta">
							<view class="article-stats">
								<text class="views-count">{{ article.views_count || 0 }} 阅读</text>
								<text class="comments-count">{{ article.comments_count || 0 }} 评论</text>
							</view>
							<text class="publish-date">{{ formatDate(article.updated_date) }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="article-list-container" v-if="current === 3">
			<!-- 文章列表 -->
			<view class="article-list">
				<view class="article-item" v-for="article in articles" :key="article.id"
					@click="navigateToArticle(article.id)">
					<!-- 文章封面图 -->
					<view class="article-cover">
						<image :src="article.cover_img || ''" mode="aspectFill" @error="handleImageError(article)" />
					</view>
					<!-- 文章信息 -->
					<view class="article-info">
						<text class="article-title">{{ article.title }}</text>
						<view class="article-meta">
							<view class="article-stats">
								<text class="views-count">{{ article.views_count || 0 }} 阅读</text>
								<text class="comments-count">{{ article.comments_count || 0 }} 评论</text>
							</view>
							<text class="publish-date">{{ formatDate(article.updated_date) }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		getArticles
	} from '@/static/api/articles.js';
	export default {
		name: 'ArticleList',
		data() {
			return {
				current: 0,
				scrollLeft: 0,
				articles: [],
				loading: false,
				list1: [{
					name: '影评',
				}, {
					name: '剧评',
				}, {
					name: '编程'
				}, {
					name: '其他'
				}]
			};
		},
		methods: {
			changeTab(index){
				this.current = index.index;
				// 计算滚动位置，使选中的tab居中显示
				this.$nextTick(() => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.tab-item').boundingClientRect(data => {
						if (data) {
							const tabWidth = data.width;
							const screenWidth = uni.getSystemInfoSync().windowWidth;
							const scrollPosition = (index.index * tabWidth) - (screenWidth / 2) + (tabWidth / 2);
							this.scrollLeft = scrollPosition > 0 ? scrollPosition : 0;
						}
					}).exec();
				});
			},
			async fetchArticles() {
				if (this.loading) return;

				try {
					this.loading = true;
					const {
						data
					} = await getArticles();
					this.articles = data.results;
				} catch (error) {
					console.error('获取文章列表失败:', error);
					uni.showToast({
						title: '获取文章列表失败',
						icon: 'none'
					});
				}
			},
			navigateToArticle(id) {
				uni.navigateTo({
					url: `/pages/article/article?id=${id}`
				});
			},
			formatDate(dateString) {
				const date = new Date(dateString);
				return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
			},
			handleImageError(article) {
				// 图片加载失败时，设置为默认背景色
				// const element = event.target;
				// element.style.display = 'none';
				// element.parentElement.style.backgroundColor = '#f0f0f0';
			}
		},
		mounted() {
			this.fetchArticles();
		}
	};
</script>

<style lang="scss" scoped>
	.tabs-container {
		background-color: #fff;
		position: sticky;
		top: 0;
		z-index: 100;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
	}
	
	.tabs-scroll-view {
		width: 100%;
		white-space: nowrap;
	}
	
	.tabs-wrapper {
		display: flex;
		width: 100%;
	}
	
	.tab-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 44px;
		padding: 0 30rpx;
		position: relative;
		flex: 1;
		
		text {
			font-size: 30rpx;
			color: #666;
			transition: color 0.3s;
		}
		
		&.active {
			text {
				color: #000000;
				font-weight: bold;
			}
		}
		
		.tab-line {
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			width: 40rpx;
			height: 4rpx;
			background-color: #000000;
			border-radius: 2rpx;
		}
	}

	.article-list-container {
		height: 100vh;
		padding: 20rpx;
		background-color: #f8f8f8;

		.article-list {
			.article-item {
				display: flex;
				background-color: #fff;
				border-radius: 15px;
				padding: 10px;
				margin-bottom: 20px;
				box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);

				.article-cover {
					width: 200rpx;
					height: 150rpx;
					margin-right: 20rpx;
					border-radius: 8rpx;
					overflow: hidden;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.article-info {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.article-title {
						font-size: 32rpx;
						font-weight: bold;
						color: #333;
						line-height: 1.4;
						margin-bottom: 10rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}

					.article-meta {
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-size: 24rpx;
						color: #999;

						.article-stats {
							display: flex;
							gap: 20rpx;
						}

						.publish-date {
							color: #666;
						}
					}
				}

				&:active {
					opacity: 0.8;
				}
			}
		}
	}
</style>