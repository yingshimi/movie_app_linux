import request from '@/static/api/requests.js'

export function getPoster(tag) {
	return request({
		url: 'api/upload/poster/',
		method: 'GET',
		data: {
			tag
		}
	})
}

export function getDetail(movie_id) {
	return request({
		url: 'api/videos/tmdbdata/',
		method: 'GET',
		data: {
			movie_id
		}
	})
}

export function tmdbSearch(data) {
	return request({
		url: 'api/videos/tmdbsearch/',
		method: 'GET',
		data,
	})
}