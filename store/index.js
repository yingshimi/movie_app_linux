import Vue from "vue";
import Vuex from "vuex";

import {
	getItem,
	setItem,
	USER_KEY,
	TOKEN_KEY,
	REFRESH_TOKEN_KEY,
	MOVIES,
	removeItem,
} from "@/static/utils/storage.js";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		user: getItem(USER_KEY) || {},
		token: getItem(TOKEN_KEY) || "",
		refresh: getItem(REFRESH_TOKEN_KEY) || "",
		movies: getItem(MOVIES) || [],
		fingerDatas: getItem("fingerDatas") || [],
	},

	mutations: {
		setUser(state, data) {
			state.user = data;
			setItem(USER_KEY, state.user);
		},
		setToken(state, token) {
			state.token = token;
			setItem(TOKEN_KEY, token);
		},
		setRefreshToken(state, refreshToken) {
			state.refresh = refreshToken;
			setItem(REFRESH_TOKEN_KEY, refreshToken);
		},
		setUserInfo(state, userData) {
			// 设置用户登录信息（包括用户数据、访问令牌和刷新令牌）
			state.user = userData.user;
			state.token = userData.access;
			state.refresh = userData.refresh;
			
			setItem(USER_KEY, userData.user);
			setItem(TOKEN_KEY, userData.access);
			setItem(REFRESH_TOKEN_KEY, userData.refresh);
		},
		setMovies(state, data) {
			state.movies.push(data);
			setItem(MOVIES, state.movies);
		},
		removeUser(state) {
			state.user = {};
			state.token = "";
			state.refresh = "";
			removeItem(USER_KEY);
			removeItem(TOKEN_KEY);
			removeItem(REFRESH_TOKEN_KEY);
		},
		setfingerDatas(state, data) {
			state.fingerDatas = data;
			setItem("fingerDatas", state.fingerDatas);
		},
		pushfingerDatas(state, item) {
			state.fingerDatas.push(item);
		},
		REMOVE_FINGER_DATA(state, index) {
			state.fingerDatas.splice(index, 1);
		},
	},
});