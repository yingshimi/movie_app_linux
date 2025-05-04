<template>
	<view class="movie-list-container">
		<!-- 分类标签栏 -->
		<view class="category-tabs">
			<!-- <view class="fixed-tabs" :style="fixedTabsStyle"> -->
			<view style="position: fixed;right: 0;left: 0;z-index: 999;background-color: white;">
				<view class="main-tabs">
					<view class="tab-item" :class="{'active': currentTab === 0}" @tap="switchTab(0)">电影榜单</view>
					<view class="tab-item" :class="{'active': currentTab === 1}" @tap="switchTab(1)">电视榜单</view>
				</view>

				<!-- 子标签栏 -->
			</view>

			<!-- 内容区域 -->
			<view class="tab-content" style="padding-top: 50px;">
				<!-- 电影榜单内容 -->
				<view v-if="currentTab === 0" class="content-item">
					<scroll-view scroll-y class="scroll-content">
						<!-- 榜单列表 -->
						<view class="list-section">
							<!-- 							<view class="section-header">
								<view class="section-title">今日片单</view>
								<view class="section-more">关注的片单 ></view>
							</view> -->

							<view class="movie-list">
								<!-- 使用v-for遍历电影榜单项 -->
								<view class="movie-item" v-for="(item, index) in movieRankings" :key="index">
									<view class="movie-cover"
										:style="{ backgroundImage: 'url(' + item.coverImage + ')' }">
										<view class="cover-badge">{{item.badge}}</view>
										<view class="small-covers">
											<view class="small-cover-stack">
												<image class="small-cover"
													:src="item.movies && item.movies.length > 0 ? 'https://image.tmdb.org/t/p/w500' + item.movies[0].poster_url : 'https://picsum.photos/75/100?random=' + (index*3 + 10)"
													mode="aspectFill"></image>
												<image class="small-cover"
													:src="item.movies && item.movies.length > 1 ? 'https://image.tmdb.org/t/p/w500' + item.movies[1].poster_url : 'https://picsum.photos/75/100?random=' + (index*3 + 11)"
													mode="aspectFill"></image>
												<image class="small-cover"
													:src="item.movies && item.movies.length > 2 ? 'https://image.tmdb.org/t/p/w500' + item.movies[2].poster_url : 'https://picsum.photos/75/100?random=' + (index*3 + 12)"
													mode="aspectFill"></image>
											</view>
										</view>
										<view class="cover-title" v-if="item.coverTitle">{{item.coverTitle}}</view>
									</view>
									<view class="movie-info">
										<view class="movie-title">{{item.title}}</view>
										<view class="movie-stats">{{item.stats}}</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>

				<!-- 电视榜单内容 -->
				<view v-if="currentTab === 1" class="content-item">
					<scroll-view scroll-y class="scroll-content">
						<view class="list-section">
							<view class="section-header">
								<view class="section-title">热门电视榜单</view>
								<view class="section-more">更多 ></view>
							</view>

							<view class="movie-list">
								<!-- 使用v-for遍历电视榜单项 -->
								<view class="movie-item" v-for="(item, index) in tvRankings" :key="index">
									<view class="movie-cover"
										:style="{ backgroundImage: 'url(https://picsum.photos/300/240?random=' + (index + 50) + ')' }">
										<view class="cover-badge">{{item.badge}}</view>
										<view class="small-covers">
											<view class="small-cover-stack">
												<image class="small-cover"
													:src="'https://picsum.photos/75/100?random=' + (index*3 + 20)"
													mode="aspectFill"></image>
												<image class="small-cover"
													:src="'https://picsum.photos/75/100?random=' + (index*3 + 21)"
													mode="aspectFill"></image>
												<image class="small-cover"
													:src="'https://picsum.photos/75/100?random=' + (index*3 + 22)"
													mode="aspectFill"></image>
											</view>
										</view>
										<view class="cover-title">{{item.coverTitle}}</view>
									</view>
									<view class="movie-info">
										<view class="movie-title">{{item.title}}</view>
										<view class="movie-stats">{{item.stats}}</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>

				<!-- 影视片单内容 -->
				<view v-if="currentTab === 2" class="content-item">
					<scroll-view scroll-y class="scroll-content">
						<view class="list-section">
							<view class="section-header">
								<view class="section-title">今日片单</view>
								<view class="section-more">关注的片单 ></view>
							</view>

							<view class="movie-list">
								<!-- 使用v-for遍历片单项 -->
								<view class="movie-item" v-for="(item, index) in movieCollections" :key="index">
									<view class="movie-cover"
										:style="{ backgroundImage: 'url(https://picsum.photos/300/240?random=' + (index + 100) + ')' }">
										<view class="cover-badge">{{item.badge}}</view>
										<view class="small-covers">
											<view class="small-cover-stack">
												<image class="small-cover"
													:src="'https://picsum.photos/75/100?random=' + (index*3 + 1)"
													mode="aspectFill"></image>
												<image class="small-cover"
													:src="'https://picsum.photos/75/100?random=' + (index*3 + 2)"
													mode="aspectFill"></image>
												<image class="small-cover"
													:src="'https://picsum.photos/75/100?random=' + (index*3 + 3)"
													mode="aspectFill"></image>
											</view>
										</view>
										<view class="cover-title">{{item.coverTitle}}</view>
									</view>
									<view class="movie-info">
										<view class="movie-title">{{item.title}}</view>
										<view class="movie-stats">{{item.stats}}</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getMovieLst
	} from '@/static/api/movie.js'
	export default {
		data() {
			return {
				currentTab: 0, // 默认显示"电影榜单"
				currentSubTab: 0, // 默认选中第一个子标签
				contentHeight: 1000, // 默认高度，会在onReady中动态计算
				maxTabIndex: 2, // 最大标签索引

				// 子标签数据
				subTabs: [{
						name: '电影',
						isMore: false
					},
					{
						name: '影瓣片单',
						isMore: false
					},
					{
						name: '精选',
						isMore: false
					},
					{
						name: '经典',
						isMore: false
					},
					{
						name: '获奖',
						isMore: false
					},
					{
						name: '高分',
						isMore: false
					},
					{
						name: '',
						isMore: true
					}
				],

				// 电影榜单数据
				movieRankings: [{
						badge: '影',
						coverTitle: '2025年03月热门电影',
						title: '第97届奥斯卡金像奖获奖名单',
						stats: '14部'
					},
					{
						badge: '影',
						coverTitle: '2025年03月热门电影',
						title: '2025年03月定档热门电影推荐',
						stats: '30部'
					},
					{
						badge: '影',
						coverTitle: '英国国家剧院Top20',
						title: '英国国家剧院现场电影Top20',
						stats: '20部'
					},
					{
						badge: '影',
						coverTitle: '2024华语电影',
						title: '影瓣2024评分最高华语电影',
						stats: '10部'
					},
					{
						badge: '影',
						coverTitle: '2024外语电影',
						title: '影瓣2024评分最高外语电影',
						stats: '10部'
					},
					{
						badge: '影',
						coverTitle: '2024冷门佳片',
						title: '影瓣2024冷门佳片',
						stats: '看过0/10部 · 1.3万人关注'
					}
				],

				// 电视榜单数据
				tvRankings: [{
						badge: '影',
						coverTitle: '2024热门电视剧',
						title: '2024上半年必看电视剧',
						stats: '看过2/20部 · 1.5万人关注'
					},
					{
						badge: '影',
						coverTitle: '国产剧TOP榜',
						title: '2024年国产剧评分排行',
						stats: '看过3/20部 · 1.2万人关注'
					},
					{
						badge: '影',
						coverTitle: '美剧经典榜单',
						title: '影瓣评分最高美剧TOP20',
						stats: '看过5/20部 · 2.3万人关注'
					},
					{
						badge: '影',
						coverTitle: '韩剧热门榜',
						title: '2024年最受欢迎韩剧',
						stats: '看过1/15部 · 1.8万人关注'
					}
				],

				// 影视片单数据
				movieCollections: [{
						badge: '影',
						coverTitle: '第97届奥斯卡金像奖',
						title: '第97届奥斯卡金像奖获奖名单',
						stats: '看过0/14部 · 1068人关注'
					},
					{
						badge: '影',
						coverTitle: '影瓣高分片单',
						title: '影瓣9.0+高分电影合集',
						stats: '看过12/50部 · 5.6万人关注'
					},
					{
						badge: '影',
						coverTitle: '经典科幻片单',
						title: '必看科幻电影TOP30',
						stats: '看过8/30部 · 3.2万人关注'
					},
					{
						badge: '影',
						coverTitle: '影瓣电影Top250',
						title: '影瓣电影Top250',
						stats: '看过86/250部 · 12.5万人关注'
					}
				]
			}
		},
		methods: {
			// 点击标签切换
			switchTab(index) {
				// 检查边界
				if (index < 0 || index > this.maxTabIndex) {
					return;
				}

				this.currentTab = index;
			}
		},
		created() {
			getMovieLst().then(res => {
				console.log(res.data)
				// 将API返回的数据映射到movieRankings数组
				if (res.data && Array.isArray(res.data)) {
					this.movieRankings = res.data.map(item => {
						return {
							badge: item.badge || '影',
							coverTitle: item.title,
							title: item.description || item.title,
							stats: `看过${item.watched_count}/${item.movie_count}部 · ${item.follow_count}人关注`,
							coverImage: item.cover_image,
							movies: item.movies || []
						}
					})
				}
			})
		}
	}
</script>

<style>
	/* 样式保持不变 */
	.movie-list-container {
		background-color: #f5f5f5;
		min-height: 100vh;
		position: relative;
		/* 添加相对定位 */
	}

	/* 顶部导航栏 */
	.nav-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		background-color: #fff;
	}

	.back-icon,
	.more-icon {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		font-weight: 500;
	}

	.iconfont {
		font-family: "iconfont";
	}

	/* 分类标签栏 */
	.category-tabs {
		background-color: #fff;
		position: relative;
	}

	/* 固定标签栏 */
	.fixed-tabs {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 999;
		/* 提高z-index确保显示在最上层 */
		background-color: #fff;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
	}

	.main-tabs {
		display: flex;
		border-bottom: 2rpx solid #f0f0f0;
	}

	.tab-item {
		flex: 1;
		text-align: center;
		padding: 24rpx 0;
		font-size: 30rpx;
		color: #666;
	}

	.tab-item.active {
		color: #000;
		font-weight: 500;
		position: relative;
	}

	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 80rpx;
		height: 6rpx;
		background-color: #000;
		border-radius: 3rpx;
	}

	/* 内容区域 */
	.tab-content {
		width: 100%;
	}

	.content-item {
		height: 100%;
	}

	.scroll-content {
		height: 100%;
	}

	.sub-tabs {
		display: flex;
		padding: 20rpx 0;
		overflow-x: scroll;
		white-space: nowrap;
	}

	.sub-tab {
		padding: 10rpx 30rpx;
		margin: 0 10rpx;
		font-size: 28rpx;
		color: #666;
		border-radius: 30rpx;
	}

	.sub-tab.active {
		background-color: #e8f4e5;
		color: #42bd56;
		display: flex;
		align-items: center;
	}

	.arrow-down {
		font-size: 24rpx;
		margin-left: 6rpx;
	}

	.sub-tab.more {
		padding: 10rpx 20rpx;
	}

	/* 榜单列表 */
	.list-section {
		padding: 20rpx 30rpx;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: 500;
	}

	.section-more {
		font-size: 28rpx;
		color: #666;
	}

	.movie-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.movie-item {
		width: 48%;
		margin-bottom: 30rpx;
		background-color: #fff;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.movie-cover {
		position: relative;
		height: 240rpx;
		display: flex;
		align-items: flex-end;
		padding: 16rpx;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	/* 封面上的标题 - 添加半透明黑色背景以增强可读性 */
	.cover-title {
		color: #fff;
		font-size: 28rpx;
		font-weight: 500;
		text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.5);
		z-index: 2;
		background-color: rgba(0, 0, 0, 0.3);
		padding: 4rpx 8rpx;
		border-radius: 4rpx;
	}

	/* 颜色块替代图片 */
	.bg-color-1 {
		background: linear-gradient(to bottom, #8e44ad, #9b59b6);
	}

	.bg-color-2 {
		background: linear-gradient(to bottom, #2980b9, #3498db);
	}

	.bg-color-3 {
		background: linear-gradient(to bottom, #c0392b, #e74c3c);
	}

	.bg-color-4 {
		background: linear-gradient(to bottom, #27ae60, #2ecc71);
	}

	.bg-color-5 {
		background: linear-gradient(to bottom, #d35400, #e67e22);
	}

	.bg-color-6 {
		background: linear-gradient(to bottom, #2c3e50, #34495e);
	}

	/* 小图片颜色 */
	.bg-color-1-1 {
		background-color: #9b59b6;
	}

	.bg-color-1-2 {
		background-color: #8e44ad;
	}

	.bg-color-1-3 {
		background-color: #7d3c98;
	}

	.bg-color-2-1 {
		background-color: #3498db;
	}

	.bg-color-2-2 {
		background-color: #2980b9;
	}

	.bg-color-2-3 {
		background-color: #1f618d;
	}

	.bg-color-3-1 {
		background-color: #e74c3c;
	}

	.bg-color-3-2 {
		background-color: #c0392b;
	}

	.bg-color-3-3 {
		background-color: #a93226;
	}

	.bg-color-4-1 {
		background-color: #2ecc71;
	}

	.bg-color-4-2 {
		background-color: #27ae60;
	}

	.bg-color-4-3 {
		background-color: #229954;
	}

	.bg-color-5-1 {
		background-color: #e67e22;
	}

	.bg-color-5-2 {
		background-color: #d35400;
	}

	.bg-color-5-3 {
		background-color: #ba4a00;
	}

	.bg-color-6-1 {
		background-color: #34495e;
	}

	.bg-color-6-2 {
		background-color: #2c3e50;
	}

	.bg-color-6-3 {
		background-color: #1a2530;
	}

	.cover-badge {
		position: absolute;
		top: 10rpx;
		left: 10rpx;
		width: 36rpx;
		height: 36rpx;
		background-color: #fff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #42bd56;
		font-weight: bold;
		z-index: 2;
	}

	.small-covers {
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		display: flex;
		z-index: 2;
	}

	/* 堆叠效果 */
	.small-cover-stack {
		position: relative;
		width: 100rpx;
		height: 100rpx;
	}

	.small-cover {
		width: 85rpx;
		height: 110rpx;
		border-radius: 6rpx;
		border: 2rpx solid #fff;
		position: absolute;
		box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
	}

	.small-cover:nth-child(1) {
		right: 0;
		transform: rotate(5deg);
		z-index: 3;
	}

	.small-cover:nth-child(2) {
		right: 8rpx;
		transform: rotate(-15deg);
		z-index: 2;
	}

	.small-cover:nth-child(3) {
		right: 16rpx;
		transform: rotate(-35deg);
		z-index: 1;
	}

	.movie-info {
		padding: 16rpx;
	}

	.movie-title {
		font-size: 28rpx;
		font-weight: 500;
		line-height: 1.4;
		margin-bottom: 10rpx;
	}

	.movie-stats {
		font-size: 24rpx;
		color: #999;
	}
</style>