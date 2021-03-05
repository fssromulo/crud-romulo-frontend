<template>
	<div class="container-fluid" id="app">
		<router-view>
			<LoginCrud />
		</router-view>
	</div>
</template>

<script>
import LoginCrud from "./containers/LoginCrud.vue";

export default {
	name: "App",
	components: {
		LoginCrud,
	},
	created() {
		this.$store.dispatch("autoLogin");
	},
};
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 20px;
}
</style>
