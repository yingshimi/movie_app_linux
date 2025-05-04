<template>
	<view class="movie-detail" style="margin-top: var(--status-bar-height);">
		<!-- 头部区域：海报及基本信息 -->
		<view class="header">
			<view class="poster-blur">
				<image class="blur-image" :src="movieInfo.backdrop" mode="aspectFill"></image>
			</view>
			<view class="header-content">
<!-- 				<view class="back-btn" @tap="goBack">
					<text class="iconfont">←</text>
				</view> -->
				<view class="poster-container">
					<view class="movie-poster">
						<image class="poster-image" :src="movieInfo.poster" mode="aspectFill"></image>
						<view class="movie-types">
							<text v-for="(tag, index) in movieInfo.tags.slice(0, 3)" :key="index">{{ tag.name }}</text>
						</view>
					</view>
					<view class="movie-tag" v-if="movieInfo.quality">
						<text>{{ movieInfo.quality }}</text>
					</view>
				</view>
				<view class="movie-basic-info">
					<view class="movie-title">
						<text>{{ movieInfo.title }}</text>
					</view>
					<view class="movie-original-title" v-if="movieInfo.originalTitle">
						<text>{{ movieInfo.originalTitle }}</text>
					</view>
					<view class="movie-meta">
						<text>{{ movieInfo.year }} / </text>
						<text>{{ movieInfo.countries.join(' ') }} / </text>
						<text>{{ movieInfo.duration }}分钟</text>
					</view>
					<view class="rating-box">
						<view class="rating-star">
							<text class="rating-score">{{ movieInfo.rating }}</text>
							<view class="star-container">
								<!-- 生成星星评分图标 -->
								<text v-for="i in 5" :key="i" class="star"
									:class="i <= Math.floor(movieInfo.rating/2) ? 'star-full' : (i-0.5 <= movieInfo.rating/2 ? 'star-half' : 'star-empty')">
									★
								</text>
							</view>
						</view>
						<text class="rating-count">＄预算:{{ movieInfo.ratingCount }}</text>
					</view>
				</view>
			</view>
		</view>

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
			<view class="action-item">
				<view class="action-icon">
					<text class="iconfont">✎</text>
				</view>
				<text class="action-text">影评</text>
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
					<view class="cast-item" v-for="(actor, index) in movieInfo.cast.slice(0,6)" :key="index">
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
				<text>{{ movieInfo.summary }}</text>
			</view>
			<view class="expand-btn" @tap="toggleExpand">
				<text>{{ isExpanded ? '收起' : '展开' }}</text>
				<text class="expand-icon">{{ isExpanded ? '↑' : '↓' }}</text>
			</view>
		</view>



		<!-- 精彩剧照区域 -->
<!-- 		<view class="content-section photos-section">
			<view class="section-header">
				<text class="section-title">精彩剧照</text>
				<text class="more-btn">全部 ></text>
			</view>
			<scroll-view class="photos-scroll" scroll-x="true" show-scrollbar="false">
				<view class="photos-list">
					<view class="photo-item" v-for="(photo, index) in movieInfo.photos" :key="index"
						@tap="previewPhoto(index)">
						<image class="photo-image" :src="photo.file_path" mode="aspectFill"></image>
					</view>
				</view>
			</scroll-view>
		</view> -->

		<!-- 预告片区域 -->
<!-- 		<view class="content-section trailer-section">
			<view class="section-header">
				<text class="section-title">预告片</text>
				<text class="more-btn" v-if="movieInfo.trailers.length > 1">全部 ></text>
			</view>
			<view class="trailer-container" v-if="movieInfo.trailers.length > 0">
				<image class="trailer-image" :src="movieInfo.trailers[0].cover" mode="aspectFill"></image>
				<view class="play-icon">
					<text>▶</text>
				</view>
				<view class="trailer-duration">
					<text>{{ movieInfo.trailers[0].duration }}</text>
				</view>
			</view>
		</view> -->

		<!-- 短评区域 -->
<!-- 		<view class="content-section comments-section">
			<view class="section-header">
				<text class="section-title">短评</text>
				<text class="more-btn">全部{{ movieInfo.commentCount }}条 ></text>
			</view>
			<view class="comments-list">
				<view class="comment-item" v-for="(comment, index) in movieInfo.comments" :key="index">
					<view class="comment-header">
						<view class="commenter-avatar">
							<image class="avatar-image" :src="comment.avatar" mode="aspectFill"></image>
						</view>
						<view class="commenter-info">
							<text class="commenter-name">{{ comment.username }}</text>
							<view class="comment-rating">
								<text v-for="i in 5" :key="i" class="comment-star"
									:class="i <= comment.rating ? 'star-full' : 'star-empty'">★</text>
								<text class="comment-time">{{ comment.time }}</text>
							</view>
						</view>
					</view>
					<view class="comment-content">
						<text>{{ comment.content }}</text>
					</view>
					<view class="comment-actions">
						<view class="comment-action">
							<text class="action-icon">👍</text>
							<text>{{ comment.likes }}</text>
						</view>
						<view class="comment-action">
							<text class="action-icon">💬</text>
							<text>{{ comment.replies }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="write-comment-btn">
				<text>写短评</text>
			</view>
		</view> -->

		<!-- 相关推荐区域 -->
		<view class="content-section recommend-section">
			<view class="section-header">
				<text class="section-title">相关推荐</text>
			</view>
			<scroll-view class="recommend-scroll" scroll-x="true" show-scrollbar="false">
				<view class="recommend-list">
					<view class="recommend-item" v-for="(movie, index) in movieInfo.recommendations" :key="index">
						<view class="recommend-poster">
							<image class="poster-image" :src="'https://image.tmdb.org/t/p/original'+movie.poster_path" mode="aspectFill"></image>
						</view>
						<view class="recommend-info">
							<text class="recommend-title">{{ movie.title }}</text>
							<text class="recommend-rating">{{ movie.rating }}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isCollected: false,
				isSeen: false,
				isExpanded: false,
				movieInfo: {
					title: "速度与激情10",
					originalTitle: "Fast X",
					poster: "", // 电影海报URL
					backdrop: "", // 背景图URL
					year: "2023",
					countries: ["美国"],
					duration: "142",
					quality: "4K",
					rating: "8.9",
					ratingCount: "123,456",
					tags: ["动作", "冒险", "犯罪", "惊悚", "赛车", "家庭", "爆炸", "特效"],
					summary: `昔日的死对头塞弗主动找上门来告知多米尼克和整个飞车家族都将遭遇危险。随后，多米尼克从"小无名氏"先生处得知飞车家族的几位朋友接到了假任务。为了拯救众人，唐老大和莱蒂前往罗马救人，而把小儿子托给米娅和雅各布照顾。

在罗马的交锋中，唐老大发现对手叫但丁，是毒枭赫南·雷耶斯的儿子；而他却并不想让多米尼克和飞车家族立刻消失，而是要慢慢折磨他们，就连曾经帮助过飞车家族或是有关联的人也不会放过......

故事发展到现在，已经从当初的非法赛车文化逐渐演变为一个关于家族和团队的史诗般的冒险传奇。`,
					cast: [{
							name: "范·迪塞尔",
							role: "唐老大",
							profile_path: "" // 演员头像URL
						},
						{
							name: "米歇尔·罗德里格兹",
							role: "莱蒂",
							profile_path: ""
						},
						{
							name: "泰瑞斯·吉布森",
							role: "罗曼",
							profile_path: ""
						},
						{
							name: "卢达克里斯",
							role: "特杰",
							profile_path: ""
						},
						{
							name: "约翰·塞纳",
							role: "雅各布",
							profile_path: ""
						},
						{
							name: "娜塔莉·艾玛努埃尔",
							role: "拉姆齐",
							profile_path: ""
						},
						{
							name: "杰森·莫玛",
							role: "但丁",
							profile_path: ""
						},
						{
							name: "海伦·米伦",
							role: "玛格达琳",
							profile_path: ""
						}
					],
					photos: [{
							file_path: ""
						},
						{
							file_path: ""
						},
						{
							file_path: ""
						},
						{
							file_path: ""
						},
						{
							file_path: ""
						},
						{
							file_path: ""
						}
					],
					trailers: [{
						url: "",
						duration: "02:25",
						cover: "" // 预告片封面图URL
					}],
					commentCount: 5423,
					comments: [{
							username: "电影爱好者",
							time: "2023-05-20",
							rating: 4,
							likes: 328,
							replies: 42,
							content: "这部电影的动作场面非常震撼，特效也做得很棒，但情节有些薄弱。总体来说还是一部不错的娱乐片。",
							avatar: "" // 用户头像URL
						},
						{
							username: "速激粉丝",
							time: "2023-05-19",
							rating: 5,
							likes: 245,
							replies: 18,
							content: "作为系列的忠实粉丝，这部电影没有让我失望。虽然情节越来越离谱，但正是这种不断突破的感觉让我着迷。",
							avatar: ""
						}
					],
					recommendations: [{
							title: "速度与激情9",
							rating: "8.5",
							poster: "" // 推荐电影海报URL
						},
						{
							title: "速度与激情8",
							rating: "8.7",
							poster: ""
						},
						{
							title: "疾速追杀4",
							rating: "9.0",
							poster: ""
						},
						{
							title: "碟中谍7",
							rating: "8.8",
							poster: ""
						},
						{
							title: "壮志凌云2",
							rating: "8.6",
							poster: ""
						}
					]
				}
			};
		},

		onLoad() {
			this.getetstdata()
		},
		methods: {
			getetstdata() {
				uni.request({
					url: 'http://192.168.88.200:9000/api/videos/tmdbdata', // API 的 URL
					method: 'GET', // 请求方法，GET
					data: {
						movie_id: '313369', // 请求参数
					},
					header: {
						'content-type': 'application/json', // 默认值
					},
					success: (res) => {
						console.log('请求数据')
						console.log(res.data.data)
						const data = res.data.data
						this.movieInfo.title = data.title
						this.movieInfo.poster = 'https://image.tmdb.org/t/p/original' + data.poster_path
						this.movieInfo.backdrop = 'https://image.tmdb.org/t/p/original' + data.backdrop_path
						this.movieInfo.tags = data.genres
						this.movieInfo.originalTitle = data.original_title
						this.movieInfo.title = data.title
						this.movieInfo.summary = data.overview
						this.movieInfo.cast = data.credits.cast
						this.movieInfo.recommendations = data.recommendations.results
						this.movieInfo.year = data.release_date
						this.movieInfo.countries = data.origin_country
						this.movieInfo.duration = data.runtime
						this.movieInfo.ratingCount = data.budget
						this.movieInfo.rating = data.vote_average
					},
					fail: (err) => {
						console.error('请求失败', err);
						uni.showToast({
							title: '请求失败',
							icon: 'none',
						});
					},
				});
			},
			goBack() {
				uni.navigateBack();
			},
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
			playMovie() {
				uni.showToast({
					title: '开始播放电影',
					icon: 'none'
				});
			},
			// 预览剧照
			previewPhoto(index) {
				// 构建完整的图片URL数组
				const urls = this.movieInfo.photos.map(photo => photo.file_path);

				// 使用uni-app的预览图片API
				uni.previewImage({
					urls: urls,
					current: index,
					indicator: 'number',
					loop: true,
					success: () => {
						console.log('图片预览成功');
					},
					fail: (err) => {
						console.error('图片预览失败', err);
					}
				});
			}
		}
	};
</script>

<style>
	/* 整体页面样式 */
	.movie-detail {
		background-color: #f7f7f7;
		position: relative;
		padding-bottom: 70px;
	}

	/* 头部区域样式 */
	.header {
		position: relative;
		background-color: #000;
		padding-bottom: 20px;
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

	/* 标签区域 */
	.tags-scroll {
		background-color: #fff;
		padding: 12px 0;
		white-space: nowrap;
		margin-top: 10px;
	}

	.tags {
		display: flex;
		padding: 0 15px;
	}

	.tag {
		background-color: #f4f4f4;
		padding: 6px 12px;
		border-radius: 15px;
		margin-right: 8px;
	}

	.tag text {
		color: #666;
		font-size: 12px;
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

	/* 剧照区域 */
	.photos-scroll {
		white-space: nowrap;
		margin-top: 5px;
	}

	.photos-list {
		display: flex;
	}

	.photo-item {
		width: 160px;
		height: 90px;
		margin-right: 8px;
		border-radius: 4px;
		flex-shrink: 0;
		overflow: hidden;
	}

	.photo-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* 预告片区域 */
	.trailer-container {
		position: relative;
		height: 180px;
		border-radius: 8px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.trailer-image {
		width: 100%;
		height: 100%;
		border-radius: 8px;
		object-fit: cover;
	}

	.play-icon {
		width: 50px;
		height: 50px;
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.play-icon text {
		color: #fff;
		font-size: 26px;
	}

	.trailer-duration {
		position: absolute;
		right: 10px;
		bottom: 10px;
		background-color: rgba(0, 0, 0, 0.6);
		padding: 2px 5px;
		border-radius: 2px;
	}

	.trailer-duration text {
		color: #fff;
		font-size: 12px;
	}

	/* 短评区域 */
	.comments-list {
		margin-bottom: 15px;
	}

	.comment-item {
		padding-bottom: 15px;
		border-bottom: 1px solid #f0f0f0;
		margin-bottom: 15px;
	}

	.comment-item:last-child {
		margin-bottom: 0;
		border-bottom: none;
	}

	.comment-header {
		display: flex;
		margin-bottom: 8px;
	}

	.commenter-avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		margin-right: 10px;
		overflow: hidden;
	}

	.commenter-info {
		flex: 1;
	}

	.commenter-name {
		font-size: 14px;
		color: #333;
		font-weight: bold;
		margin-bottom: 3px;
		display: block;
	}

	.comment-rating {
		display: flex;
		align-items: center;
	}

	.comment-star {
		color: rgba(0, 0, 0, 0.1);
		font-size: 12px;
	}

	.comment-time {
		color: #999;
		font-size: 12px;
		margin-left: 8px;
	}

	.comment-content {
		margin: 8px 0;
	}

	.comment-content text {
		color: #333;
		font-size: 14px;
		line-height: 1.5;
	}

	.comment-actions {
		display: flex;
	}

	.comment-action {
		display: flex;
		align-items: center;
		margin-right: 20px;
	}

	.comment-action text {
		color: #999;
		font-size: 13px;
	}

	.action-icon {
		margin-right: 4px;
	}

	.write-comment-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 38px;
		background-color: #f5f5f5;
		border-radius: 19px;
	}

	.write-comment-btn text {
		color: #4b8ccb;
		font-size: 14px;
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

	/* 底部操作区域 */
	.bottom-actions {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 8px 15px;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
	}

	.action-buttons {
		display: flex;
		align-items: center;
	}

	.share-btn {
		width: 36px;
		height: 36px;
		background-color: #f5f5f5;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 10px;
	}

	.share-btn .iconfont {
		color: #666;
		font-size: 18px;
	}

	.play-btn {
		height: 36px;
		padding: 0 15px;
		background-color: #4b8ccb;
		border-radius: 18px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.play-text {
		color: #fff;
		font-size: 14px;
		font-weight: bold;
		margin-right: 4px;
	}

	.play-icon {
		color: #fff;
		font-size: 14px;
	}

	/* 页面滚动条隐藏 */
	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
	}
</style>