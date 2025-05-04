<template>
	<view class="container">
		<view class="message-form">
			<view class="form-group">
				<!-- <text class="form-label">写下你的留言</text> -->
				<textarea class="form-textarea" v-model="messageContent" placeholder="期待的内容..." maxlength="200" />
			</view>

			<view class="image-preview" v-if="previewImages.length > 0">
				<view class="preview-item" v-for="(image, index) in previewImages" :key="index">
					<image :src="image" mode="aspectFill"></image>
					<view class="preview-remove" @tap="removePreviewImage(index)">
						<text class="iconfont icon-close">×</text>
					</view>
				</view>
			</view>

			<view class="form-actions">
				<view class="upload-btn" @tap="chooseImage">
					添加图片
				</view>
				<view class="submit-btn" @tap="submitMessage">发布留言</view>
			</view>
		</view>

		<view class="message-wall">
			<block v-if="messages.length > 0">
				<view class="message-card" v-for="(message, index) in messages" :key="message.id"
					:style="{ opacity: message.isDeleting ? 0 : 1 }">
					<view class="message-header">
						<view class="user-avatar">
							<image :src="message.avatar" mode="aspectFill"></image>
						</view>
						<view class="user-info">
							<text class="user-name">{{ message.userName }}</text>
							<text class="message-time">{{ message.time }}</text>
						</view>
						<view class="message-actions">
							<view class="action-btn delete-btn" @tap="deleteMessage(index)">
								<text class="iconfont icon-close">×</text>
							</view>
						</view>
					</view>

					<view class="message-content">
						<text>{{ message.content }}</text>
					</view>

					<view class="message-images" v-if="message.images && message.images.length > 0">
						<view class="message-image" v-for="(img, imgIndex) in message.images" :key="imgIndex"
							@tap="previewImage(message.images, imgIndex)">
							<image :src="img" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</block>

			<view class="empty-state" v-if="messages.length === 0">
				<text class="iconfont icon-comment">💬</text>
				<text>还没有留言，来发表第一条吧！</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				messageContent: '',
				previewImages: [],
				messages: [{
						id: 1,
						userName: '李小花',
						avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
						content: '今天天气真好，心情也很愉快！希望大家都有美好的一天~',
						time: '2023-10-15 14:30',
						images: [
							'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
							'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
						],
						isDeleting: false
					},
					{
						id: 2,
						userName: '张大山',
						avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
						content: '刚看完一部很棒的电影，强烈推荐给大家！剧情扣人心弦，演员表演也很到位。',
						time: '2023-10-14 09:15',
						images: [
							'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
						],
						isDeleting: false
					},
					{
						id: 3,
						userName: '王小美',
						avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
						content: '分享一下我的旅行照片，这次去了云南，风景真的太美了！下次有机会一定要再去一次。',
						time: '2023-10-13 18:45',
						images: [
							'https://images.unsplash.com/photo-1505993597083-3bd19fb75e57?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
							'https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
							'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
						],
						isDeleting: false
					}
				]
			}
		},
		methods: {
			formatDate(date) {
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				const hours = date.getHours().toString().padStart(2, '0');
				const minutes = date.getMinutes().toString().padStart(2, '0');

				return `${year}-${month}-${day} ${hours}:${minutes}`;
			},

			chooseImage() {
				uni.chooseImage({
					count: 9 - this.previewImages.length,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						// 将选择的图片添加到预览数组
						this.previewImages = [...this.previewImages, ...res.tempFilePaths];
					}
				});
			},

			removePreviewImage(index) {
				this.previewImages.splice(index, 1);
			},

			submitMessage() {
				if (!this.messageContent.trim() && this.previewImages.length === 0) {
					uni.showToast({
						title: '请输入留言内容或添加图片',
						icon: 'none'
					});
					return;
				}

				// 获取当前用户信息（实际应用中应从用户系统获取）
				const userInfo = {
					userName: '我',
					avatar: 'https://randomuser.me/api/portraits/men/85.jpg'
				};

				// 创建新留言
				const newMessage = {
					id: Date.now(),
					userName: userInfo.userName,
					avatar: userInfo.avatar,
					content: this.messageContent.trim(),
					time: this.formatDate(new Date()),
					images: [...this.previewImages],
					isDeleting: false
				};

				// 添加到留言列表的开头
				this.messages.unshift(newMessage);

				// 清空输入和预览
				this.messageContent = '';
				this.previewImages = [];

				uni.showToast({
					title: '发布成功',
					icon: 'success'
				});
			},

			deleteMessage(index) {
				uni.showModal({
					title: '提示',
					content: '确定要删除这条留言吗？',
					success: (res) => {
						if (res.confirm) {
							this.messages[index].isDeleting = true;

							setTimeout(() => {
								this.messages.splice(index, 1);
							}, 300);
						}
					}
				});
			},

			previewImage(images, current) {
				uni.previewImage({
					urls: images,
					current: images[current]
				});
			}
		}
	}
</script>

<style>
	page {
		background-color: #f5f5f5;
	}

	.container {
		padding: 20rpx;
		max-width: 800rpx;
		margin: 0 auto;
	}

	.header {
		text-align: center;
		margin-bottom: 30rpx;
	}

	.header-title {
		font-size: 36rpx;
		color: #333;
		margin-bottom: 10rpx;
		display: block;
		font-weight: bold;
	}

	.header-subtitle {
		color: #666;
		font-size: 28rpx;
		display: block;
	}

	.message-form {
		background: #fff;
		border-radius: 24rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.05);
	}

	.form-group {
		margin-bottom: 20rpx;
	}

	.form-label {
		display: block;
		margin-bottom: 16rpx;
		font-weight: 500;
		color: #333;
		font-size: 28rpx;
	}

	.form-textarea {
		width: 100%;
		padding: 20rpx;
		border: 1px solid #e0e0e0;
		border-radius: 16rpx;
		height: 200rpx;
		font-size: 28rpx;
		background-color: #f9f9f9;
	}

	.image-preview {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
	}

	.preview-item {
		position: relative;
		width: 160rpx;
		height: 160rpx;
		border-radius: 16rpx;
		overflow: hidden;
	}

	.preview-item image {
		width: 100%;
		height: 100%;
	}

	.preview-remove {
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		width: 40rpx;
		height: 40rpx;
		background: rgba(0, 0, 0, 0.5);
		color: #fff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
	}

	.form-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20rpx;
	}

	.upload-btn {

		display: flex;
		align-items: center;
		justify-content: center;
		background: #f5f5f5;
		color: #666;
		font-size: 26rpx;
		border-radius: 30rpx;
		padding: 20rpx 30rpx;
		box-shadow: none;
		flex: 1;
		transition: all 0.3s ease;
		width: 160px;
		height: 40px;
	}

	.upload-btn:active {
		background: #ebebeb;
	}

	.submit-btn {
		display: flex;
		/* 启用Flexbox布局 */
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
		width: 160px;
		height: 40px;
		background: #f5f5f5;
		color: #666;
		border-style: none;
		font-size: 26rpx;
		border-radius: 30rpx;
		padding: 20rpx 30rpx;
		box-shadow: none;
		flex: 1;
		transition: all 0.3s ease;
		border: n;
	}

	.submit-btn:active {
		background: #357abd;
	}

	.message-wall {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.message-card {
		background: #fff;
		border-radius: 24rpx;
		overflow: hidden;
		box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.05);
		transition: opacity 0.3s, transform 0.3s;
	}

	.message-header {
		display: flex;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1px solid #f0f0f0;
	}

	.user-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 20rpx;
	}

	.user-avatar image {
		width: 100%;
		height: 100%;
	}

	.user-info {
		flex: 1;
	}

	.user-name {
		font-weight: 500;
		color: #333;
		font-size: 28rpx;
		margin-bottom: 6rpx;
	}

	.message-time {
		color: #999;
		font-size: 24rpx;
	}

	.message-actions {
		display: flex;
		gap: 20rpx;
	}

	.action-btn {
		color: #999;
		font-size: 32rpx;
	}

	.message-content {
		padding: 20rpx;
		color: #333;
		font-size: 28rpx;
		line-height: 1.5;
	}

	.message-images {
		display: flex;
		flex-wrap: wrap;
		gap: 10rpx;
		padding: 0 20rpx 20rpx;
	}

	.message-image {
		width: calc(33.333% - 7rpx);
		height: 200rpx;
		border-radius: 16rpx;
		overflow: hidden;
	}

	.message-image image {
		width: 100%;
		height: 100%;
	}

	.empty-state {
		text-align: center;
		padding: 80rpx 0;
		color: #999;
	}

	.empty-state .iconfont {
		font-size: 96rpx;
		margin-bottom: 30rpx;
		color: #ddd;
		display: block;
	}

	.empty-state text {
		font-size: 32rpx;
	}

	/* 由于uni-app中使用自定义字体图标可能需要额外配置，这里使用简单的emoji替代 */
	.iconfont.icon-close {
		font-size: 24rpx;
	}

	.iconfont.icon-image {
		font-size: 32rpx;
	}

	.iconfont.icon-comment {
		font-size: 96rpx;
	}

	@media screen and (min-width: 768rpx) {
		.message-wall {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(300rpx, 1fr));
			gap: 20rpx;
		}
	}
</style>