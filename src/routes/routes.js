import Vue from "vue";
import VueRouter from "vue-router";

import LoginCrudList from "../../src/containers/LoginCrud";
import ListPersonsList from "../../src/containers/ListPersons";

Vue.use(VueRouter);
const routes = [
	{
		path: "/login",
		component: LoginCrudList,
		name: "LoginCrudList",
	},
	{
		path: "/list-persons",
		component: ListPersonsList,
		name: "ListPersonsList",
	},
	{ path: "*", redirect: "/login" },
];

const router = new VueRouter({
	mode: "history",
	routes,
});

export default router;
