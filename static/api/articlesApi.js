import request from '@/static/api/requests.js'

/**
 * 获取文章分类列表
 * @returns {Promise} 请求Promise对象
 */
export function getCategoryList() {
    return request({
        url: 'api/articles/categories/',
        method: 'GET'
    });
}

/**
 * 获取文章分类详情
 * @param {number} id - 分类ID
 * @returns {Promise} 请求Promise对象
 */
export function getCategoryDetail(id) {
    return request({
        url: `api/articles/categories/${id}/`,
        method: 'GET'
    });
}

/**
 * 创建文章分类
 * @param {Object} categoryData - 分类数据
 * @param {string} categoryData.name - 分类名称
 * @param {string} [categoryData.description] - 分类描述
 * @returns {Promise} 请求Promise对象
 */
export function createCategory(categoryData) {
    return request({
        url: 'api/articles/categories/',
        method: 'POST',
        data: categoryData
    });
}

/**
 * 更新文章分类
 * @param {number} id - 分类ID
 * @param {Object} categoryData - 分类数据
 * @param {string} [categoryData.name] - 分类名称
 * @param {string} [categoryData.description] - 分类描述
 * @returns {Promise} 请求Promise对象
 */
export function updateCategory(id, categoryData) {
    return request({
        url: `api/articles/categories/${id}/`,
        method: 'PATCH',
        data: categoryData
    });
}

/**
 * 删除文章分类
 * @param {number} id - 分类ID
 * @returns {Promise} 请求Promise对象
 */
export function deleteCategory(id) {
    return request({
        url: `api/articles/categories/${id}/`,
        method: 'DELETE'
    });
}

/**
 * 获取文章列表
 * @param {Object} params - 查询参数
 * @param {string} [params.author] - 作者用户名
 * @param {number} [params.page] - 分页页码
 * @returns {Promise} 请求Promise对象
 */
export function getArticleList(params = {}) {
    return request({
        url: 'api/articles/',
        method: 'GET',
        params
    });
}

/**
 * 获取文章详情
 * @param {number} id - 文章ID
 * @returns {Promise} 请求Promise对象
 */
export function getArticleDetail(id) {
    return request({
        url: `api/articles/${id}/`,
        method: 'GET'
    });
}

/**
 * 创建文章
 * @param {Object} articleData - 文章数据
 * @param {string} articleData.title - 文章标题
 * @param {string} articleData.content - 文章HTML内容
 * @param {File} [articleData.cover_img] - 文章封面图片
 * @param {number} [articleData.category] - 分类ID
 * @param {Array<number>} [articleData.tags] - 标签ID数组
 * @param {string} [articleData.status] - 文章状态(draft/published)
 * @returns {Promise} 请求Promise对象
 */
export function createArticle(articleData) {
    const formData = new FormData();
    Object.keys(articleData).forEach(key => {
        if (key === 'tags' && Array.isArray(articleData[key])) {
            articleData[key].forEach(tagId => {
                formData.append('tags', tagId);
            });
        } else {
            formData.append(key, articleData[key]);
        }
    });

    return request({
        url: 'api/articles/',
        method: 'POST',
        data: formData,
        header: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

/**
 * 更新文章
 * @param {number} id - 文章ID
 * @param {Object} articleData - 文章数据
 * @param {string} [articleData.title] - 文章标题
 * @param {string} [articleData.content] - 文章HTML内容
 * @param {File} [articleData.cover_img] - 文章封面图片
 * @param {number} [articleData.category] - 分类ID
 * @param {Array<number>} [articleData.tags] - 标签ID数组
 * @param {string} [articleData.status] - 文章状态(draft/published)
 * @returns {Promise} 请求Promise对象
 */
export function updateArticle(id, articleData) {
    const formData = new FormData();
    Object.keys(articleData).forEach(key => {
        if (key === 'tags' && Array.isArray(articleData[key])) {
            articleData[key].forEach(tagId => {
                formData.append('tags', tagId);
            });
        } else {
            formData.append(key, articleData[key]);
        }
    });

    return request({
        url: `api/articles/${id}/`,
        method: 'PATCH',
        data: formData,
        header: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

/**
 * 删除文章
 * @param {number} id - 文章ID
 * @returns {Promise} 请求Promise对象
 */
export function deleteArticle(id) {
    return request({
        url: `api/articles/${id}/`,
        method: 'DELETE'
    });
} 