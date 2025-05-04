<template>
	<view>
		<view>
			<!-- <button @click="test" class="test" style="height: 50px;width: 200px;">跳转到视频页面</button> -->
			<button @click="test_movie" class="test" style="height: 50px;width: 200px;">影视列表</button>
			<!-- <button @click="test_player" class="test" style="height: 50px;width: 200px;">跳转到播放器页面</button> -->
			<!-- <button @click="test_ui" class="test" style="height: 50px;width: 200px;">跳转到播放器页面</button> -->
			<!-- <button @click="test_image" class="test" style="height: 50px;width: 200px;">图片拼接</button> -->
			<!-- <button @click="login" class="test" style="height: 50px;width: 200px;">登陆</button> -->
			<!-- <button @click="goarticle" class="test" style="height: 50px;width: 200px;">文章</button> -->
			<!-- <button @click="goarticleeditor" class="test" style="height: 50px;width: 200px;">编辑器</button> -->
			<button @click="goarticleList" class="test" style="height: 50px;width: 200px;">文章列表页</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: {
					username: "",
					password: "",
				},
				status: "",
				width: 0,
				height: 0,
				kh: ''
			};
		},
		methods: {
			goarticleList() {
				uni.navigateTo({
					url: '/pages/articleList/articleList'
				});
			},
			goarticleeditor() {
				uni.navigateTo({
					url: '/pages/article-editor/article-editor'
				});
			},
			goarticle() {
				uni.navigateTo({
					url: '/pages/article/article'
				});
			},
			login() {
				uni.navigateTo({
					url: '/pages/login/login'
				});
			},
			test_image() {
				uni.navigateTo({
					url: '/pages/imageStitch/imageStitch' 
				});
			},
			test_player() {
				uni.navigateTo({
					url: '/pages/video/video' 
				});
			},
			test_ui() {
				uni.navigateTo({
					url: '/pages/test/test' // 目标页面路径
				});
			},
			test() {
				uni.navigateTo({
					url: '/pages/cloud/cloud' // 目标页面路径
				});
			},
			test_movie() {
				uni.navigateTo({
					url: '/pages/movie/movie' // 目标页面路径
				});
			},
		},
		created() {
			let res = uni.getSystemInfoSync()
			this.statusBarHeight = res.statusBarHeight
			this.height = res.windowHeight
			this.width = res.windowWidth
			this.kh = `width:${this.width}px;height:${this.height}px`
		}
	}
</script>

<style scoped>
	.login-main {
		height: 100svh;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.login-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(255, 255, 255, 0.3);
		height: 300px;
		width: 320px;
		border-radius: 5px;
		backdrop-filter: blur(5px);
	}

	.input-item {
		display: block;
		width: 100%;
		margin-bottom: 20px;
		border: none;
		padding: 10px;
		font-size: 15px;
		font-weight: 1000;
		border-radius: 10px;
		background-color: rgba(159, 188, 252, 0.61);
		outline: none;
	}

	.input-item::placeholder {
		font-size: 15px;
		font-weight: 500;
	}

	.btn {
		border: none;
		letter-spacing: 20px;
		font-weight: 1000;
		padding: 10px;
		width: 100%;
		margin-top: 20px;
		background-color: rgba(104, 225, 215, 0.414);
		font-size: 15px;
		border-radius: 10px;
	}
</style>