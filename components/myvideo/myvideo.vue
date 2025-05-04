<template>
	<view>
		<video id="video" ref="video" :src="decodeURIComponent(video_url)" style="height: 225px; width: 750rpx;"
			:controls="false" :show-center-play-btn="false" :show-fullscreen-btn="false" :show-progress="false"
			@fullscreenchange="fullscreenchange" @timeupdate="timeupdate" @play="isplay = true" @pause="isplay = false"
			:poster="poster" @loadedmetadata="loadedmetadata" @ended="onVideoEnded">
			<view :style="videoBox" style="display: flex;align-items: center;justify-content: center;">
				<!-- 蒙版 -->
				<!-- 								<view class="mengBan" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
				</view> -->
				<view class="mengBan" @touchstart="touchStart" @touchend="touchEnd">
				</view>
				<view v-if="fullScreenStatus && (showStatusBarStatus || lockSreenStatus)"
					style="position: absolute;top: 0;left: 0;bottom: 0;width: 100px;display: flex;flex-direction: row; align-items: center;justify-content: center;">
					<!-- 锁屏 -->
					<view @click="lockSreen"
						style="background-color: rgba(0,0,0,0.3);border-radius: 8px;display: flex; align-items: center;justify-content: center;">
						<f-icon-btn :icon="'\ue65a'" :color="lockSreenStatus?'pink':'white'"></f-icon-btn>
					</view>
				</view>
				<!-- 提示框 -->
				<view class="tip" v-if="showToastStatus">
					<text class="tip-text"
						v-if="toast.type === 'progress'">{{currentTime | formatTime}}/{{duration | formatTime}}</text>
					<text class="tip-text" v-if="toast.type === 'msg'">{{toast.msg}}</text>
				</view>
				<!-- 全屏控制条 -->
				<!-- 顶部 -->
				<view class="video-bg-top" v-if="showStatusBarStatus && fullScreenStatus" style="margin: 20px 0 0 15px;">
					<view style="display: flex;flex-direction: row;align-items: center;">
						<view class="video-top-back" style="height: 30px;">
							<f-icon-btn :icon="'\ue60d'" @click="fullOrExitScreen"></f-icon-btn>
						</view>
						<view style="flex: 1;">
							<text style="color: white;font-weight: 500;">{{title}}</text>
						</view>
					</view>
				</view>
				<!-- 底部 -->
				<view class="video-bg-bottom" v-if="showStatusBarStatus  && fullScreenStatus" style="height: 88px;">
					<view>
						<view style="height: 30px;padding: 0 10px 0 10px;">
							<f-slider :duration="duration" :currentTime="currentTime" @change="sliderChange"
								@update="sliderUpdate"></f-slider>
						</view>
						<view
							style="padding: 0 0 0 15px;align-items: center; display: flex;flex-direction: row;justify-content: space-between;">
							<view class="video-bg-bottom-1" style="">
								<f-icon-btn v-if="!isplayer" :icon="'\uea8d'" @click="playOrPause"></f-icon-btn>
								<f-icon-btn v-else :icon="'\ue617'" @click="playOrPause"></f-icon-btn>
								<view class="jindutiao-5">
									<text
										class="jindutiao-6">{{currentTime | formatTime}}/{{duration | formatTime}}</text>
								</view>
							</view>
							<view
								style="justify-content: center;align-items: center; display: flex;flex-direction: row;padding-right: 15px;">
								<view @click="openDrawer('速度')" style="margin-right: 10px;">
									<text style="color: white;font-weight: 900;font-size: 15px;">{{rate}}X</text>
								</view>
								<!-- 							<view style="margin-right: 10px;" @click="openDrawer('video')">
									<text style="color: aliceblue;font-weight: 1000; font-size: 12px;">选集</text>
								</view> -->
								<!-- 								<view style="margin-right: 10px;" @click="openDrawer('quality')">
									<text
										style="color: aliceblue;font-weight: 1000; font-size: 12px;">{{quality|formatQuality}}</text>
								</view> -->
							</view>
						</view>
					</view>
				</view>
				<!-- 弹框 -->
				<view v-if="fullScreenStatus && showDrawer"
					style="position: absolute;top: 0;right: 0;bottom: 0;display: flex; background-color: rgba(0,0,0,0.5);">
					<!-- 速度 -->
					<view v-if="drawerType === '速度' " style="width: 100px;display: flex;flex: 1;">
						<view v-for="(item,index) in rateList" :key="index" @click="changeRate(item)"
							style="flex: 1;display: flex; flex-direction: row;align-items: center;justify-content: center;">
							<text :style="item === rate?'color:pink;':'color: white;'">{{item}}</text>
						</view>
					</view>
					<view v-else-if="drawerType === 'video' " style="width: 300px;display: flex;">
						<scroll-view scroll-y="true" style="flex: 1;padding: 20rpx;">
							<view v-for="(item,index) in videoList" :key="index" @click="changeVideo(item,index)"
								style="border-color: white; border:1px;padding: 20rpx;display: flex;flex-direction: row;border-radius: 5px;margin-bottom: 20rpx;">
								<text :style="videoIndex === index?'color:pink;':'color: white;'"
									style="color: white;font-size: 12px;font-weight: 500;">{{item.title}}</text>
							</view>
						</scroll-view>
					</view>
					<!-- 清晰度 -->
					<view v-else style="width: 100px;display: flex;flex: 1;">
						<view v-for="(item,index) in qualityList" :key="index" @click="changeQuality(item)"
							style="flex: 1;display: flex; flex-direction: row;align-items: center;justify-content: center;">
							<text :style="item.value === quality?'color:pink;':'color: white;'">{{item.name}}</text>
						</view>
					</view>

				</view>

			</view>
		</video>
		<!-- 非全屏 -->
		<!-- 顶部 -->
		<view class="video-bg-top" v-if="showStatusBarStatus && !fullScreenStatus">
			<view class="video-top" :style="'height: '+statusBarHeight+'px;'"></view>
			<view style="display: flex;flex-direction: row;align-items: center;">
				<view class="video-top-back" style="height: 30px;">
					<f-icon-btn :icon="'\ue60d'" @click="back"></f-icon-btn>
				</view>
				<view style="flex: 1;">
					<text style="color: white;font-weight: 500;">{{title}}</text>
				</view>
			</view>
		</view>
		<!-- 底部 -->
		<view class="video-bg-bottom" v-if="showStatusBarStatus && !fullScreenStatus">
			<view class="video-bg-bottom-1">
				<f-icon-btn :size="18" v-if="!isplayer" :icon="'\uea8d'" @click="playOrPause" ></f-icon-btn>
				<f-icon-btn :size="18" v-else :icon="'\ue617'" @click="playOrPause"></f-icon-btn>
				<view  style="	flex: 1;">
					<f-slider :duration="duration" :currentTime="currentTime" @change="sliderChange"
						@update="sliderUpdate"></f-slider>
				</view>
				<view class="jindutiao-5">
					<text class="jindutiao-6">{{currentTime | formatTime}}/{{duration | formatTime}}</text>
				</view>
				<f-icon-btn :icon="'\ueb11'" @click="fullOrExitScreen"></f-icon-btn>
			</view>
		</view>
	</view>
</template>


<style scoped>
	.tip-text {
		font-size: 12px;
		font-weight: 1000;
		color: white;
		padding: 10px;
		border-radius: 5px;
	}

	.mengBan {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}

	.tip {
		background-color: rgba(0, 0, 0, 0.6);
		filter: blur(5px);
		height: 25px;
		border-radius: 8px;
		display: flex;
		justify-content: center;
		flex-direction: row;
		align-items: center;
	}

	.zhongJian {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.jindutiao-6 {
		color: white;
		font-size: 13px;
		font-weight: 500;
	}

	.jindutiao-5 {
		width: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.jindutiao {}

	.video-bg-bottom {
		background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 44px;
	}

	.video-bg-bottom-1 {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.video-bg-top {
		background-image: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
	}
</style>

<script>
	const d = weex.requireModule('dom');
	let videoCTX = null
	let showToastTimer = null
	let timer = null
	import fIconBtn from './components/f-icon-btn.vue'
	import fSlider from './components/f_slider.vue'

	const demoLst = [{
		index: 0,
		title: "ASDFGH",
		list: [{
			name: "标清",
			value: 'SD',
			url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4'
		}, {
			name: "高清",
			value: 'HD',
			url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4'
		}, {
			name: "蓝光",
			value: '1080p',
			url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4'
		}]
	}, {
		index: 0,
		title: "FSERGESBR",
		list: [{
			name: "标清",
			value: 'SD',
			url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4'
		}, {
			name: "高清",
			value: 'HD',
			url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4'
		}, {
			name: "蓝光",
			value: '1080p',
			url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4'
		}]
	}, {
		index: 0,
		title: "NSTXDNTFN",
		list: [{
			name: "标清",
			value: 'SD',
			url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4'
		}, {
			name: "高清",
			value: 'HD',
			url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4'
		}, {
			name: "蓝光",
			value: '1080p',
			url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4'
		}]
	}, ]

	export default {
		name: "myvideo",
		props: {
			video_url: String,
			title: String
		},
		data() {
			return {
				testurl: encodeURIComponent('https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/uni-app-video-courses.mp4'),
				src: "",
				poster: '',
				isplayer: false,
				statusBarHeight: 0,
				currentTime: '',
				duration: '',
				windowHeight: 0,
				windowWidth: 0,
				fullScreenStatus: false,
				showToastStatus: false,
				toast: {
					type: "msg",
					msg: "提示",
				},
				showStatusBarStatus: true,
				oldTouchs: {},
				oldValue: {},
				dbcount: 0,
				touchType: null,
				platform: "android",
				drawerType: "速度",
				rate: "1.0",
				rateList: ['2.0', '1.5', '1.25', '1.0', '0.8', '0.5'],
				showDrawer: false,
				videoIndex: 0,
				videoList: [],
				quality: "HD",
				lockSreenStatus: false
			}
		},


		methods: {
			onVideoEnded() {
				this.playOrPause()
			},
			lockSreen() {
				this.lockSreenStatus = !this.lockSreenStatus
				if (this.lockSreenStatus) {
					this.hideStatusBar()
				} else {
					this.showStatusBar()
				}

			},
			changeQuality(item) {

				videoCTX.pause()
				if (!item.url) {
					return uni.showToast({
						title: '视频链接不存在',
						icon: 'none'
					})
				}
				this.src = item.url
				this.quality = item.value
				uni.showToast({
					title: '清晰度切换为:' + item.name,
					icon: 'none'
				})
				setTimeout(() => {
					videoCTX.play()
				}, 300)
			},
			changeVideo(item, index) {
				this.videoIndex = index
				videoCTX.stop()
				let list = this.videoList[index].list
				// 这是什么
				let i = list.findIndex(v => v.value === this.quality)
				if (i === -1) {
					if (list.length > 0) {
						this.src = list[0].url
					} else {
						return uni.showToast({
							title: '视频链接不存在',
							icon: 'none'
						})
					}
				} else {
					this.src = list[i].url
				}
				uni.showToast({
					title: '切换到：' + item.title,
					icon: 'none'
				});
				setTimeout(() => {
					videoCTX.seek(0)
					videoCTX.play()
				}, 300)
				this.showDrawer = false
			},
			changeRate(item) {
				this.rate = item
				videoCTX.playbackRate(this.rate)
				uni.showToast({
					title: '当前速度修改为：' + this.rate,
					icon: 'none'
				});
				this.showDrawer = false
			},
			openDrawer(type) {
				this.drawerType = type
				this.showDrawer = true
			},
			fullOrExitScreen() {
				if (this.fullScreenStatus) {
					videoCTX.exitFullScreen()

				} else {
					videoCTX.requestFullScreen()
				}
			},
			showOrHideStatusBar() {
				this.showStatusBarStatus ? this.hideStatusBar() : this.showStatusBar()
			},
			touchStart(e) {
				this.oldTouchs = e.changedTouches[0]
				this.oldValue = {
					currentTime: this.currentTime
				}
			},
			touchEnd(e) {
				if (this.lockSreenStatus) return
				if (this.touchType === 'currentTime') {
					videoCTX.seek(this.currentTime)
					videoCTX.play()
				} else {
					if (this.dbcount === 1 || this.dbcount === 0) {
						this.dbcount++
					}
					if (this.dbcount > 0) {
						setTimeout(() => {
							if (this.dbcount === 1) {
								this.showOrHideStatusBar()
								this.showDrawer = false
							}
							if (this.dbcount === 2) {
								this.playOrPause()
							}
							this.dbcount = 0
						}, 250)
					}

				}
				this.touchType === null
				this.showToastStatus = false

			},
			touchMove(e) {
				if (this.lockSreenStatus) return
				let newTouchs = e.changedTouches[0]
				if (!this.touchType) {
					this.touchType = Math.abs(newTouchs.pageX - this.oldTouchs.pageX) > 20 ? 'currentTime' : null
					if (this.fullScreenStatus && this.platform === 'ios') {
						this.touchType = Math.abs(newTouchs.pageY - this.oldTouchs.pageY) > 20 ? 'currentTime' : null
					}
					if (this.touchType === 'currentTime') {
						videoCTX.pause()
					}
				} else if (this.touchType === 'currentTime') {
					this.showToast({
						type: "progress",
						autoClose: false
					})
					this.showStatusBar()
					let newCurrentTime = (newTouchs.pageX - this.oldTouchs.pageX) / 250 * this.duration * 2 + this.oldValue
						.currentTime * 1
					if (this.fullScreenStatus && this.platform === 'ios') {
						let newCurrentTime = (newTouchs.pageY - this.oldTouchs.pageY) / 250 * this.duration * 2 + this
							.oldValue.currentTime * 1
					}
					newCurrentTime = newCurrentTime > this.duration ? this.duration : newCurrentTime
					newCurrentTime = newCurrentTime < 0 ? 0 : newCurrentTime
					this.currentTime = newCurrentTime
				}
			},
			showStatusBar() {
				this.showStatusBarStatus = true
				timer = timer ? clearTimeout(timer) : null
				timer = setTimeout(() => {
					this.hideStatusBar()
					timer = null
				}, 3000)
			},
			hideStatusBar() {
				this.showStatusBarStatus = false
			},
			showToast(options) {
				this.toast.type = options.type || 'msg'
				this.toast.msg = options.msg || '提示'
				// options.autoClose = true
				this.showToastStatus = true
				// 这段代码看看意思,不用this吗
				if (options.autoClose !== false) {
					if (showToastTimer) {
						clearTimeout(showToastTimer)
					}
					showToastTimer = setTimeout(() => {
						this.showToastStatus = false
						showToastTimer = null
					}, 500)
				}
			},
			sliderUpdate(e) {
				this.showStatusBar()
				videoCTX.pause()
				this.showToastStatus = true
				this.showToast({
					type: "progress",
					autoClose: false
				})
				this.currentTime = e

			},
			sliderChange(e) {
				videoCTX.seek(e)
				this.showToastStatus = false
				videoCTX.play()
				this.isplayer = true
			},
			back() {
				uni.navigateBack({
					delta: 1
				});
			},

			fullscreenchange(e) {
				this.fullScreenStatus = e.detail.fullScreen

			},
			timeupdate(e) {
				if (!this.showToastStatus) {
					this.currentTime = parseInt(e.detail.currentTime)
				}
				this.duration = parseInt(e.detail.duration);
			},
			playOrPause() {
				this.showToast({
					msg: this.isplay ? '暂停' : '播放'
				})
				if (this.isplayer) {
					videoCTX.pause()
					this.isplayer = !this.isplayer
				} else {
					this.showStatusBar()
					videoCTX.play()
					this.isplayer = !this.isplayer
				}

			}
		},
		computed: {
			videoBox() {
				return this.fullScreenStatus ? `width:${this.windowHeight}px;height:${this.windowWidth}px` :
					'width:750rpx;height:225px'
			},
			modelStyle() {
				// let top = this.statusBarHeight + 44
				// return `top:${top}px;bottom:44px;`
			},
			qualityList() {
				return this.videoList[this.videoIndex] ? this.videoList[this.videoIndex].list : []
			}
		},
		mounted() {
			videoCTX = this.$refs.video
			// console.log('视频地址+++++++++++++++++++++++++++++=')
			// console.log(encodeURIComponent(this.video_url))
			// console.log('视频地址+++++++++++++++++++++++++++++=')
		},
		created() {
			let res = uni.getSystemInfoSync()
			this.statusBarHeight = res.statusBarHeight
			this.windowHeight = res.screenHeight
			this.windowWidth = res.screenWidth
			this.platform = res.platform
			this.videoList = demoLst
		},
		components: {
			fIconBtn,
			fSlider
		},
		filters: {
			formatTime(seconds) {
				const hours = Math.floor(seconds / 3600);
				const minutes = Math.floor((seconds % 3600) / 60);
				const secs = Math.floor(seconds % 60);

				if (hours > 0) {
					return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
				} else {
					return `${minutes}:${String(secs).padStart(2, "0")}`;
				}
			},
			formatQuality(val) {
				let arr = {
					SD: "标清",
					HD: "高清",
					FHD: "蓝光"
				}
				return arr[val]
			}
		},
		// 这是什么依赖注入,暂时不会,查查
		provide() {
			return {
				v: this
			}
		},
	}
</script>