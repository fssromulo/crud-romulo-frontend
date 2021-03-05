<template>
	<div>
		<div class="row">
			<div class="offset-md-4 col-md-4">
				<h3>Lista de pessoas:</h3>
			</div>
		</div>

		<div class="input-group mb-3">
			<input
				type="text"
				class="form-control"
				v-model="namePerson"
				placeholder="Nome da pessoa..."
				:disabled="isLoading"
				v-on:keyup.enter="searchPersonByPermission"
			/>

			<input class="btn btn-primary" :disabled="isLoading" style="margin-left:10px" type="button" @click="searchPersonByPermission" value="Pesquisar" />
		</div>

		<div class="row">
			<div class="col-md-12">
				<button @click="logout" class="btn btn-danger" type="button">Sair</button> &nbsp;
				<button data-bs-toggle="modal" data-bs-target="#crudRomulo" class="btn btn-primary" type="button">Adicionar</button>
				<br />
				<br />
			</div>
		</div>

		<div class="row">
			<div class="offset-md-4 col-md-4" v-show="isLoading">
				<div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
					<span class="visually-hidden"></span>
				</div>
			</div>
		</div>

		<div class="row" v-show="!isLoading">
			<div class="col-md-12">
				<table class="table table-hover">
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Nome</th>
							<th scope="col">E-mail</th>
							<th scope="col">Permissão:</th>
							<th scope="col">Telefone</th>
							<th scope="col">Ações</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="person in listOfPersons" :key="person.id">
							<th scope="row">{{ person.id }}</th>
							<td>{{ person.name }}</td>
							<td>{{ person.email }}</td>
							<td>{{ person.permission == "admin" ? "Administrador" : "Usuário padrão" }}</td>
							<td>{{ person.phone }}</td>
							<td>
								<span class="btn-link" style="cursor:pointer" @click="setUpdatePerson(person)">Alterar </span>
								<span class="btn-link" v-if="$store.getters.getPerson.id != person.id" style="cursor:pointer" @click="deletePerson(person)">
									// Remover</span
								>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<!-- Modal -->
		<div class="modal fade" id="crudRomulo" tabindex="-1" aria-labelledby="crudRomuloLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="crudRomuloLabel">Pessoa</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<form>
							<div class="row">
								<div class="col-sm-6">
									<div class="form-group">
										<label for="name" class="col-form-label">Nome:</label>
										<input type="text" class="form-control" v-model="objPersonSelected.name" id="name" />
									</div>
								</div>
								<div class="col-sm-6">
									<div class="form-group">
										<label for="password-field" class="col-form-label">Senha:</label>
										<input type="password" class="form-control" v-model="objPersonSelected.password" id="password-field" />
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-sm-6">
									<div class="form-group">
										<label for="email-field" class="col-form-label">E-mail:</label>
										<input type="email" class="form-control" v-model="objPersonSelected.email" id="email-field" />
									</div>
								</div>
								<div class="col-sm-6">
									<div class="form-group">
										<label for="phone-field" class="col-form-label">Telefone:</label>
										<input type="tel" class="form-control" v-model="objPersonSelected.phone" id="phone-field" />
									</div>
								</div>
							</div>
							<div class="row">
								<div class="form-check">
									<input
										class="form-check-input"
										v-model="objPersonSelected.permission"
										type="radio"
										name="exampleRadios"
										id="exampleRadios1"
										value="admin"
									/>
									<label class="form-check-label" for="exampleRadios1">
										Administrador
									</label>
								</div>
								<div class="form-check">
									<input
										class="form-check-input"
										v-model="objPersonSelected.permission"
										type="radio"
										name="exampleRadios"
										id="exampleRadios2"
										value="standard"
										checked
									/>
									<label class="form-check-label" for="exampleRadios2">
										Usuário padrão
									</label>
								</div>
							</div>
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
							Fechar
						</button>
						<button type="button" class="btn btn-primary" @click="savePerson">
							Salvar
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getService, deleteService, post } from "../service/service-default/service-default";

import jQuery from "jquery";
const $ = jQuery;

export default {
	name: "ListPersons",

	data() {
		return {
			listOfPersons: [],
			objPersonSelected: {
				name: null,
				password: null,
				email: null,
				permission: null,
				phone: null,
			},
			namePerson: "",
			isLoading: false,
		};
	},

	async mounted() {
		this.searchPersonByPermission();
	},

	methods: {
		searchPersonByPermission() {
			if (this.$store.getters.isPersonAdmin) {
				this.getPerson();
			} else {
				this.getPersonById();
			}
		},

		async getPerson() {
			let params = {};

			this.isLoading = true;
			if (this.namePerson.length > 0) {
				params = { name: this.namePerson };
			}

			const objQueryParams = new URLSearchParams(params).toString();
			const objResponse = await getService("persons", objQueryParams);
			this.listOfPersons = objResponse.data;
			this.isLoading = false;
		},

		async getPersonById() {
			this.isLoading = true;
			const idPerson = this.$store.getters.getPerson.id || 0;
			const objResponse = await getService(`persons/${idPerson}`);
			this.listOfPersons = objResponse.data;
			this.isLoading = false;
		},

		async savePerson() {
			this.isLoading = true;

			await post(`persons`, this.objPersonSelected);
			this.$nextTick(() => {
				$("#crudRomulo").modal("hide");
			});
			this.searchPersonByPermission();
			this.isLoading = false;
		},

		async setUpdatePerson(person) {
			this.objPersonSelected = { ...person };
			this.$nextTick(() => {
				$("#crudRomulo").modal("show");
			});
		},

		async deletePerson(person) {
			this.isLoading = true;
			await deleteService(`persons/${person.id}`);
			this.searchPersonByPermission();
			this.isLoading = false;
		},

		async logout() {
			this.$store.dispatch("logout", {});
		},
	},
};
</script>

<style></style>
