import request from '@/static/api/requests.js'

export function getAlist(data) {
	return request({
		url: 'api/videos/get_alist/',
		method: 'POST',
		data: data
	})
}


export function getAlistFile(data) {
	return request({
		url: 'api/videos/get_file/',
		method: 'POST',
		data: data
	})
}
