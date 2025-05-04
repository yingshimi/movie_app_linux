<template>
	<view class="">
		<view style="width: 100%; background-color: #f8f9fc; position: fixed; z-index: 999999;top: 0;"
			:style="{ height: statusBarHeight + 'px' }"></view>
		<view class="profile-container" :style="{ marginTop: statusBarHeight + 'px' }">
			<!-- 顶部用户信息栏 -->
			<view class="user-header">
				<view class="avatar-container" @tap="editAvatar">
					<image class="avatar" :src="userInfo.avatar || '/static/images/avatar.png'" mode="aspectFill"
						@error="handleAvatarError"></image>
				</view>
				<view class="user-info">
					<text class="nickname">{{userInfo.username || 'NULL'}}</text>
					<text class="signature">{{userInfo.bio || '视听爱好者'}}</text>
					<view class="btn-edit-profile" @tap="editProfile">
						<text>编辑资料</text>
					</view>
					<view class="user-stats">
						<view class="stat-item">
							<text class="iconfont icon-fans"></text>
							<text class="stat-num">256</text>
							<text class="stat-label">粉丝</text>
						</view>
						<view class="stat-item">
							<text class="iconfont icon-follow"></text>
							<text class="stat-num">128</text>
							<text class="stat-label">关注</text>
						</view>
						<view class="stat-item">
							<text class="iconfont icon-like"></text>
							<text class="stat-num">512</text>
							<text class="stat-label">获赞</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 内容展示区 -->
			<view class="content-section">
				<view class="tabs-container">
					<scroll-view scroll-x class="tabs-scroll-view" :scroll-left="scrollLeft">
						<view class="tabs-wrapper">
							<view v-for="(tab, index) in tabs" :key="index" class="tab-item"
								:class="{ active: currentTab === index }" @tap="switchTab(index)">
								<text>{{ tab }}</text>
								<view class="tab-line" v-if="currentTab === index"></view>
							</view>
						</view>
					</scroll-view>
				</view>
				<swiper class="content-swiper" :current="currentTab" @change="onSwiperChange">
					<swiper-item v-for="(tab, index) in tabs" :key="index">
						<scroll-view class="scroll-content" scroll-y @scrolltolower="loadMore"
							@refresherrefresh="refresh" refresher-enabled :refresher-triggered="refreshing">
							<view class="grid-content">
								<view class="grid-item" v-for="(item, idx) in contentList[index]" :key="idx"
									@tap="openDetail(item)">
									<image class="item-cover" :src="item.cover" mode="aspectFill"></image>
									<text class="item-title">{{ item.title }}</text>
								</view>
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
			<view class="publish-button" @tap="navigateTo('editor')"><text class="iconfont icon-plus"></text></view>
		</view>
	</view>
</template>

<script>
	import {
		userApi,
		BASE_URL
	} from '@/static/api';

	export default {
		data() {
			return {
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
				tabs: ['我的片单', '关注动态', '收藏'],
				currentTab: 0,
				refreshing: false,
				userInfo: {},
				contentList: [
					[], // 片单列表
					[], // 动态列表
					[] // 收藏列表
				],
				scrollLeft: 0
			}
		},
		onShow() {
			this.loadUserInfo();
			console.log(this.userInfo)
		},
		methods: {
			handleAvatarError() {
				// 当头像加载失败时，设置为默认头像
				this.userInfo.avatar_url = '/static/images/avatar.png';
			},
			async loadUserInfo() {
				try {
					const res = await userApi.getUserInfo();
					this.userInfo = res.data;
					console.log('+++++++++++++++++++++++++++++++++++++++++')
					console.log(res.data)
					// 如果返回的头像URL不完整，添加基础URL
					// if (this.userInfo.avatar_url && !this.userInfo.avatar_url.startsWith('http')) {
					//   this.userInfo.avatar_url = BASE_URL + this.userInfo.avatar_url;
					// }
				} catch (error) {
					console.error('获取用户信息失败', error);
				}
			},
			editAvatar() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						const tempFilePath = res.tempFilePaths[0];

						// 可以先显示选择的图片
						this.userInfo.avatar = tempFilePath;

						// 上传头像
						uni.showLoading({
							title: '上传中...'
						});

						uni.uploadFile({
							url: BASE_URL + '/api/users/upload-avatar/',
							filePath: tempFilePath,
							name: 'avatar',
							header: {
								'Authorization': 'Bearer ' + this.$store.state.token
							},
							success: (uploadRes) => {
								const data = JSON.parse(uploadRes.data);
								console.log('上传头像返回数据:', data);

								if (data && data.avatar_url) {
									// 直接使用返回的完整URL
									this.userInfo.avatar = data.avatar_url;

									// 更新存储在store中的用户信息（如果有存储的话）
									if (this.$store.state.user) {
										const updatedUser = {
											...this.$store.state.user,
											avatar: data.avatar_url
										};
										this.$store.commit('setUser', updatedUser);
									}

									// 刷新用户信息
									this.loadUserInfo();

									uni.showToast({
										title: '头像上传成功',
										icon: 'success'
									});
								} else {
									uni.showToast({
										title: '头像URL获取失败',
										icon: 'none'
									});
								}
							},
							fail: (err) => {
								console.error('头像上传失败', err);
								uni.showToast({
									title: '头像上传失败',
									icon: 'none'
								});
							},
							complete: () => {
								uni.hideLoading();
							}
						});
					}
				});
			},
			navigateTo(page) {
				uni.navigateTo({
					url: `/pages/${page}/${page}`
				})
			},
			editProfile() {
				uni.navigateTo({
					url: '/pages/profile/edit'
				});
			},
			switchTab(index) {
				this.currentTab = index;
				// 计算滚动位置，使选中的tab居中显示
				this.$nextTick(() => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.tab-item').boundingClientRect(data => {
						if (data) {
							const tabWidth = data.width;
							const screenWidth = uni.getSystemInfoSync().windowWidth;
							const scrollPosition = (index * tabWidth) - (screenWidth / 2) + (tabWidth / 2);
							this.scrollLeft = scrollPosition > 0 ? scrollPosition : 0;
						}
					}).exec();
				});
			},
			onSwiperChange(e) {
				this.currentTab = e.detail.current
			},
			async loadMore() {
				// 实现加载更多逻辑
			},
			async refresh() {
				this.refreshing = true
				// 实现刷新逻辑
				await this.loadUserInfo();
				setTimeout(() => {
					this.refreshing = false
				}, 1000)
			},
			openDetail(item) {
				// 实现详情页跳转逻辑
			}
		}
	}
</script>

<style>
	/* 主容器样式 */
	.profile-container {
		min-height: calc(100vh - 50px);
		background-color: #f8f9fc;
		padding: 20px;
	}

	/* 顶部用户信息栏样式 */
	.user-header {
		display: flex;
		padding: 15px;
		background: #fff;
		border-radius: 15px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.avatar-container {
		width: 80px;
		height: 80px;
		position: relative;
		margin-right: 15px;
		cursor: pointer;
	}

	.avatar {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		border: 2px solid #fff;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.user-info {
		flex: 1;
	}

	.btn-edit-profile {
		display: inline-block;
		padding: 5px 12px;
		background-color: #f8f9fc;
		border: 1px solid #eee;
		border-radius: 15px;
		font-size: 12px;
		color: #666;
		margin-bottom: 10px;
	}

	.btn-edit-profile:active {
		background-color: #eee;
	}

	.nickname {
		font-size: 18px;
		font-weight: bold;
		color: #333;
		margin-bottom: 5px;
	}

	.signature {
		font-size: 14px;
		color: #666;
		margin-bottom: 10px;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.user-stats {
		display: flex;
		justify-content: space-between;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stat-num {
		font-size: 16px;
		font-weight: bold;
		color: #333;
	}

	.stat-label {
		font-size: 12px;
		color: #999;
	}

	/* 快捷操作区样式 */
	.quick-actions {
		margin-top: 20px;
	}

	.main-buttons {
		display: flex;
		justify-content: space-between;
		margin-bottom: 15px;
	}

	.capsule-button {
		width: 48%;
		height: 50px;
		border-radius: 25px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		transition: transform 0.2s;
	}

	.capsule-button:active {
		transform: scale(0.98);
	}

	.capsule-button text {
		margin-left: 5px;
	}

	.sub-buttons {
		display: flex;
		justify-content: space-between;
	}

	.circle-button {
		width: 45px;
		height: 45px;
		border-radius: 50%;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		transition: transform 0.2s;
	}

	.circle-button:active {
		transform: scale(0.95);
	}

	/* 内容展示区样式 */
	.content-section {
		margin-top: 20px;
		background: #fff;
		border-radius: 15px;
		overflow: hidden;
	}

	.tabs-container {
		background-color: #fff;
		height: 44px;
		border-bottom: 1px solid #eee;
		position: relative;
	}

	.tabs-scroll-view {
		width: 100%;
		height: 100%;
	}

	.tabs-wrapper {
		display: flex;
		height: 100%;
	}

	.tab-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		height: 100%;
		padding: 0 20px;
		color: #666;
	}

	.tab-item.active {
		color: #333;
		font-weight: bold;
	}

	.tab-line {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 20px;
		height: 2px;
		background: #333;
		border-radius: 1px;
	}

	.content-swiper {
		height: 500px;
	}

	.scroll-content {
		height: 100%;
	}

	.grid-content {
		padding: 10px;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
	}

	.grid-item {
		aspect-ratio: 2/3;
		border-radius: 8px;
		overflow: hidden;
		position: relative;
		transition: transform 0.2s;
	}

	.grid-item:active {
		transform: scale(0.98);
	}

	.item-cover {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.item-title {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 5px;
		font-size: 12px;
		color: #fff;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* iconfont样式 */
	@font-face {
		font-family: 'iconfont';
		src: url('//at.alicdn.com/t/font_3352973_m8o2h4qpg7.woff2') format('woff2');
	}

	.iconfont {
		font-family: "iconfont";
		font-size: 20px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.publish-button {
		position: fixed;
		right: 20px;
		top: 50%;
		transform: translateY(-50%);
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		transition: all 0.3s ease;
		z-index: 100;
	}

	.publish-button:active {
		transform: translateY(-50%) scale(0.95);
		box-shadow: 0 1px 8px rgba(0, 0, 0, 0.2);
	}

	.publish-button .iconfont {
		color: #333;
		font-size: 24px;
	}

	.icon-plus:before {
		content: "+";
	}
</style>