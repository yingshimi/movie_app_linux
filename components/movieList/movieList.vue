<template>
	<ul class="show-post-items">
		<li class="show-post-item" v-for="(item, index) in items" :key="item.id || index" @click="toPlayer(item.path, item.id)">
			<view class="post-img">
				<image :src="getImageUrl(item)" mode="aspectFill"
					@error="handleError(index, $event)"></image>
			</view>
			<view class="post-info">
				<text class="post-title" :title="item.title || item.name || ''">{{ item.title || item.name || ''}}</text>
			</view>
		</li>
	</ul>
</template>

<script>
	export default {
		name: "movieList",
		props: {
			items: {
				type: Array,
				default: () => []
			}
		},
		methods: {
			toPlayer(path, id) {
				this.$emit("to-player", path, id);
			},
			handleError(index, event) {
				let img = event.target;
				if (this.items[index].img_url) {
					img.src = this.items[index].img_url;
				}
				img.onerror = null;
			},
			getImageUrl(item) {
				// 处理不同来源的图片URL
				if (item.poster && item.poster.startsWith('/')) {

					// TMDB格式
					return 'https://image.tmdb.org/t/p/w500' + item.poster;
				} else if (item.poster_url) {
					// 首页API格式
					return '//images.weserv.nl/?url=' + item.poster_url;
				} else if (item.poster) {
					// 其他可能的格式
					return '//images.weserv.nl/?url=' + item.poster;
				}
				// 默认图片
				return '/static/images/default-poster.png';
			}
		}
	};
</script>

<style scoped>
	.show-post-items {
		margin: 20px 0 20px 0;
		display: grid;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		grid-template-columns: repeat(3, 100px);
		width: 350px;
	}

	.show-post-item {
		margin-bottom: 20px;
		width: 100px;
		height: 165px;
		/* background-color: aquamarine; */
		position: relative;
		box-sizing: border-box;
		display: inline-block;
		/* background-color: #fff; */
		/* box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2); */
		-webkit-filter: saturate(70%) contrast(85%);
		filter: saturate(70%) contrast(85%);
	}

	.show-post-item image {
		/* border-radius: 10px 10px 0 0; */
		width: 100%;
		height: 140px;
	}

	.show-post-item:before {
		content: '';
		width: 100%;
		height: 4%;
		left: 0;
		bottom: -4%;
		position: absolute;
		background-repeat: no-repeat;
/* 		background-image: linear-gradient(177deg, rgba(0, 0, 0, 0.22) 10%, transparent 50%), linear-gradient(-177deg, rgba(0, 0, 0, 0.22) 10%, transparent 50%); */
		background-size: 49% 100%;
		background-position: 2% 0, 98% 0;
	}

	.show-post-item:after {
		content: '';
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		position: absolute;
		z-index: 2;
		background-repeat: no-repeat;
		background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1) 0.5%, rgba(0, 0, 0, 0.15) 1.2%, transparent 1.2%), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0.5%, rgba(0, 0, 0, 0.15) 1.2%, transparent 1.2%), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0.5%, rgba(0, 0, 0, 0.15) 1.2%, transparent 1.2%), linear-gradient(265deg, rgba(0, 0, 0, 0.2), transparent 10%), linear-gradient(5deg, rgba(0, 0, 0, 0.2), transparent 15%), linear-gradient(-5deg, rgba(0, 0, 0, 0.1), transparent 10%), linear-gradient(5deg, rgba(0, 0, 0, 0.1), transparent 10%), linear-gradient(-265deg, rgba(0, 0, 0, 0.2), transparent 10%), linear-gradient(-5deg, rgba(0, 0, 0, 0.2), transparent 15%), linear-gradient(266deg, rgba(0, 0, 0, 0.2), transparent 10%);
		background-size: 50% 100%, 100% 33.3333%, 100% 33.3333%, 50% 33.3333%, 50% 33.3333%, 50% 33.3333%, 50% 33.3333%, 50% 33.3333%, 50% 33.3333%, 50% 33.3333%;
		background-position: right top, left center, left bottom, left top, left top, right top, left center, right center, right center, left bottom;
	}

	.post-info {
		width: 100%;
		padding: 4px 0;
		box-sizing: border-box;
		overflow: hidden;
	}

	.post-title {
		display: block;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 13px;
		font-weight: 500;
	}
</style>