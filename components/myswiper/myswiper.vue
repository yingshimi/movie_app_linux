<template>
	<view>
		<view class="uni-margin-wrap">
			<swiper class="swiper no-scrollbar" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				:duration="duration" :previous-margin="previousMargin" :next-margin="nextMargin"
				:acceleration="true" @change="swiperChange" @animationfinish="animationFinish">
				<swiper-item v-for="item in films" :key="item.id">
					<view class="swiper-item">
						<image :src="item.url" mode="aspectFill" :key="item.id" :lazy-load="true" />
						<view class="text-malfunction" :data-word="item.title">
							{{ item.title }}
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import {
		getPoster
	} from '@/static/api/uploadApi.js';
	export default {
		name: "myswiper",
		data() {
			return {
				background: ['color1', 'color2', 'color3'],
				indicatorDots: true,
				autoplay: true,
				interval: 3000,
				duration: 300,
				previousMargin: '0px',
				nextMargin: '0px',
				films: [],
				swiperCurrent: 0,
				isAnimating: false
			};
		},
		methods: {
			getPoster() {
				getPoster('首页海报').then(res => {
					console.log('获取轮播图数据:', res.data.data)
					if (res.data && Array.isArray(res.data.data)) {
						this.films = res.data.data.map(item => ({
							id: item.id,
							title: item.title,
							url: item.poster_url
						}));
					}
					console.log('+++++++++++++++++++++++++++++++++++++++++')
					console.log(this.films)
				}).catch(err => {
					console.error('获取轮播图数据失败:', err)
				})
			},
			swiperChange(e) {
				this.swiperCurrent = e.detail.current;
				this.isAnimating = true;
			},
			animationFinish() {
				this.isAnimating = false;
			}
		},
		mounted() {
			this.getPoster();
			// 预缓存下一张图片
			uni.onMemoryWarning(() => {
				console.log('内存不足警告');
				// 可以在这里做一些内存释放工作
			});
		}
	}
</script>

<style>
	.swiper {
		height: 220px;
		padding: 10px;
		border-radius: 4px;
		will-change: transform;
	}

	.swiper-item {
		width: 100%;
		height: 100%;
		position: relative;
		transform: translateZ(0);
	}

	image {
		width: 100%;
		height: 200px;
		border-radius: 4px;
		will-change: transform;
		backface-visibility: hidden;
		transform: translateZ(0);
	}

	.swiper-slide {
		position: relative;
	}

	.swiper-wrapper {
		position: relative;
	}

	.text-malfunction {
		white-space: nowrap;
		letter-spacing: 15px;
		position: absolute;
		bottom: 50%;
		left: 55.5%;
		transform: translate(-50%, -50%) scale(2);
		font-size: 15px;
		font-family: sans-serif;
		color: transparent;
		will-change: transform;
		transform: translate3d(-50%, -50%, 0) scale(2);
	}

	.line {
		position: absolute;
		width: calc(100% - 8px);
		left: -0.5px;
		height: 1px;
		background: black;
		z-index: 50;
		animation: lineMove 5s ease-out infinite;
	}

	.text-malfunction:before,
	.text-malfunction:after {
		content: attr(data-word);
		position: absolute;
		top: 0;
		line-height: 50px;
		overflow: hidden;
		filter: contrast(200%);
	}

	.text-malfunction:before {
		left: 0;
		color: red;
		text-shadow: 1px 0 0 red;
		z-index: 30;
		animation: malfunctionAni 0.95s infinite;
	}

	.text-malfunction:after {
		left: -1px;
		color: cyan;
		text-shadow: -1px 0 0 cyan;
		z-index: 40;
		mix-blend-mode: lighten;
		animation: malfunctionAni 1.1s infinite 0.2s;
	}

	@keyframes lineMove {
		9% {
			top: 38px;
		}

		14% {
			top: 8px;
		}

		18% {
			top: 42px;
		}

		22% {
			top: 1px;
		}

		32% {
			top: 32px;
		}

		34% {
			top: 12px;
		}

		40% {
			top: 26px;
		}

		43% {
			top: 7px;
		}

		99% {
			top: 30px;
		}
	}

	@keyframes malfunctionAni {
		10% {
			top: -0.4px;
			left: -1.1px;
		}

		20% {
			top: 0.4px;
			left: -0.2px;
		}

		30% {
			left: .5px;
		}

		40% {
			top: -0.3px;
			left: -0.7px;
		}

		50% {
			left: 0.2px;
		}

		60% {
			top: 1.8px;
			left: -1.2px;
		}

		70% {
			top: -1px;
			left: 0.1px;
		}

		80% {
			top: -0.4px;
			left: -0.9px;
		}

		90% {
			left: 1.2px;
		}

		100% {
			left: -1.2px;
		}
	}

	/* 确保轮播图组件不显示滚动条 */
	.no-scrollbar::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
	}
</style>
