<template>
	<view class="custom-tabbar">
		<view class="tabbar-item" :class="{ active: currentPath === 'pages/index/index' }"
			@click="switchTab('/pages/index/index')">
			<view class="">
				<image :src="currentPath === 'pages/index/index' ? selectedIconPath1 : iconPath1" class="tabbar-icon"
					mode="aspectFit" />
			</view>
			<view class="">
				<text class="tabbar-text">首页</text>
			</view>
		</view>

		<view class="tabbar-item" :class="{ active: currentPath === 'pages/test/test' }"
			@click="switchTab('/pages/test/test')">
			<view class="">
				<image :src="currentPath === 'pages/test/test' ? selectedIconPath2 : iconPath2" class="tabbar-icon"
					mode="aspectFit" />
			</view>
			<view class="">
				<text class="tabbar-text">测试</text>
			</view>
		</view>

		<view class="tabbar-item" :class="{ active: currentPath === 'pages/login/login' }"
			@click="switchTab('/pages/login/login')">
			<view class="">
				<image :src="currentPath === 'pages/login/login' ? selectedIconPath3 : iconPath3" class="tabbar-icon"
					mode="aspectFit" />
			</view>
			<view class="">
				<text class="tabbar-text">我的</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'custom-tabbar',
		data() {
			return {
				iconPath1: "/static/icon/爆米花_1.svg", // 首页默认图标
				selectedIconPath1: "/static/icon/爆米花_2.svg", // 首页选中图标
				iconPath2: "/static/icon/我的_1.svg", // 测试默认图标
				selectedIconPath2: "/static/icon/我的.svg", // 测试选中图标
				iconPath3: "/static/icon/我的_1.svg", // 我的默认图标
				selectedIconPath3: "/static/icon/我的.svg", // 我的选中图标
				currentPath: "pages/index/index", // 当前选中的 tab 路径
			};
		},
		methods: {
			// 切换 tab
			switchTab(path) {
				this.currentPath = path.replace("/", ""); // 更新 currentPath
				uni.redirectTo({
					url: path, // 使用 uni.redirectTo 跳转页面
				});
			},
			updateCurrentPath() {
				const currentPage = getCurrentPages()[getCurrentPages().length - 1].route; // 获取当前页面路径
				this.currentPath = currentPage; // 更新 currentPath
				console.log("当前页面路径：", this.currentPath);
			},
		},
		// onShow() {
		// 	this.updateCurrentPath(); 
		// },
		created() {
			console.log("组件创建时初始化 currentPath");
			this.updateCurrentPath(); // 初始化 currentPath
		},
	};
</script>

<style>
	.custom-tabbar {
		padding: 0 45px 0 45px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 60px;
		background-color: #ffffff;
		box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
	}

	.tabbar-item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		cursor: pointer;
	}

	.tabbar-icon {
		width: 25px;
		height: 25px;
	}

	.tabbar-text {
		font-size: 11px;
		color: #7a7e83;
		font-weight: 1000;
	}

	.tabbar-item.active .tabbar-text {
		color: var(--primary-color);
	}
</style>