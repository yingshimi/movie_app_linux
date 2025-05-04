<template>
	<view>
		<view style="display: flex; flex-direction: row;justify-content: center;align-items: center;">
			<movieList :items="movieResults" @to-player="toPlayer"></movieList>
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
	} from '@/static/api/other';

	export default {
		onLoad(options) {
			this.root = JSON.parse(decodeURIComponent(options.data))
		},
		data() {
			return {
				movieNames: [],
				movieResults: [],
				// path: '/夸克网盘/电影/漫威电影/漫威 合集',
				// path: '/夸克网盘/电影/漫威',
				path: '/夸克网盘/剧集/豆瓣250',
				file_url: '',
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
					const res = await tmdbSearch(params);
					// console.log(res.data);
					return res.data.results || [];
				} catch (error) {
					console.error("请求失败:", error);
					return [];
				}
			},

			// 获取电影数据
			async fetchMovieData(movie) {
				const movieName = movie.title
				const queryParts = movieName.split(".");
				const query = queryParts[0];
				const year = queryParts.length > 1 ? queryParts[1] : null;
				const searchResults = await this.searchMovie(query, year);
				try {
					const searchResults = await this.searchMovie(query, year);

					if (searchResults.length > 0) {
						const firstMovie = searchResults[0].basic_info;
						return {
							name: movieName,
							title: firstMovie.title,
							year: year,
							id: firstMovie.id,
							poster: firstMovie.poster_path,
							path: movie.path
						};
					} else {
						// 如果没有找到电影，返回一个包含错误信息的对象
						return {
							name: movieName,
							error: "未找到相关电影",
							code: 404
						};
					}
				} catch (error) {
					// 如果请求失败（例如 404），拒绝 Promise
					throw new Error(`请求失败: ${error}`);
				}
			},

			// 并发获取所有电影数据
			async fetchAllMovieData() {
				const promises = this.movieNames.map(name => this.fetchMovieData(name));
				const results = await Promise.all(promises);
				this.movieResults = results;
			},

			getfile(e, id) {
				let data = {
					path: `${this.path}/${e}`,
					password: '',
				}
				getAlistFile(data).then(res => {
					this.file_url = res.data.data.raw_url
					uni.navigateTo({
						url: '/pages/video/video?video_url=' + encodeURIComponent(res.data.data.raw_url) +
							'&id=' + id
					});
				})
			},

			getFileName(e) {
				const pattern =
					/(\d+)\.(.*?)(\d{4})\./;
				const results = [];
				console.log('===============这是什么数据=======================')
				console.log(this.root)
				for (const item of this.root) {
					const match = pattern.exec(item.name);
					if (match) {
							const movieName = match[2].replace(/\./g, " ").trim();

							const year = match[3];
						if (year) {
							results.push({
								'path': item.name,
								'name': movieName,
								'year': year,
								'title': `${movieName}.${year}`
							});
						}
					}
				}
				this.movieNames = results
				this.fetchAllMovieData()
			},

			// // 搜索电影
			// async searchMovie(query, year = null) {
			// 	const params = {
			// 		query: query,
			// 		language: "zh-CN",
			// 		page: "1",
			// 		include_adult: "false"
			// 	};
			// 	if (year) {
			// 		params.year = year;
			// 	}
			// 	try {
			// 		const res = await tmdbSearch(params);
			// 		// console.log('================最原始的请求==========================')
			// 		// console.log(res.data)
			// 		return res.data || [];
			// 	} catch (error) {
			// 		console.error("请求失败:", error);
			// 		return [];
			// 	}
			// },

			// // 获取电影数据
			// async fetchMovieData(movie) {
			// 	const movieName = movie.title
			// 	const queryParts = movieName.split(".");
			// 	const query = queryParts[0];
			// 	const year = queryParts.length > 1 ? queryParts[1] : null;
			// 	const searchResults = await this.searchMovie(query, year);
			// 	try {
			// 		const searchResults = await this.searchMovie(query, year);

			// 		if (searchResults.length > 0) {
			// 			const firstMovie = searchResults[0];
			// 			return {
			// 				name: movieName,
			// 				title: firstMovie.title,
			// 				year: year,
			// 				id: firstMovie.id,
			// 				poster: firstMovie.poster_path,
			// 				path: movie.path
			// 			};
			// 		} else {
			// 			// 如果没有找到电影，返回一个包含错误信息的对象
			// 			return {
			// 				name: movieName,
			// 				error: "未找到相关电影",
			// 				code: 404
			// 			};
			// 		}
			// 	} catch (error) {
			// 		// 如果请求失败（例如 404），拒绝 Promise
			// 		throw new Error(`请求失败: ${error}`);
			// 	}
			// 	// if (searchResults.length > 0) {
			// 	// 	const firstMovie = searchResults[0];
			// 	// 	return {
			// 	// 		name: movieName,
			// 	// 		title: firstMovie.title,
			// 	// 		year: year,
			// 	// 		id: firstMovie.id,
			// 	// 		poster: firstMovie.poster_path,
			// 	// 		path: movie.path
			// 	// 	};
			// 	// } else {
			// 	// 	return {
			// 	// 		name: movieName,
			// 	// 		error: "未找到相关电影"
			// 	// 	};
			// 	// }
			// },

			// getFileName(e) {
			// 	let data = {
			// 		path: this.path,
			// 		password: '',
			// 		page: 1,
			// 		per_page: 0,
			// 		refresh: false
			// 	}

			// 	getAlist(data).then(res => {
			// 		const pattern =
			// 			/(\d+)\.(.*?)(\d{4})\./;
			// 		const results = [];

			// 		for (const item of res.data.data.content.slice(0, 10)) {

			// 			const match = pattern.exec(item.name);

			// 			if (match) {
			// 				const movieName = match[2].replace(/\./g, " ").trim();

			// 				const year = match[3];
			// 				if (year) {
			// 					results.push({
			// 						'path': item.name,
			// 						'name': movieName,
			// 						'year': year,
			// 						'title': `${movieName}.${year}`
			// 					});
			// 				}
			// 			}
			// 		}
			// 		this.movieNames = results
			// 		// this.movieNames = results
			// 		this.fetchAllMovieData()
			// 	})
			// },

			// // 并发获取所有电影数据
			// async fetchAllMovieData() {
			// 	const promises = this.movieNames.map(name => this.fetchMovieData(name));
			// 	// console.log(promises)
			// 	// const results = await Promise.all(promises);
			// 	const results = await Promise.allSettled(promises);

			// 	// this.movieResults = results.map(item=>item.value);
			// 	this.movieResults = results.filter(item => {
			// 		if (item.status === 'fulfilled' && item.value && item.value.code) {
			// 			return false; // 过滤掉 code 存在的 item
			// 		}
			// 		return true; // 保留其他 item
			// 	}).map(item => item.value);
			// 	console.log(results)
			// 	console.log(this.movieResults)
			// },

			// getfile(e, id) {
			// 	let data = {
			// 		path: `${this.path}/${e}`,
			// 		password: '',
			// 	}
			// 	getAlistFile(data).then(res => {
			// 		this.file_url = res.data.data.raw_url
			// 		uni.navigateTo({
			// 			url: '/pages/video/video?video_url=' + encodeURIComponent(res.data.data.raw_url) +
			// 				'&id=' + id
			// 		});
			// 	})
			// },

			toPlayer(path, id) {
				this.getfile(path, id)
			}
		},
		created() {
			this.getFileName()
		}
	};
</script>

<style>
</style>