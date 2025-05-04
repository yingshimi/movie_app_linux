<template>
	<view class="">
		<view class="jiaohu fixed" @click="handlehome" id="search"
			:class="{ fixed: isfixed  }">
			<view class="title" >还没起名</view>
			<view class="input-container">
				<input type="text" name="text" class="input" placeholder="想睇物搜物" :value="value" @input="handleInput"
					@keyup.enter="handleSearch" />
				<text class="icon">
					<view class="t-icon t-icon-sousuo" @click="handleSearch"></view>
				</text>
			</view>
			<view class="donghua" >
				<image src="/static/icon/爆米花.svg" style="width: 30px; height: 30px;"></image>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				isfixed: false,
				statusBarHeight: 0,
			}
		},
		props: {
			value: String,

			goSearch: {
				type: Function,
				default: () => {}
			},

			gohome: {
				type: Function,
				default: () => {}
			},
			showFeilei: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			handleInput(event) {
				this.$emit('input', event.target.value);
			},

			handleSearch() {
				this.goSearch(this.value);
			},

			handlehome() {
				this.gohome();
			},

			// 从页面接收到的滚动事件
			updateFixedStatus(scrollTop) {
				if (scrollTop >= 30) {
					this.isfixed = true;
				} else {
					this.isfixed = false;
				}
			}
		},
		mounted() {
			// 告诉页面需要监听滚动事件
			uni.$emit('needScrollListener', this);
		},
		beforeDestroy() {
			// 组件销毁时取消监听
			uni.$emit('cancelScrollListener', this);
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					this.statusBarHeight = res.statusBarHeight;
					console.log("状态栏高度:=====================================================");
					console.log("状态栏高度:=====================================================");
					console.log("状态栏高度:=====================================================");
					console.log("状态栏高度:", this.statusBarHeight);
				},
				fail: (err) => {
					console.error("获取系统信息失败:", err);
				}
			});
		}
	};
</script>

<style scoped>
	.jiaohu {
		padding: 0 20px 0 20px;
		position: absolute;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		/* margin-top: 40px;s */
	}


	.jiaohu.fixed {
		position: fixed;
		z-index: 3;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		/* margin-top: 0; */
		height: 70px;
		background-color: rgb(255, 255, 255);
	}

	.jiaohu .title {
		width: 35px;
		height: 40px;
		font-size: 16px;
		font-weight: 1000;
	}

	.input-container {
		width: 240px;
		position: relative;
	}

	.icon-1 {
		margin-right: 5px;
		width: 25px;
		height: 25px;
	}

	.icon-2 {
		width: 25px;
		height: 25px;
	}

	.input-container .icon {
		position: absolute;
		right: 10px;
		top: calc(50% + 6px);
		transform: translateY(calc(-50% - 5px));
	}

	.input {
		/* background-color: var(--gray); */
		background-color: #f5f5f5ce;
		text-align: center;
		width: 100%;
		height: 40px;
		border-radius: 20px;
		padding: 10px;
		transition: 0.2s linear;
		border: none;
		font-size: 14px;
		text-transform: uppercase;
		letter-spacing: 2px;
		font-weight: 1000;
	}

	input::placeholder {
		font-size: 15px;
		font-weight: 1000;
		text-align: center;
	}

	input:focus {
		outline: none;
	}
</style>