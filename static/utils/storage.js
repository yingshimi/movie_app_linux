// export const USER_KEY = "test-user";

// export const MOVIES = "movies";

// export const getItem = (name) => {
//   const data = window.localStorage.getItem(name);
//   try {
//     return JSON.parse(data);
//   } catch (error) {
//     return data;
//   }
// };

// // 怎么理解
// export const setItem = (name, value) => {
//   if (typeof value === "object") {
//     value = JSON.stringify(value);
//   }
//   window.localStorage.setItem(name, value);
// };

// export const removeItem = (name) => {
//   window.localStorage.removeItem(name);
// };


export const USER_KEY = "test-user";
export const TOKEN_KEY = "access-token";
export const REFRESH_TOKEN_KEY = "refresh-token";
export const MOVIES = "movies";

export const getItem = (name) => {
	const data = uni.getStorageSync(name); // 使用 uni.getStorageSync 获取数据
	try {
		return JSON.parse(data); // 尝试解析为 JSON
	} catch (error) {
		return data; // 如果解析失败，直接返回原始数据
	}
};

export const setItem = (name, value) => {
	if (typeof value === "object") {
		value = JSON.stringify(value); // 如果值是对象，先将其转换为 JSON 字符串
	}
	uni.setStorageSync(name, value); // 使用 uni.setStorageSync 设置数据
};

export const removeItem = (name) => {
	uni.removeStorageSync(name); // 使用 uni.removeStorageSync 删除数据
};