<template>
	<view style="width: 100%; height: 100vh;display: flex;justify-content: center;align-items: center;">
		<view style="margin: 0 20px 0 20px;">
			<text style="line-height: 1.5;letter-spacing: 10px;">{{text}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			this.text = options.text
		},
		data() {
			return {
				text: ''
			}
		},
		methods: {

		}
	}
</script>

<style>

</style>