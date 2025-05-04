<template>
	<view class="video-btn" @click="$emit('click')">
		<!-- 不能换行，不然有效果 -->
		<text class="iconfont" :style="'font-size:'+size+'px;color:'+color+';'">{{icon}}</text>
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
			},
			color:{
				type:[String],
				default:'white'
			}
		},
		created() {
			const d = weex.requireModule('dom');
			d.addRule('fontFace', {
				'fontFamily': "myIconfont",
				'src': "url('https://at.alicdn.com/t/c/font_4569760_vkmbd2ajfci.ttf?t=1743044716600')"
			});
		},
	}
	
</script>

<style scoped>
	.video-btn {
		width: 30px;
		height: 30px;
		/* 默认就是flex布局,不需要设置 */
		/* display: flex; */
		/* flex-direction: row; */
		align-items: center;
		justify-content: center;
		/* background-color: aquamarine; */
	}

	.iconfont {
		font-family: myIconfont;
	}
</style>