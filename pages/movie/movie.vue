<template>
	<view>
		<view style="display: flex; flex-direction: row;justify-content: center;align-items: center;">
			<movieList :items="movieList" @to-player="handleToPlayer"></movieList>
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

	export default {
		onLoad(options) {
			if(options.title === '漫威宇宙'){
				this.baseDirectory = '/夸克网盘/电影/漫威'
			}
		},
		data() {
			return {
				fileList: [],
				movieList: [],
				baseDirectory: '/夸克网盘/电影/漫威',
				fileUrl: '',
				results: []
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
			}
		},
		created() {
			this.fetchMovieFiles();
		},
		onPullDownRefresh() {
			// 重新获取电影数据
			this.fetchMovieFiles();
			uni.stopPullDownRefresh();
		}
	};
</script>

<style>
</style>