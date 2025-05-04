<template>
	<view class="register-main">
		<view class="back-button" @click="goBack">
			返
		</view>
		<view class="register-wrapper">
			<form class="form-wrapper" @submit.prevent="register">
				<view class="form-header">
					<text class="form-title">注册账号</text>
					<text class="form-subtitle">创建账号，畅享更多精彩</text>
				</view>
				<view class="input-container">
					<input placeholder="用户名" class="input-item" v-model="user.username" />
				</view>
				<view class="input-container">
					<input placeholder="邮箱" class="input-item" v-model="user.email" />
				</view>
				<view class="input-container">
					<input placeholder="密码" class="input-item" type="password" v-model="user.password" />
				</view>
				<view class="input-container">
					<input placeholder="确认密码" class="input-item" type="password" v-model="confirmPassword" />
				</view>
				<button form-type="submit" class="r-btn" :disabled="isRegistering">
					<text>{{ isRegistering ? '注册中...' : '注册' }}</text>
				</button>
				<view class="form-footer">
					<text class="login-link" @click="goToLogin">已有账号？立即登录</text>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	import { userApi } from '@/static/api';
	export default {
		data() {
			return {
				user: {
					username: "",
					password: "",
					email: ""
				},
				confirmPassword: "",
				width: 0,
				height: 0,
				isRegistering: false
			};
		},
		methods: {
			register() {
				// 先进行基本验证
				if (!this.validateForm()) {
					return;
				}
				
				// 设置注册状态
				this.isRegistering = true;
				
				// 调用注册API
				userApi.register(this.user).then(res => {
					uni.showToast({
						title: '注册成功',
						icon: 'success',
						duration: 2000
					});
					
					// 清空表单数据
					this.resetForm();
					
					// 注册成功后跳转到登录页面
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login'
						});
					}, 2000);
					
					console.log('注册成功', res.data);
				}).catch(err => {
					// 处理具体的错误信息
					let errorMsg = '注册失败';
					
					if (err.data) {
						// 尝试从错误响应中获取详细信息
						if (err.data.username) {
							errorMsg = '用户名错误: ' + err.data.username[0];
						} else if (err.data.email) {
							errorMsg = '邮箱错误: ' + err.data.email[0];
						} else if (err.data.password) {
							errorMsg = '密码错误: ' + err.data.password[0];
						} else if (err.data.detail) {
							errorMsg = err.data.detail;
						} else if (err.data.non_field_errors) {
							errorMsg = err.data.non_field_errors[0];
						}
					}
					
					uni.showToast({
						title: errorMsg,
						icon: 'none',
						duration: 2000
					});
					console.error('注册失败', err);
				}).finally(() => {
					// 不管成功还是失败，都重置注册状态
					this.isRegistering = false;
				});
			},
			validateForm() {
				// 验证用户名
				if (!this.user.username.trim()) {
					uni.showToast({
						title: '请输入用户名',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				
				// 验证密码
				if (!this.user.password) {
					uni.showToast({
						title: '请输入密码',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				
				// 验证密码长度
				if (this.user.password.length < 6) {
					uni.showToast({
						title: '密码长度至少为6位',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				
				// 验证密码确认
				if (this.user.password !== this.confirmPassword) {
					uni.showToast({
						title: '两次密码不一致',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				
				// 验证邮箱格式
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(this.user.email)) {
					uni.showToast({
						title: '邮箱格式不正确',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				
				return true;
			},
			resetForm() {
				// 重置表单数据
				this.user = {
					username: "",
					password: "",
					email: ""
				};
				this.confirmPassword = "";
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			goToLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				});
			}
		},
		created() {
			let res = uni.getSystemInfoSync();
			this.height = res.windowHeight;
			this.width = res.windowWidth;
		}
	}
</script>

<style scoped>
	.back-button {
		position: absolute;
		top: 40px;
		left: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #fff;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		z-index: 10;
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(0,0,0,0.05);
	}

	.register-main {
		height: 100vh;
		background-color: #f8f9fc;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		padding: 20px;
	}

	.register-wrapper {
		position: relative;
		background-color: #fff;
		width: 320px;
		border-radius: 20px;
		box-shadow: 0 4px 16px rgba(0,0,0,0.08);
		padding: 35px;
	}

	.form-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}

	.form-header {
		text-align: center;
		margin-bottom: 30px;
	}

	.form-title {
		font-size: 24px;
		font-weight: bold;
		color: #333;
		margin-bottom: 12px;
		display: block;
	}

	.form-subtitle {
		font-size: 15px;
		color: #666;
		display: block;
	}

	.input-container {
		position: relative;
		width: 100%;
		margin-bottom: 22px;
		display: flex;
		align-items: center;
	}

	.input-item {
		width: 100%;
		height: 50px;
		background-color: #f8f9fc;
		color: #333;
		border-radius: 15px;
		padding: 12px 18px 12px 20px;
		font-size: 15px;
		border: 1px solid #eee;
		transition: all 0.3s ease;
	}

	.input-item:focus {
		border-color: #333;
		box-shadow: 0 2px 8px rgba(0,0,0,0.05);
	}

	.input-item::placeholder {
		color: #999;
		font-size: 15px;
	}

	.r-btn {
		width: 100%;
		height: 50px;
		border-radius: 15px;
		background-color: #333;
		color: white;
		font-size: 16px;
		font-weight: bold;
		border: none;
		margin-top: 20px;
		transition: all 0.3s ease;
	}

	.r-btn:active {
		transform: scale(0.98);
		background-color: #444;
	}
	
	.r-btn[disabled] {
		background-color: #999;
		transform: none;
	}

	.form-footer {
		margin-top: 25px;
		text-align: center;
	}

	.login-link {
		color: #666;
		font-size: 15px;
		transition: color 0.3s ease;
	}

	.login-link:active {
		color: #333;
	}
</style> 