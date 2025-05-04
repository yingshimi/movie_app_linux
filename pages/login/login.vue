<template>
	<view class="login-main">
		<view class="back-button" @click="goBack">
			<!-- <text class="iconfont icon-back"></text> -->
			返
		</view>
		<view class="login-wrapper">
			<form class="form-wrapper" @submit.prevent="login">
				<view class="form-header">
					<text class="form-title">登录账号</text>
					<text class="form-subtitle">欢迎回来，精彩影视等着你</text>
				</view>
				<view class="input-container">
	<!-- 				<view class="input-icon">
						<text class="iconfont icon-user"></text>
					</view> -->
					<input placeholder="用户名" class="input-item" v-model="user.username" />
				</view>
				<view class="input-container">
<!-- 					<view class="input-icon">
						<text class="iconfont icon-lock"></text>
					</view> -->
					<input placeholder="密码" class="input-item" type="password" v-model="user.password" />
				</view>
				<button form-type="submit" class="l-btn" :disabled="isLogging">
					<text>{{ isLogging ? '登录中...' : '登录' }}</text>
				</button>
				<view class="form-footer">
					<text class="register-link" @click="goToRegister">没有账号？立即注册</text>
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
				},
				status: "",
				width: 0,
				height: 0,
				isLogging: false
			};
		},
		methods: {
			login() {
				// 验证表单
				if (!this.validateForm()) {
					return;
				}
				
				// 设置登录状态
				this.isLogging = true;
				
				// 登录前先清除可能存在的旧token
				this.$store.commit("removeUser");
				
				userApi.login(this.user).then(res => {
					if (res.data && res.data.access && res.data.refresh && res.data.user) {
						// 使用setUserInfo mutation存储用户信息和令牌
						this.$store.commit("setUserInfo", res.data);
						
						uni.showToast({
							title: '登录成功',
							icon: 'success',
							duration: 2000
						});
						
						uni.switchTab({
							url: '/pages/index/index'
						});
						
						console.log('登录成功', this.$store.state.user);
					} else {
						uni.showToast({
							title: '登录返回数据格式错误',
							icon: 'none',
							duration: 2000
						});
						console.error('登录响应数据格式错误', res.data);
					}
				}).catch(err => {
					console.error('登录失败', err);
					
					// 处理具体的错误信息
					let errorMsg = '登录失败';
					
					if (err.data) {
						// 尝试从错误响应中获取详细信息
						if (err.data.detail) {
							errorMsg = err.data.detail;
						} else if (err.data.non_field_errors) {
							errorMsg = err.data.non_field_errors[0];
						} else if (err.data.username) {
							errorMsg = '用户名错误: ' + err.data.username[0];
						} else if (err.data.password) {
							errorMsg = '密码错误: ' + err.data.password[0];
						}
					}
					
					uni.showToast({
						title: errorMsg,
						icon: 'none',
						duration: 2000
					});
				}).finally(() => {
					// 重置登录状态
					this.isLogging = false;
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
				
				return true;
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			goToRegister() {
				uni.navigateTo({
					url: '/pages/register/register'
				});
			}
		},
		created() {
			let res = uni.getSystemInfoSync()
			this.statusBarHeight = res.statusBarHeight
			this.height = res.windowHeight
			this.width = res.windowWidth
			this.kh = `width:${this.width}px;height:${this.height}px`
			console.log(this.user)
		}
	}
</script>

<style scoped>
	@font-face {
		font-family: 'iconfont';
		src: url('//at.alicdn.com/t/font_2452156_v3gq3p8u3j.woff2') format('woff2');
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 24px;
		font-style: normal;
		color: #666;
	}

	.icon-user:before {
		content: "\e7ae";
	}

	.icon-lock:before {
		content: "\e7c9";
	}

	.icon-back:before {
		content: "\e7ed";
	}

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

	.login-main {
		height: 100vh;
		background-color: #f8f9fc;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		padding: 20px;
	}

	.login-wrapper {
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

	.input-icon {
		position: absolute;
		left: 18px;
		top: 50%;
		transform: translateY(-50%);
		z-index: 1;
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
		/* padding-left: 20px; */
	}

	.l-btn {
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

	.l-btn:active {
		transform: scale(0.98);
		background-color: #444;
	}
	
	.l-btn[disabled] {
		background-color: #999;
		transform: none;
	}

	.form-footer {
		margin-top: 25px;
		text-align: center;
	}

	.register-link {
		color: #666;
		font-size: 15px;
		transition: color 0.3s ease;
	}

	.register-link:active {
		color: #333;
	}
</style>