<template>
	<div>
		<form>
			<div class="form-group">
				<input type="email" class="form-control" v-model="email" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
			</div>
			<div class="form-group">
				<input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" v-model="password" />
			</div>
			<button type="button" @click="doLogin" class="btn btn-primary">Entrar</button>
		</form>
	</div>
</template>

<script>
export default {
	name: "LoginCrud",

	data() {
		return {
			email: "",
			password: "",
		};
	},

	async mounted() {},

	methods: {
		async doLogin() {
			this.$store.dispatch("login", {
				email: this.email,
				password: this.password,
			});
		},
	},
};
</script>

<style></style>
