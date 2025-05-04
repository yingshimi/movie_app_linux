<script>
	export default {
		globalData: {
			ip: '192.168.6.46'
		},
		onLaunch: function() {
			console.log('App Launch'),
			console.log(this.$store.state.user)
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import '@/static/reset.css';
	@import url('/static/iconfont-weapp-icon.css');
	@import "@/uni_modules/uview-ui/index.scss";

	:root {
		--primary-color: #90d7ec;
		/* 主色调 */
		--secondary-color: #515151;
		/* 辅助色 */
		--text-color: #333;
		/* 文字颜色 */
	}

	/* 全局隐藏滚动条 */
	::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
	}

	/* 隐藏nvue平台的滚动条 */
	/* #ifdef APP-NVUE */
	.scroll-view {
		scrollbar-width: none;
	}
	/* #endif */
</style>