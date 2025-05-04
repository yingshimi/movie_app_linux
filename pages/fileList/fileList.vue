<template>
	<!-- 	<view class="">
		<view v-for="(item,index) in root.content" :key="index" @click="chooseDirOrFlie(item)">
			<text>{{item.name}}</text>
		</view>
		<button v-if="path !== '/夸克网盘'" @click="goBack">返回</button>
	</view> -->
	<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower"
		@scroll="scroll">
		<view v-for="(item,index) in root.content" :key="index" @click="chooseDirOrFlie(item)">
			<text>{{item.name}}</text>
		</view>
		<button v-if="path !== '/夸克网盘'" @click="goBack">返回</button>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				root: {},
				path: '/夸克网盘',
				file_url: '',
			}
		},
		methods: {
			goBack() {
				// 移除路径中的最后一个目录
				const paths = decodeURIComponent(this.path).split('/');
				paths.pop(); // 移除最后一个元素
				this.path = paths.join('/');

				// 如果路径为空，则默认设置为根目录
				if (!this.path) {
					this.path = '/夸克网盘';
				}

				this.getJuji();
			},

			getJuji(e) {
				console.log(this.path)
				console.log('this.path')
				let data = {
					path: this.path,
					password: '',
					page: 1,
					per_page: 0,
					refresh: false
				}

				uni.request({
					url: 'http://127.0.0.1:5244/api/fs/list', // 请求的接口地址
					method: 'POST', // 请求方法
					data: data,
					header: {
						'Accept': 'application/json, text/plain, */*',
						'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
						'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjY2NiIsInB3ZF90cyI6MTcxNjkwMDg1NSwiZXhwIjoxNzQxNTczNTQ2LCJuYmYiOjE3NDE0MDA3NDYsImlhdCI6MTc0MTQwMDc0Nn0.39ozaWOKXsR7SbD18IB_Xl43nqd3xW02PrvvALDLWPY',
						'Cache-Control': 'no-cache',
						'Connection': 'keep-alive',
						'Content-Type': 'application/json;charset=UTF-8',
						'Origin': 'http://127.0.0.1:5244',
						'Pragma': 'no-cache',
						'Referer': 'http://127.0.0.1:5244/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98',
						'Sec-Fetch-Dest': 'empty',
						'Sec-Fetch-Mode': 'cors',
						'Sec-Fetch-Site': 'same-origin',
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
						'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
						'sec-ch-ua-mobile': '?0',
						'sec-ch-ua-platform': '"Windows"'
					},
					success: (res) => {
						this.root = res.data.data // 打印返回的数据
						console.log(res.data)
					},
					fail: (err) => {
						console.error('请求失败', err); // 打印错误信息
					}
				});
			},
			getfile(e) {
				console.log(e)
				console.log('++++++++++++++++++++++++++++++++++++++++=')
				let data = {
					path: `${this.path}/${e}`,
					password: '',
				}
				uni.request({
					url: 'http://127.0.0.1:5244/api/fs/get', // 请求的接口地址
					method: 'POST', // 请求方法
					data: data,
					header: {
						'Accept': 'application/json, text/plain, */*',
						'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
						'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjY2NiIsInB3ZF90cyI6MTcxNjkwMDg1NSwiZXhwIjoxNzQxNTczNTQ2LCJuYmYiOjE3NDE0MDA3NDYsImlhdCI6MTc0MTQwMDc0Nn0.39ozaWOKXsR7SbD18IB_Xl43nqd3xW02PrvvALDLWPY',
						'Cache-Control': 'no-cache',
						'Connection': 'keep-alive',
						'Content-Type': 'application/json;charset=UTF-8',
						'Origin': 'http://127.0.0.1:5244',
						'Pragma': 'no-cache',
						'Referer': 'http://127.0.0.1:5244/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98/%E5%89%A7%E9%9B%86/%E4%BA%BA%E7%94%9F%E5%88%87%E5%89%B2%E6%9C%AF',
						'Sec-Fetch-Dest': 'empty',
						'Sec-Fetch-Mode': 'cors',
						'Sec-Fetch-Site': 'same-origin',
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
						'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
						'sec-ch-ua-mobile': '?0',
						'sec-ch-ua-platform': '"Windows"'
					},
					success: (res) => {
						console.log('获取文件')
						console.log(res.data.data.raw_url)
					},
					fail: (err) => {
						console.error('请求失败', err); // 打印错误信息
					}
				});
			},

			chooseDirOrFlie(e) {
				console.log(e)
				console.log('+++++++++++++++++++++++++++++++++++==')
				if (e.is_dir) {
					this.path += `/${e.name}`;
					this.getJuji(e.name)
				} else {
					this.getfile(e.name)
				}
			}
		},
		created() {
			this.getJuji(this.path)
			const pages = getCurrentPages(); // 获取当前页面栈
			const currentPage = pages[pages.length - 1]; // 获取当前页面实例
			const currentPath = currentPage.route; // 获取当前页面的路径
			console.log('当前页面路径:', currentPath);
		}
	}
</script>

<style>

</style>