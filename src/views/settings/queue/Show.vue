<template>
	<app-module class="">
		<app-module-header>
			<div slot="action">
				<app-log
					owner-type="queues"
					:owner-id="form.id"
					:labels="[
						'wrap_up_time',
						'name',
						'timeout',
						'strategy',
						'service_level',
						'number_is_hidden',
					]"
				></app-log>
				<button
					v-if="$api.has('queue_edit')"
					@click="$router.push($route.path + '/edit')"
					class="btn btn-sm btn-rounded btn-light i-con-h-a ml-2"
				>
					{{ $t("action.edit") }}
					<i class="i-con i-con-edit float-right ml-2"><i></i></i>
				</button>
				<button
					v-if="$api.has('queue_create')"
					@click="$router.push('/settings/queue/create')"
					class="btn btn-sm btn-rounded btn-primary i-con-h-a ml-2"
				>
					{{ $t("menu.modules.queue_create.title") }}
					<i class="i-con i-con-arrow-right float-right ml-2"><i></i></i>
				</button>
			</div>
		</app-module-header>
		<app-module-body>
			<app-warning></app-warning>
			<div class="app-module-frame">
				<div class="app-module-main">
					<app-card>
						<div slot="header">
							<h5 class="mb-0">{{ form.name }}</h5>
						</div>
						<app-label icon="el-icon-video-pause" label="Nefes Alma Süresi"
							>{{ form["wrap_up_time"] }} Saniye</app-label
						>
						<app-label icon="el-icon-refresh-right" label="Zaman Aşımı"
							>{{ form["timeout"] }} Saniye</app-label
						>
						<app-label icon="el-icon-sort" label="Kuyruk Dağıtma Stratejisi">
							<span v-if="form['strategy'] === 'random'">Rastgele bağla</span>
							<span v-else-if="form['strategy'] === 'fewestcalls'"
								>Hatta en az çağrı alan kullanıcıya bağla</span
							>
							<span v-else-if="form['strategy'] === 'leastrecent'"
								>Hatta müsait durumda en uzun süredir bekleyen kullanıcıya
								bağla</span
							>
						</app-label>
						<app-label icon="el-icon-timer" label="SLA Eşiği"
							>{{ form["service_level"] }} Saniye</app-label
						>
					</app-card>
					<app-card>
						<template slot="header">
							<div class="d-inline-block pt-1">
								<strong>Kullanıcılar</strong>
							</div>
							<div class="d-inline-block float-right">
								<app-selector
									v-model="form.users"
									endpoint="settings/users"
									:action-endpoint="'settings/queues/' + form.id"
									action-field="users"
									name="Kullanıcıları Yönet"
									@change="update"
								>
									<template slot-scope="{ row }">
										{{ row.name }}
										<small class="d-block text-muted">{{ row.email }}</small>
									</template>
								</app-selector>
							</div>
						</template>
						<div v-if="form.users.length === 0" class="text-center p-3">
							<small>Arama grubunda herhangi bir kullanıcı bulunamadı.</small>
						</div>
						<div v-else>
							<div class="list list-row p-0" v-for="(item, key) in form.users">
								<div class="list-item p-0 mb-4">
									<div class="p-0">
										<span class="w-40 mr-1 avatar circle bg-light"
											>{{ item.name[0] }}{{ item.name[0] }}</span
										>
									</div>
									<div class="flex">
										<span class="item-author"
											>{{ item.name }} {{ item.name }}</span
										>
										<small class="d-block text-muted">{{ item.email }}</small>
									</div>
								</div>
							</div>
						</div>
					</app-card>
				</div>
			</div>
		</app-module-body>
	</app-module>
</template>
<script>
import API from "../../../utils/API";

export default {
	data() {
		return {
			form: {
				users: [],
			},
		};
	},
	beforeRouteEnter(to, from, next) {
		API.get("settings/queues/" + to.params.id, {}, (response) => {
			next((wm) => {
				wm.form = response.data;
			});
		});
	},
	created() {
		this.getUsers();
	},
	methods: {
		getUsers() {
			this.$api.get("settings/users", {}, (response) => {
				this.users = response.data.data;
				console.log(response);
			});
		},
		update() {},
	},
};
</script>
