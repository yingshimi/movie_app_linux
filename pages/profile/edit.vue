<template>
	<view class="edit-profile">
		<view class="form-container">
			<view class="form-header">
				<text class="form-title">编辑个人资料</text>
			</view>
			
			<view class="input-container">
				<text class="input-label">用户名</text>
				<input class="input-field" v-model="userInfo.username" placeholder="请输入用户名" />
			</view>
			
			<view class="input-container">
				<text class="input-label">邮箱</text>
				<input class="input-field" v-model="userInfo.email" placeholder="请输入邮箱" type="email" />
			</view>
			
			<view class="input-container">
				<text class="input-label">个人简介</text>
				<textarea class="input-field textarea" v-model="userInfo.bio" placeholder="介绍一下自己吧" />
			</view>
			
			<button class="save-button" @tap="saveProfile">保存修改</button>
		</view>
	</view>
</template>

<script>
	import { getUserInfo, updateUserInfo } from '@/static/api/userApi';
	
	export default {
		data() {
			return {
				userInfo: {
					username: '',
					email: '',
					bio: ''
				}
			}
		},
		onLoad() {
			this.loadUserInfo();
		},
		methods: {
			async loadUserInfo() {
				try {
					uni.showLoading({
						title: '加载中...'
					});
					
					const res = await getUserInfo();
					this.userInfo = res.data;
					
					// 如果后端没有返回bio字段，初始化为空字符串
					if (!this.userInfo.bio) {
						this.userInfo.bio = '';
					}
				} catch (error) {
					console.error('获取用户信息失败', error);
					uni.showToast({
						title: '获取信息失败',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
				}
			},
			async saveProfile() {
				try {
					// 表单验证
					if (!this.userInfo.username.trim()) {
						uni.showToast({
							title: '用户名不能为空',
							icon: 'none'
						});
						return;
					}
					
					// 验证邮箱格式
					const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
					if (!emailRegex.test(this.userInfo.email)) {
						uni.showToast({
							title: '邮箱格式不正确',
							icon: 'none'
						});
						return;
					}
					
					uni.showLoading({
						title: '保存中...'
					});
					
					// 调用更新接口
					await updateUserInfo({
						username: this.userInfo.username,
						email: this.userInfo.email,
						bio: this.userInfo.bio
					});
					
					uni.showToast({
						title: '保存成功',
						icon: 'success'
					});
					
					// 返回个人页面
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
					
				} catch (error) {
					console.error('更新用户信息失败', error);
					uni.showToast({
						title: '保存失败',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
				}
			}
		}
	}
</script>

<style>
	.edit-profile {
		min-height: 100vh;
		background-color: #f8f9fc;
		padding: 20px;
	}
	
	.form-container {
		background-color: #fff;
		border-radius: 15px;
		padding: 25px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.05);
	}
	
	.form-header {
		margin-bottom: 30px;
		text-align: center;
	}
	
	.form-title {
		font-size: 22px;
		font-weight: bold;
		color: #333;
	}
	
	.input-container {
		margin-bottom: 20px;
	}
	
	.input-label {
		display: block;
		font-size: 16px;
		color: #333;
		margin-bottom: 8px;
	}
	
	.input-field {
		width: 100%;
		height: 50px;
		background-color: #f8f9fc;
		border-radius: 10px;
		padding: 12px 15px;
		font-size: 16px;
		border: 1px solid #eee;
	}
	
	.textarea {
		height: 120px;
	}
	
	.save-button {
		width: 100%;
		height: 50px;
		background-color: #333;
		color: white;
		border-radius: 10px;
		font-size: 16px;
		font-weight: bold;
		margin-top: 20px;
	}
	
	.save-button:active {
		background-color: #444;
	}
</style> 