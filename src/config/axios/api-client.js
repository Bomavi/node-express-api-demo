/* local imports: common */
const axios = require('./axios');

module.exports = class ApiClient {
	constructor({ apiPrefix }) {
		if (!apiPrefix) {
			throw new Error('[apiPrefix] required');
		}

		this.prefix = apiPrefix;
	}

	get(url, params = {}, options = {}) {
		return this.request({
			url,
			params,
			options,
			method: 'get',
		});
	}

	put(url, body = {}, params = {}, options = {}) {
		return this.request({
			url,
			body,
			params,
			options,
			method: 'put',
		});
	}

	patch(url, body = {}) {
		return this.request({
			url,
			body,
			method: 'patch',
		});
	}

	post(url, body = {}, params = {}, options = {}) {
		return this.request({
			url,
			body,
			params,
			options,
			method: 'post',
		});
	}

	delete(url, params = {}) {
		return this.request({
			url,
			params,
			method: 'delete',
		});
	}

	// async request({ url, method, params, body, options }) {
	async request({ url, method, params, body }) {
		try {
			const response = await axios({
				method,
				url,
				params,
				baseURL: this.prefix,
				data: body,
				// ...options, // ! spread operator does not work
			});
			return response.data;
		} catch (e) {
			const response = e.response;
			if (!response) {
				console.error(e);
				throw Error(e);
			}
			if (response.status >= 400) {
				const serverError = e;
				serverError.res = response;
				throw serverError;
			}
			return e;
		}
	}
};
