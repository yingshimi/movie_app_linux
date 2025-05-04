<template>
	<view class="content">
		<view class="form-group">
			<input type="text" v-model="articleTitle" class="title-input" placeholder="请输入文章标题..." />
			<view class="category-selector">
				<text class="category-label">文章分类</text>
				<picker mode="selector" :range="categories" :value="currentCategoryIndex" @change="onCategoryChange"
					class="category-picker">
					<view class="picker-content">
						<text class="selected-category">{{ categories[currentCategoryIndex] || '请选择分类' }}</text>
						<text class="picker-arrow">▼</text>
					</view>
				</picker>
			</view>
			<view class="cover-upload" @click="chooseCoverImage" v-if="!coverImage">
				<text class="upload-text">点击上传封面图片</text>
			</view>
			<view class="cover-preview" v-else>
				<image :src="coverImage" mode="aspectFill" class="cover-img" />
				<view class="cover-actions">
					<text class="remove-cover" @click.stop="removeCoverImage">移除</text>
				</view>
			</view>
		</view>
		<editor :show-img-resize="true" :show-img-toolbar="true" :show-img-size="true" id="editor" class="editor" placeholder="开始书写魔法故事吧..." @ready="onEditorReady" @input="onEditorInput">
		</editor>

		<view class="toolbar">
			<view class="toolbar-group">
				<view class="font-size-selector">
					<text class="label">字体大小</text>
					<view class="size-controls">
						<text class="size-btn" @click="decreaseFontSize">A⁻</text>
						<picker mode="selector" :range="fontSizes" :value="currentFontSizeIndex"
							@change="onFontSizeChange">
							<view class="picker-text">{{ fontSizes[currentFontSizeIndex] }}</view>
						</picker>
						<text class="size-btn" @click="increaseFontSize">A⁺</text>
					</view>
				</view>
			</view>
			<view class="toolbar-group">
			</view>
			<view class="toolbar-group">
				<button type="primary" class="action-btn code-btn" @click="insertCode">插入代码</button>
				<button type="primary" class="action-btn code-btn" @click="inputDone">完成</button>
				<button type="primary" class="action-btn insert-btn" @click="insertImage">添加图片</button>
			</view>
			<view class="toolbar-group">
				<view class="font-weight-selector">
					<text class="label">字体粗细</text>
					<view class="size-controls">
						<text class="size-btn" @click="decreaseFontWeight">细</text>
						<picker mode="selector" :range="fontWeights" :value="currentFontWeightIndex"
							@change="onFontWeightChange">
							<view class="picker-text">{{ fontWeights[currentFontWeightIndex] }}</view>
						</picker>
						<text class="size-btn" @click="increaseFontWeight">粗</text>
					</view>
				</view>

				<button type="primary" class="action-btn clear-btn" @click="clear">清空魔法</button>
			</view>
			<view class="toolbar-group">
				<button type="primary" class="action-btn submit-btn" @click="submitArticle">发布文章</button>
			</view>
		</view>
		<view v-if="insertCodeFrame" class="code-frame-overlay">
			<view class="code-frame-container">
				<textarea class="code-input" :maxlength='-1' @input="onInput" placeholder="在这里输入你的魔法代码..."></textarea>
				<view class="code-frame-actions">
					<button class="action-btn code-frame-btn" @click="closeInsertCodeFrame">关闭</button>
					<button class="action-btn code-frame-btn confirm" @click="InsertCodeDone">完成</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		createArticle
	} from '@/static/api/articles.js'
	import { uploadContentImage, uploadCoverImage } from '@/static/api/articleUpload.js'
	import store from '@/store';
	const base_url = 'http://192.168.88.200:9000/';

	export default {
		data() {
			return {
				codeHtml: '',
				insertCodeFrame: false,
				html: '',
				editorCtx: null,
				articleTitle: '',
				coverImage: null,
				content: '',
				fontSizes: ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'],
				currentFontSizeIndex: 2,
				fontWeights: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
				currentFontWeightIndex: 0,
				imageSizes: ['小图', '中图', '大图'],
				currentImageSizeIndex: 1,
				programmingLanguages: ['JavaScript', 'Python', 'Java', 'HTML', 'CSS', 'C++', 'Ruby', 'PHP'],
				currentLanguageIndex: 0,
				imageSizeMap: {
					'小图': {
						width: '150px',
						height: 'auto'
					},
					'中图': {
						width: '300px',
						height: 'auto'
					},
					'大图': {
						width: '600px',
						height: 'auto'
					}
				},
				categories: ['1', '影评', '演员访谈', '幕后故事', '电影技术', '电影历史', '电影节'],
				currentCategoryIndex: 0,
				selectedCategory: ''
			}
		},
		methods: {
			inputDone() {
				if (this.html && this.html != this.content) {
					this.html = this.html + this.content
				} else {
					this.html = this.content
				}
				console.log('============================这是codehtml============================')
				console.log(this.html)

			},
			InsertCodeDone() {
				if (this.html && this.html != this.codeHtml) {
					this.html = this.html + this.codeHtml
				} else {
					this.html = this.codeHtml
				}
				console.log('============================这是codehtml============================')
				console.log(this.html)
				this.closeInsertCodeFrame()
			},
			onInput(e) {
				let code = '';
				code = e.detail.value
				let codeHtml =
					`<pre style="
    width: 100%;
	height: 200px;
    overflow-x: auto;
    white-space: pre;
    background-color: #f8f9fc;
    border: 2px solid #e4e8f5;
    border-radius: 12px;
    padding: 20px;
    font-family: 'Monaco', 'Consolas', monospace;
    box-shadow: 0 4px 12px rgba(157, 178, 255, 0.15);
    color: #4a4f6a;
    font-size: 14px;
    line-height: 1.6;
    margin: 16px 0;
    transition: all 0.3s ease;
"><code>${code}</code></pre>`;
				this.codeHtml = codeHtml
			},
			closeInsertCodeFrame() {
				this.insertCodeFrame = false
			},

			increaseFontSize() {
				if (this.currentFontSizeIndex < this.fontSizes.length - 1) {
					this.currentFontSizeIndex++;
					this.setFontSize(this.fontSizes[this.currentFontSizeIndex]);
				}
			},
			decreaseFontSize() {
				if (this.currentFontSizeIndex > 0) {
					this.currentFontSizeIndex--;
					this.setFontSize(this.fontSizes[this.currentFontSizeIndex]);
				}
			},
			increaseImageSize() {
				if (this.currentImageSizeIndex < this.imageSizes.length - 1) {
					this.currentImageSizeIndex++;
				}
			},
			decreaseImageSize() {
				if (this.currentImageSizeIndex > 0) {
					this.currentImageSizeIndex--;
				}
			},
			onEditorReady() {
				// 编辑器初始化完成时，获取组件实例
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
					// 设置默认字体大小
					// this.setFontSize(this.fontSizes[this.currentFontSizeIndex])
				}).exec()
			},
			onFontSizeChange(e) {
				this.currentFontSizeIndex = e.detail.value
				this.setFontSize(this.fontSizes[this.currentFontSizeIndex])
			},
			setFontSize(fontSize) {
				if (this.editorCtx) {
					this.editorCtx.format('fontSize', fontSize)
				} else {
					console.warn('编辑器实例尚未初始化')
				}
			},
			onEditorInput(e) {
				this.content = e.detail.html
			},
			decreaseFontWeight() {
				if (this.currentFontWeightIndex > 0) {
					this.currentFontWeightIndex--;
					this.setFontWeight(this.fontWeights[this.currentFontWeightIndex]);
				}
			},
			increaseFontWeight() {
				if (this.currentFontWeightIndex < this.fontWeights.length - 1) {
					this.currentFontWeightIndex++;
					this.setFontWeight(this.fontWeights[this.currentFontWeightIndex]);
				}
			},
			onFontWeightChange(e) {
				this.currentFontWeightIndex = e.detail.value;
				this.setFontWeight(this.fontWeights[this.currentFontWeightIndex]);
			},
			setFontWeight(fontWeight) {
				if (this.editorCtx) {
					this.editorCtx.format('fontWeight', fontWeight);
				} else {
					console.warn('编辑器实例尚未初始化');
				}
			},
			insertImage() {
				// 插入图片
				uni.chooseImage({
					count: 1,
					success: (res) => {
						const size = this.imageSizeMap[this.imageSizes[this.currentImageSizeIndex]]
						// 先上传图片到服务器
						uni.uploadFile({
							url: base_url + 'api/upload/',
							filePath: res.tempFilePaths[0],
							name: 'image',
							header: {
								'Authorization': 'Bearer ' + store.state.token
							},
							success: (uploadRes) => {
								const response = JSON.parse(uploadRes.data);
								console.log('上传图片返回数据:', response.data);
								// 获取到服务器返回的图片URL后再插入到编辑器
								this.editorCtx.insertImage({
									src: response.data.image_url,
									alt: '图片',
									width: size.width,
									height: size.height
								})
							},
							fail: (error) => {
								uni.showToast({
									title: '图片上传失败',
									icon: 'none'
								})
							}
						})
					}
				})
			},
			// insertImage() {
			// 	// 插入图片
			// 	uni.chooseImage({
			// 		count: 1,
			// 		success: async (res) => {
			// 			const size = this.imageSizeMap[this.imageSizes[this.currentImageSizeIndex]]
			// 			try {
			// 				// 使用封装的上传接口
			// 				const response = await uploadContentImage(res.tempFilePaths[0]);
			// 				// 获取到服务器返回的图片URL后再插入到编辑器
			// 				this.editorCtx.insertImage({
			// 					src: response.image_url,
			// 					alt: '图片',
			// 					width: size.width,
			// 					height: size.height
			// 				})
			// 			} catch (error) {
			// 				uni.showToast({
			// 					title: '图片上传失败',
			// 					icon: 'none'
			// 				})
			// 			}
			// 		}
			// 	})
			// },
			onImageSizeChange(e) {
				this.currentImageSizeIndex = e.detail.value
			},
			clear() {
				// 清空编辑器内容
				this.editorCtx.clear()
			},
			onLanguageChange(e) {
				this.currentLanguageIndex = e.detail.value
			},
			insertCode() {
				console.log('==========================插入代码块=============================')
				this.insertCodeFrame = true
			},

			chooseCoverImage() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.coverImage = res.tempFilePaths[0]
					}
				})
			},
			removeCoverImage() {
				this.coverImage = null
			},
			submitArticle() {
				// 表单验证
				if (!this.articleTitle.trim()) {
					uni.showToast({
						title: '请输入文章标题',
						icon: 'none'
					})
					return
				}
				if (!this.selectedCategory) {
					uni.showToast({
						title: '请选择文章分类',
						icon: 'none'
					})
					return
				}
				if (!this.coverImage) {
					uni.showToast({
						title: '请上传封面图片',
						icon: 'none'
					})
					return
				}

				// 显示加载状态
				uni.showLoading({
					title: '正在发布...'
				})

				try {
					uni.uploadFile({
						url: base_url + 'api/articles/', 
						filePath: this.coverImage,
						name: 'cover_img',
						formData: {
							title: this.articleTitle,
							content: this.html,
							category: this.selectedCategory
						},
						header: {
							'Authorization': 'Bearer ' + store.state.token
						},
						success: (uploadFileRes) => {
							console.log('上传响应:', uploadFileRes.data);  // 添加日志
							const response = JSON.parse(uploadFileRes.data);
							
							// 移除状态检查，直接处理响应
							uni.hideLoading();
							
							if (response.id) {  // 如果返回了文章ID，说明创建成功
								uni.showToast({
									title: '文章发布成功',
									icon: 'success',
									duration: 2000
								});
								
								setTimeout(() => {
									uni.navigateTo({
										url: `/pages/article/detail?id=${response.id}`
									});
								}, 1500);
							} else {
								// 如果有错误信息，显示具体的错误
								const errorMsg = response.message || 
									(response.category ? `分类错误: ${response.category}` : '发布失败');
								uni.showToast({
									title: errorMsg,
									icon: 'none',
									duration: 3000
								});
							}
						},
						fail: (error) => {
							console.error('上传失败:', error);  // 添加错误日志
							uni.hideLoading();
							uni.showToast({
								title: '发布失败，请重试',
								icon: 'none',
								duration: 3000
							});
						}
					});
				} catch (error) {
					// 错误处理
					uni.hideLoading();
					uni.showToast({
						title: error.message || '发布失败，请重试',
						icon: 'none',
						duration: 3000
					});
				}
			},
			getFileFromPath(path) {
				return new Promise((resolve, reject) => {
					uni.getFileInfo({
						filePath: path,
						success: (res) => {
							resolve({
								uri: path,
								type: 'image/jpeg',
								name: 'cover.jpg',
								size: res.size
							})
						},
						fail: reject
					})
				})
			},
			onCategoryChange(e) {
				this.currentCategoryIndex = e.detail.value;
				this.selectedCategory = this.categories[this.currentCategoryIndex];
			},
		}
	}
</script>

<style>
	@font-face {
		font-family: 'DisneyFont';
		src: url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&display=swap');
	}

	.content {
		padding: 0 20px 20px 20px;
		/* background: linear-gradient(135deg, #E0F7FF 0%, #FDD5E5 100%); */
		min-height: calc(100vh - 50px);
		position: relative;
	}

	.title {
		font-family: 'DisneyFont', sans-serif;
		font-size: 32px;
		color: #0072CE;
		text-align: center;
		margin-bottom: 20px;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
	}

	.editor {
		border: 2px solid #AED8F5;
		border-radius: 15px;
		min-height: 250px;
		width: 100%;
		margin-bottom: 25px;
		background-color: rgba(255, 255, 255, 0.95);
		box-shadow: 0 6px 16px rgba(174, 216, 245, 0.15);
		padding: 20px;
		font-family: 'DisneyFont', sans-serif;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.editor:focus-within {
		border-color: #1E90FF;
		box-shadow: 0 8px 24px rgba(30, 144, 255, 0.2);
		transform: translateY(-2px);
	}

	.editor::placeholder {
		color: #AED8F5;
		font-size: 16px;
	}

	.toolbar {
		background-color: rgba(255, 255, 255, 0.95);
		border-radius: 15px;
		padding: 20px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		
	}

	.toolbar-group {
		display: flex;
		gap: 15px;
		margin-bottom: 15px;
		align-items: center;
	}

	.toolbar-group:last-child {
		margin-bottom: 0;
	}

	.font-size-selector,
	.image-size-selector {
		display: flex;
		align-items: center;
		background-color: #7B3F00;
		padding: 10px 15px;
		border-radius: 12px;
		box-shadow: 0 2px 6px rgba(123, 63, 0, 0.2);
	}

	.label {
		font-family: 'DisneyFont', sans-serif;
		font-size: 14px;
		color: #FDFD96;
		margin-right: 10px;
	}

	.picker-text {
		font-family: 'DisneyFont', sans-serif;
		font-size: 14px;
		color: #FFFFFF;
	}

	.size-controls {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.size-btn {
		font-family: 'DisneyFont', sans-serif;
		font-size: 18px;
		color: #FDFD96;
		cursor: pointer;
		padding: 0 5px;
	}

	.action-btn {
		flex: 1;
		margin: 0;
		height: 44px;
		line-height: 44px;
		font-size: 16px;
		font-family: 'DisneyFont', sans-serif;
		border-radius: 12px;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		position: relative;
		overflow: hidden;
		border: none;
		transform-origin: center;
	}

	.action-btn:hover {
		transform: translateY(-2px) scale(1.02);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
	}

	.font-weight-selector {
		display: flex;
		align-items: center;
		background-color: #7B3F00;
		padding: 10px 15px;
		border-radius: 12px;
		box-shadow: 0 2px 6px rgba(123, 63, 0, 0.2);
	}

	.insert-btn {
		background: linear-gradient(45deg, #1E90FF, #00BFFF);
		color: #FFFFFF;
	}

	.clear-btn {
		background: linear-gradient(45deg, #FF69B4, #FF1493);
		color: #FFFFFF;
	}

	.code-btn {
		background: linear-gradient(45deg, #FFD700, #FFA500);
		color: #8B4513;
	}

	.code-selector {
		display: flex;
		align-items: center;
		background-color: #7B3F00;
		padding: 10px 15px;
		border-radius: 12px;
		box-shadow: 0 2px 6px rgba(123, 63, 0, 0.2);
	}

	.action-btn:active {
		transform: scale(0.95);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.form-group {
		margin-bottom: 20px;
	}

	.title-input {
		width: 100%;
		height: 48px;
		padding: 0 20px;
		font-size: 18px;
		border: 2px solid #AED8F5;
		border-radius: 12px;
		background-color: rgba(255, 255, 255, 0.95);
		margin-bottom: 15px;
		transition: all 0.3s ease;
		box-shadow: 0 2px 8px rgba(174, 216, 245, 0.2);
	}

	.title-input:focus {
		border-color: #1E90FF;
		box-shadow: 0 4px 12px rgba(30, 144, 255, 0.25);
		transform: translateY(-1px);
	}

	.cover-upload {
		width: 100%;
		height: 160px;
		border: 2px dashed #AED8F5;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(255, 255, 255, 0.95);
		cursor: pointer;
	}

	.upload-text {
		color: #AED8F5;
		font-size: 16px;
	}

	.cover-preview {
		width: 100%;
		height: 200px;
		position: relative;
		border-radius: 12px;
		overflow: hidden;
	}

	.cover-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.cover-actions {
		position: absolute;
		top: 10px;
		right: 10px;
		background-color: rgba(0, 0, 0, 0.6);
		padding: 5px 10px;
		border-radius: 6px;
	}

	.remove-cover {
		color: #fff;
		font-size: 14px;
	}

	.submit-btn {
		background: linear-gradient(45deg, #7B68EE, #4B0082);
		color: #FFFFFF;
	}

	.code-frame-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		animation: fadeIn 0.3s ease;
		z-index: 1000;
	}

	.code-frame-container {
		background: linear-gradient(135deg, #FFFFFF, #F8F9FA);
		border-radius: 20px;
		padding: 24px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
		width: 90%;
		max-width: 600px;
		animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.code-input {
		width: 100%;
		height: 400px;
		background-color: #1E1E1E;
		color: #D4D4D4;
		font-family: 'Monaco', 'Consolas', monospace;
		font-size: 14px;
		padding: 20px;
		border-radius: 12px;
		border: 2px solid #2D2D2D;
		overflow-x: auto;
		white-space: pre;
		margin-bottom: 16px;
		transition: all 0.3s ease;
	}

	.code-input:focus {
		border-color: #9370DB;
		box-shadow: 0 0 0 3px rgba(147, 112, 219, 0.2);
	}

	.code-frame-actions {
		display: flex;
		gap: 12px;
		justify-content: flex-end;
	}

	.code-frame-btn {
		padding: 8px 24px;
		font-size: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.code-frame-btn.confirm {
		background: linear-gradient(45deg, #00CED1, #20B2AA);
		color: #FFFFFF;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.category-selector {
		margin-bottom: 15px;
		background-color: rgba(255, 255, 255, 0.95);
		border: 2px solid #AED8F5;
		border-radius: 12px;
		padding: 10px 15px;
		transition: all 0.3s ease;
	}

	.category-selector:focus-within {
		border-color: #1E90FF;
		box-shadow: 0 4px 12px rgba(30, 144, 255, 0.25);
	}

	.category-label {
		font-size: 14px;
		color: #666;
		margin-bottom: 5px;
		display: block;
	}

	.category-picker {
		width: 100%;
	}

	.picker-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 40px;
	}

	.selected-category {
		font-size: 16px;
		color: #333;
	}

	.picker-arrow {
		font-size: 12px;
		color: #999;
	}
</style>