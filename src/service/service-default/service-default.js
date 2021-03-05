import axios from "../../axios-config/axios-request-configs";

export async function getService(url, objQueryParams) {
	try {
		let queryParams = objQueryParams ?? "";
		if (queryParams.length > 0) {
			queryParams = "?" + queryParams;
		}
		const apiData = await axios.get(`${url}${queryParams}`);
		return apiData;
	} catch (error) {
		console.error("Não foi possível efetuar a requisição[GET].", error);
		return [];
	}
}

export async function post(url, data) {
	try {
		const apiData = await axios.post(url, data);
		return apiData;
	} catch (error) {
		console.error("Não foi possível efetuar a requisição [POST/UPDATE].", error);
		return [];
	}
}

export async function deleteService(url) {
	try {
		const apiData = await axios.delete(url);
		return apiData;
	} catch (error) {
		console.error("Não foi possível efetuar a requisição [DELETE].", error);
		return [];
	}
}
