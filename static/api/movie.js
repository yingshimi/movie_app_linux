import request from '@/static/api/requests.js'

/**
 * 获取电影列表
 * @param {string} [tag] - 电影分类标签
 * @returns {Promise} 请求Promise对象
 */
export function getMovieList(tag) {
	if (tag) {
		return request({
			url: `api/collections/${tag}/`,
			method: 'GET',
		});
	} else {
		return request({
			url: 'api/collections/',
			method: 'GET',
		});
	}
}

/**
 * 获取云盘链接
 * @param {string} key - 电影唯一标识
 * @returns {Promise} 请求Promise对象
 */
export function getYunPanLink(key) {
	return request({
		url: 'api/yunpan/',
		method: 'GET',
		params: {
			key
		}
	});
}

/**
 * 获取在线观看链接
 * @param {string} key - 电影唯一标识
 * @returns {Promise} 请求Promise对象
 */
export function getOnlineUrl(key) {
	return request({
		url: 'api/online/',
		method: 'GET',
		params: {
			key
		}
	});
}

/**
 * 收藏电影
 * @param {number} movieId - 电影ID
 * @returns {Promise} 请求Promise对象
 */
export function favoriteMovie(movieId) {
	return request({
		url: 'api/movie/collect/',
		method: 'POST',
		data: {
			movie: movieId
		}
	});
}

/**
 * 取消收藏电影
 * @param {number} movieId - 电影ID
 * @returns {Promise} 请求Promise对象
 */
export function cancelFavoriteMovie(movieId) {
    return request({
        url: `api/movie/collect/${movieId}/`,
        method: 'DELETE'
    });
}

/**
 * 获取收藏电影列表
 * @returns {Promise} 请求Promise对象
 */
export function getFavoriteMovies() {
	return request({
		url: 'api/movie/collect/',
		method: 'GET'
	});
}

/**
 * 获取4K影片列表
 * @param {number} page - 页码
 * @returns {Promise} 请求Promise对象
 */
export function get4KFilms(page = 1) {
	return request({
		url: 'api/4kfilm/',
		method: 'GET',
		params: {
			page
		}
	});
}

/**
 * 获取更新的视频URL
 * @param {number} id - 视频链接ID
 * @returns {Promise} 请求Promise对象
 */
export function getUpdatedVideoUrl(id) {
	return request({
		url: 'api/update_url/',
		method: 'GET',
		params: {
			video_url: id
		}
	});
}

/**
 * 获取电影详情
 * @param {number} id - 电影ID
 * @returns {Promise} 请求Promise对象
 */
export function getMovieDetail(id) {
	return request({
		url: `api/movies/${id}/`,
		method: 'GET'
	});
}

/**
 * 获取电影评论
 * @param {number} movieId - 电影ID
 * @param {Object} params - 查询参数
 * @returns {Promise} 请求Promise对象
 */
export function getMovieComments(movieId, params = {}) {
	return request({
		url: 'api/comments/',
		method: 'GET',
		params: {
			...params,
			movie_id: movieId
		}
	});
}

/**
 * 获取相关电影推荐
 * @param {number} movieId - 电影ID
 * @returns {Promise} 请求Promise对象
 */
export function getRelatedMovies(movieId) {
	return request({
		url: `api/movies/${movieId}/related/`,
		method: 'GET'
	});
}

/**
 * 获取影视详细信息
 * @param {number} movie_id - 电影ID
 * @returns {Promise} 请求Promise对象
 */
export function getDetail(movie_id) {
	return request({
		url: 'api/videos/tmdbdata/',
		method: 'GET',
		data: {
			movie_id
		}
	})
}

/**
 * 搜索影视的基本信息
 * @param {Object} data - 搜索参数
 * @returns {Promise} 请求Promise对象
 */
export function tmdbSearch(data) {
	return request({
		url: 'api/videos/tmdbsearch/',
		method: 'GET',
		data,
	})
}

/**
 * 获取电影榜单列表
 * @returns {Promise} 请求Promise对象
 */
export function getMovieLst() {
	return request({
		url: 'api/movie/collections/',
		method: 'GET'
	});
}