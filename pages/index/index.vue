<template>
	<view class="h-main">
		<view style="width: 100%; background-color: white; position: fixed; z-index: 999999;"
			:style="{ height: statusBarHeight + 'px' }"></view>
		<view style="width: 100%; position: fixed; z-index: 999999;height: 40px;"
			:style="{ top: statusBarHeight + 'px' }">
			<Search class="search" v-model="keyword" :goSearch="goSearch"></Search>
		</view>
		<view class="h-carousel">
			<myswiper class="myswiper"></myswiper>
		</view>
		<view class="h-content">
			<view class="m-items">
				<view class="movie-items movie-items-1">
					<view class="movie-item item-film" @click="goMovieList">
						<view class="icon-st">
							<image src="/static/icon/15film.svg" style="width: 30px; height: 30px;"></image>
						</view>
						<text class="icon-title">电影</text>
					</view>
					<view class="movie-item item-tv" @click="goDetail">
						<view class="icon-st">
							<image src="/static/icon/电视剧.svg" style="width: 30px; height: 30px;"></image>
						</view>
						<text class="icon-title">剧集</text>
					</view>
					<view class="movie-item item-tuijian" @click="goarticleList">
						<view class="icon-st">
							<image src="/static/icon/推荐.svg" style="width: 30px; height: 30px;"></image>
						</view>
						<text class="icon-title">文章</text>
					</view>
				</view>
				<view class="movie-items movie-items-2">
					<view class="movie-item item-film" @click="goSeries">
						<view class="icon-st">
							<image src="/static/icon/3-影片.svg" style="width: 30px; height: 30px;"></image>
						</view>
						<text class="icon-title">片单</text>
					</view>
					<view class="movie-item item-tv" @click="goYoutube">
						<view class="icon-st">
							<image src="/static/icon/电影.svg" style="width: 30px; height: 30px;"></image>
						</view>
						<text class="icon-title">油管下载</text>
					</view>

					<view class="movie-item item-tuijian" @click="goVideoList">
						<view class="icon-st">
							<image src="/static/icon/下周预告.svg" style="width: 30px; height: 30px;"></image>
						</view>
						<text class="icon-title">留言墙</text>
					</view>
				</view>
				<view class="tansuo">
					<text class="label">豆瓣TOP250</text>
				</view>
			</view>
			<view style="display: flex; flex-direction: row;justify-content: center;align-items: center;">
				<movieList :items="movieList" @to-player="handleToPlayer"></movieList>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getAlist,
		getAlistFile
	} from '@/static/api/file';

	import {
		tmdbSearch
	} from '@/static/api/movie.js';

	import movieList from '@/components/movieList/movieList.vue'
	
	export default {
		components: {
			movieList
		},
		onLoad(options) {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			
			// 检查是否有特定目录参数
			if(options && options.title === '漫威宇宙'){
				this.baseDirectory = '/夸克网盘/电影/漫威'
			}
			
			// 获取电影数据
			this.fetchMovieFiles();
			
			// 设置滚动监听
			uni.$on('needScrollListener', (component) => {
				if (component && !this.scrollListeners.includes(component)) {
					this.scrollListeners.push(component);
				}
			});
		},
		onUnload() {
			uni.$off('needScrollListener');
			uni.$off('cancelScrollListener');
			this.scrollListeners = [];
		},
		data() {
			return {
				statusBarHeight: 0,
				fileList: [],
				movieList: [],
				baseDirectory: '/夸克网盘/电影/漫威',
				fileUrl: '',
				results: [],
				keyword: "",
				scrollListeners: []
			};
		},
		methods: {
			// 搜索电影
			async searchMovie(query, year = null) {
				const params = {
					query: query,
					language: "zh-CN",
					page: "1",
					include_adult: "false"
				};
				if (year) {
					params.year = year;
				}
				try {
					const response = await tmdbSearch(params);
					return response.data.results || [];
				} catch (error) {
					console.error("搜索电影请求失败:", error);
					return [];
				}
			},

			// 获取电影数据
			async fetchMovieData(fileItem) {
				try {
					const movieName = fileItem.title;
					const queryParts = movieName.split(".");
					const query = queryParts[0];
					const year = queryParts.length > 1 ? queryParts[1] : null;
					
					const searchResults = await this.searchMovie(query, year);
					if (searchResults.length > 0) {
						const movieInfo = searchResults[0].basic_info;
						return {
							name: movieName,
							title: movieInfo.title,
							year: year,
							id: movieInfo.id,
							poster: movieInfo.poster_path,
							path: fileItem.path
						};
					} else {
						return {
							name: movieName,
							error: "未找到相关电影",
							code: 404
						};
					}
				} catch (error) {
					throw new Error(`获取电影数据失败: ${error.message}`);
				}
			},

			// 获取文件名列表
			fetchMovieFiles() {
				const requestData = {
					path: this.baseDirectory,
					password: '',
					page: 1,
					per_page: 0,
					refresh: false
				};
				
				getAlist(requestData).then(response => {
					const filePattern = /(\d+)\.(.*?)(\d{4})\./;
					const movieList = [];
					const content = response.data.data.content || [];
					
					for (const fileItem of content.slice(0, 10)) {
						const match = filePattern.exec(fileItem.name);
						if (match) {
							const movieName = match[2].replace(/\./g, " ").trim();
							const releaseYear = match[3];
							if (releaseYear) {
								movieList.push({
									path: fileItem.name,
									name: movieName,
									year: releaseYear,
									title: `${movieName}.${releaseYear}`
								});
							}
						}
					}
					this.fileList = movieList;
					this.fetchAllMovieData();
				}).catch(error => {
					console.error("获取文件列表失败:", error);
				});
			},

			// 并发获取所有电影数据
			async fetchAllMovieData() {
				try {
					const fetchPromises = this.fileList.map(movie => this.fetchMovieData(movie));
					const fetchResults = await Promise.allSettled(fetchPromises);
					this.movieList = fetchResults
						.filter(result => result.status === 'fulfilled' && (!result.value || !result.value.code))
						.map(result => result.value);
				} catch (error) {
					console.error("批量获取电影数据失败:", error);
				}
			},

			// 获取文件URL
			fetchFileUrl(filePath, movieId) {
				const requestData = {
					path: `${this.baseDirectory}/${filePath}`,
					password: '',
				};
				
				getAlistFile(requestData)
					.then(response => {
						const videoUrl = response.data.data.raw_url;
						this.fileUrl = videoUrl;
						this.navigateToPlayer(videoUrl, movieId);
					})
					.catch(error => {
						console.error("获取文件URL失败:", error);
					});
			},

			// 导航到播放器页面
			navigateToPlayer(videoUrl, movieId) {
				uni.navigateTo({
					url: `/pages/video/video?video_url=${encodeURIComponent(videoUrl)}&id=${movieId}`
				});
			},

			// 处理播放请求
			handleToPlayer(filePath, movieId) {
				this.fetchFileUrl(filePath, movieId);
			},
			
			goarticleList() {
				uni.navigateTo({
					url: '/pages/articleList/articleList'
				});
			},
			goSeries() {
				uni.navigateTo({
					url: '/pages/series/series'
				});
			},
			goYoutube() {
				uni.navigateTo({
					url: '/pages/youtube/index'
				});
			},
			goVideoList() {
				uni.navigateTo({
					url: '/pages/videos/list'
				});
			},
			goDetail() {
				uni.navigateTo({
					url: '/pages/detail/detail'
				});
			},
			goMovieList() {
				uni.navigateTo({
					url: '/pages/movie/movie'
				});
			},
			getMovie(searchKey) {
				let data = {
					path: this.baseDirectory,
					password: '',
					page: 1,
					per_page: 0,
					refresh: false
				}
				getAlist(data).then(res => {
					let allMovie = res.data.data.content
					let Movies = allMovie.filter(item => item.name.includes(searchKey));
					uni.navigateTo({
						url: '/pages/showSearch/showSearch?data=' + encodeURIComponent(JSON.stringify(
							Movies))
					});
				})
			},
			goSearch() {
				if (this.keyword == "") {
					alert("物电影名都无写，无知你想睇物");
				} else {
					this.getMovie(this.keyword)
				}
			},
			onPageScroll(e) {
				this.scrollListeners.forEach(component => {
					if (component && typeof component.updateFixedStatus === 'function') {
						component.updateFixedStatus(e.scrollTop);
					}
				});
			},
		},
		onPullDownRefresh() {
			// 重新获取电影数据
			this.fetchMovieFiles();
			uni.stopPullDownRefresh();
		}
	}
</script>

<style scoped>
	.myswiper {
		z-index: 100;
	}

	.h-main {
		position: relative;
		width: 100%;
	}

	.h-carousel {
		position: relative;
		justify-content: center;
		width: 100%;
		/* #ifdef APP-PLUS */
		padding-top: 114px;
		/* #endif */
		/* #ifndef APP */
		padding-top: 70px;
		/* #endif */
	}

	.h-content {
		background-color: var(--gray);
		width: 100%;
	}

	.m-items {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.movie-items {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.movie-item {
		border-radius: 5px;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		font-size: 9px;
		width: 110px;
		height: 110px;
	}

	.movie-item text {
		margin-top: 25px;
		text-align: center;
		font-size: 13px;
		font-weight: 1000;
	}

	.movie-items {
		width: 350px;
	}

	.tansuo {
		padding: 30px 20px 20px 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.tansuo .label {
		display: inline-block;
		font-size: 20px;
		letter-spacing: 15px;
		padding-left: 15px;
		font-weight: 1000;
	}
</style>