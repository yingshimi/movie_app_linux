<template>
	<view style="display: flex;flex-direction: row;align-items: center;width: 100%;height: 100vh;position: relative">
		<view
			style="display: flex;flex-direction: row;flex-wrap: wrap;align-items: center;justify-content: center;">
			<view v-for="(item,index) in movies" :key="index" style="width: 30px; height: 50px;margin-top: 5px;">
				<image style="width: 30px; height: 50px;" :src="item" mode="aspectFill"></image>
			</view>
			
		</view>
<!-- 	<view style="position: absolute;inset: 0;background-color: rgba(255,255,255,0.7);filter: blur(20px);">
		
	</view> -->
	</view>
</template>

<script>
	import {
		getPoster
	} from '@/static/api/other';
	export default {
		data() {
			return {
				movies: [],
			}
		},
		methods: {},
		mounted() {
			getPoster('电影').then(res => {
				let movies = res.data.slice(0, 13)
				// console.log(movies)
				let films = movies.map(movie => movie.name);
				// console.log(films)
				this.movies = films
			})
			// this.getFilmData();
		}
	}
</script>

<style scoped>
	view {
		margin: 0;
		padding: 0;
	}
</style>