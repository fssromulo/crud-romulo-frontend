import Vue from "vue";
import Vuex from "vuex";
import { post } from "../service/service-default/service-default";
import router from "../routes/routes";
Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		token: null,
		objPerson: {},
		expiresIn: null,
	},
	getters: {
		getPerson(state) {
			return state.objPerson;
		},

		isPersonAdmin(state) {
			console.log("dfsdfsdf", state.objPerson);
			return state.objPerson.permission == "admin" || false;
		},

		isAuthenticated(state) {
			return !(!state.token || !state.expiresIn);
		},
	},
	mutations: {
		authUser(state, userData) {
			localStorage.setItem("@CrudRomulo:token", userData.token);
			localStorage.setItem("@CrudRomulo:expiresIn", userData.expiresIn);
			localStorage.setItem("@CrudRomulo:objPerson", JSON.stringify(userData.objPerson));
			state.token = userData.token;
			state.expiresIn = userData.expiresIn;
			state.objPerson = userData.objPerson;

			router.replace("/list-persons");
		},

		logout(state) {
			state.token = null;
			state.expiresIn = null;
			state.objPerson = {};

			localStorage.removeItem("@CrudRomulo:token");
			localStorage.removeItem("@CrudRomulo:expiresIn");
			localStorage.removeItem("@CrudRomulo:objPerson");

			router.replace("/login");
		},
	},
	actions: {
		autoLogin({ commit }) {
			// Busca o TOKEN do localStorage
			const token = localStorage.getItem("@CrudRomulo:token");

			// Se não existe TOKEN setado, jogará para a tela de login
			if (!token) {
				commit("logout");
				return;
			}

			// Busca a validade do TOKEN no localStorage
			const expiresIn = new Date(localStorage.getItem("@CrudRomulo:expiresIn"));

			// Busca a data de acesso atual do usuário
			const now = new Date();

			/*
				Verifica se a data atual é maior que a data de validade do TOKEN,
				Se sim, manda para o login
			*/

			if (now >= expiresIn) {
				// Limpa o localStorage
				this.dispatch("logout");
				router.replace("/login");
				return;
			}

			// Passando na validação do token, faz a autenticação automática p/ o usuário
			const objPerson = localStorage.getItem("@CrudRomulo:objPerson");

			commit("authUser", {
				token,
				expiresIn,
				objPerson: JSON.parse(objPerson),
			});
		},

		logout({ commit }) {
			commit("logout");
		},

		setLogoutTimer({ commit }, expirationTime) {
			const convertSecondsToMilliseconds = (timeInSeconds) => timeInSeconds * 1000;
			setTimeout(() => {
				commit("logout");
			}, convertSecondsToMilliseconds(expirationTime));
		},

		login({ commit }, authData) {
			post("/authenticate", authData, {
				validateStatus: (status) => {
					return status <= 500 ? true : false;
				},
			})
				.then((objResponse) => {
					if (objResponse.status == 200) {
						const now = new Date();
						const expirationDate = new Date(now.getTime() + objResponse.data.expiresIn * 1000);

						const objPersonData = objResponse.data.user.usuario;
						delete objPersonData.password;

						this.dispatch("setLogoutTimer", objResponse.data.expiresIn);
						commit("authUser", {
							token: objResponse.data.token,
							expiresIn: expirationDate,
							objPerson: objPersonData,
						});
					}

					if (objResponse.status >= 400 && objResponse.status < 500) {
						commit("setShowMensagemUsuario", {
							showMensagem: true,
							msg: objResponse.data.error || "Não foi possível autenticar seu usuário",
							color: "warning",
						});
					}
				})
				.catch(() => {});
		},
	},
});
