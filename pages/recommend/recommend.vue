<template>
	<view>
		<view class="show-movie" v-for="item in movies" :key="item.id">
			<view class="post-item">
				<view class="fenlei-img">
					<image class="pingtu" v-for="(item, index) in item.img" :key="index" :src="item" mode="aspectFill"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getPoster
	} from '@/static/api/other';
	export default {
		data() {
			return {
				movies: [{
					title: "最新电影",
					img: [

					]
				}, ],
			}
		},
		methods: {
			getRecommendData() {
				getPoster('电影').then(res => {
					let movies = res.slice(0, 14)
					let films = movies.map(movie => movie.name);
					this.movies[0].img = films
				}).catch(err => {
					console.error('获取推荐数据失败:', err)
				})
			}
		},
		onPullDownRefresh() {
			this.getRecommendData();
			uni.stopPullDownRefresh();
		},
		mounted() {
			this.getRecommendData();
		}
	}
</script>

<style scoped>
	.show-movie {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
	}

	.post-item {
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
	}

	.fenlei-img {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		margin-bottom: 20px;
		width: 350px;

		height: 150px;
		flex-wrap: wrap;
	}


	.fenlei-img image {
		width: 50px;
		height: 75px;
		object-fit: cover;
	}
</style>