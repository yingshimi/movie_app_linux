import request from '@/static/api/requests.js'

export function getFilmData(page) {
	return request({
		url: 'api/videos/yinsifan/films/',
		method: 'GET',
		data: page
	});
}

