import router from "./../routes/routes";
import store from "../store/store";

const getAuthHeader = () => {
	return `Bearer ${localStorage.getItem("@CrudRomulo:token")}`;
};

const validateBackendError = (obj) => {
	if (obj.status == 401) {
		store.dispatch("logout");
		router.replace("/login");
		return true;
	}
	return false;
};

const setAxiosInstance = (instance) => {
	instance.interceptors.request.use((config) => {
		config.headers["Authorization"] = getAuthHeader();
		return config;
	});

	instance.interceptors.response.use(
		(response) => {
			return response;
		},
		(err) => {
			validateBackendError(err.response);
		}
	);
};

const auth = { setAxiosInstance };
export default auth;
