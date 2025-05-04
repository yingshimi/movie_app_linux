<template>
	<view class="video-btn" @click="$emit('click')">
		<!-- 不能换行，不然有效果 -->
		<text class="iconfont" :style="'font-size:'+size+'px;'">{{icon}}</text>
		<!-- <view class="t-icon t-icon-dianshiju"></view> -->
	</view>
</template>

<script>
	export default {
		props: {
			icon: {
				type: String,
				default: ''
			},
			size: {
				type: [String, Number],
				default: 20
			}
		},
		created() {
			const d = weex.requireModule('dom');
			d.addRule('fontFace', {
				'fontFamily': "myIconfont",
				'src': "url('https://at.alicdn.com/t/c/font_4847358_y520i9kqb3b.ttf?t=1741163638868')"
			});
		},
	}
</script>

<style scoped>
	.video-btn {
		width: 44px;
		height: 44px;
		/* 默认就是flex布局,不需要设置 */
		/* display: flex; */
		/* flex-direction: row; */
		align-items: center;
		justify-content: center;
		/* background-color: aqua; */
	}

	.iconfont {
		font-family: myIconfont;
		color: white;
	}
</style>