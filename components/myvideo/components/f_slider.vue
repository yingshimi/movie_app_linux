<template>
	<view class="progress-box" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"
		@touchcancel="touchcancel" style="padding: 0 15px 0 15px;">
		<view class="progress">
			<view class="rail" :style="activeStyle">
			</view>
		</view>
		<view class="dot" :style="activeDotStyle" style="position: absolute;">
			<f-icon-btn :size="13" :icon="'\ue677'"></f-icon-btn>
		</view>
	</view>
</template>

<script>
	import fIconBtn from './f-icon-btn.vue'
	export default {
		components: {
			fIconBtn
		},
		methods: {
			active() {
				this.activeWidth = this.duration == 0 ? 0 : (this.currentTime / this.duration) * this.width
			},
			touchstart(e) {
				if (this.duration === 0) return
				this.moveStatus = true
				// console.log('============这是什么东西====================', e.changedTouches[0].screenX)
				this.activeWidth = e.changedTouches[0].screenX - this.left
			},
			touchmove(e) {
				if (this.duration === 0) return
				let d = e.changedTouches[0].screenX - this.left
				if (d <= 0) {
					this.activeWidth = 0
				} else if (d >= this.width) {
					this.activeWidth = this.width
				} else {
					this.activeWidth = d
				}
				this.$emit('update', this.current)
			},
			touchend(e) {
				if (this.duration === 0) return
				this.moveStatus = false
				this.$emit('change', this.current)
			},
			touchcancel() {
				this.touchend(e)
			},
		},
		inject: ['v'],
		props: {
			currentTime: {
				type: Number,
				default: 0
			},
			duration: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				activeWidth: 0,
				width: 0,
				moveStatus: false,
				left: 0
			}
		},
		created() {
			console.log('屏幕的宽度=======================')
			console.log(this.v.windowWidth)
			console.log(this.v.screenWidth)
			if (!this.v.fullScreenStatus) {
				this.width = this.v.windowWidth - 30 - 30 - 100 - 30
				this.left = 45
				console.log('========非全屏==============')
				console.log(this.width)
			} else {
				this.width = this.v.windowHeight - 50
				this.left = 25
				console.log('========全屏==============')
				console.log(this.width)
			}

			this.active()

		},
		computed: {
			activeStyle() {
				return `width:${this.activeWidth}px`
			},
			activeDotStyle() {
				return `left:${this.activeWidth}px`
			},
			current() {
				return this.width == 0 ? 0 : (this.activeWidth / this.width) * this.duration
			}
		},
		watch: {
			currentTime(newValue, oldValue) {
				if (!this.moveStatus) {
					this.active()
				}
			}
		},
	}
</script>

<style scoped>
	.rail {
		height: 5px;
		background-color: aquamarine;
		width: 20px;
		border-radius: 10px;
	}

	.progress {
		flex: 1;
		height: 5px;
		background-color: rgba(255, 255, 255, 0.5);
		border-radius: 10px;
	}

	.progress-box {
		height: 44px;
		display: flex;
		flex-direction: row;
		align-items: center;
		position: relative;
	}
</style>