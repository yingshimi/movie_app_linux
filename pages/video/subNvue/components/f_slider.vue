<template>
	<view class="jindutiao-1" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"
		@touchcancel="touchcancel">
		<view class="jindutiao-2">
			<view class="rail" :style="activeStyle">
			</view>
		</view>
		<view class="yuanDian" :style="activeDotStyle">
		</view>
	</view>
</template>

<script>
	export default {

		methods: {
			active() {
				this.activeWidth = this.duration == 0 ? 0 : (this.currentTime / this.duration) * this.width
			},
			touchstart(e) {
				if (this.duration === 0) return
				this.moveStatus = true
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
				left:0
			}
		},
		created() {
			if (!this.v.fullScreenStatus) {
				this.width = this.v.windowWidth - 44 - 44 - 80 - 12
				this.left = 44 
			}else{
				this.width = this.v.windowHeight - 30 -12
				this.left = 12
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
	.yuanDian {
		position: absolute;
		width: 12px;
		height: 12px;
		border-radius: 100%;
		background-color: aquamarine;
		left: 100px;
	}

	.rail {
		height: 3px;
		background-color: aquamarine;
		width: 20px;
	}

	.jindutiao-2 {
		flex: 1;
		height: 3px;
		background-color: rgba(255, 255, 255, 0.5);
		border-radius: 10px;
	}

	.jindutiao-1 {
		height: 44px;
		display: flex;
		flex-direction: row;
		align-items: center;
		position: relative;
	}
</style>