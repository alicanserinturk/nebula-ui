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
							<span v-if="form['strategy'] === 'leastrecent'">En uzun süredir çağrı almamış kullanıcıya bağla</span>
							<span v-else-if="form['strategy'] === 'rrmemory'">Sırayla dağıt (kaldığı yerden devam eder)</span>
							<span v-else-if="form['strategy'] === 'fewestcalls'">Bugün en az çağrı almış kullanıcıya bağla</span>
							<span v-else-if="form['strategy'] === 'ringall'">Tüm kullanıcıları aynı anda çaldır, ilk cevaplayan alır</span>
							<span v-else-if="form['strategy'] === 'linear'">Listedeki sıraya göre dene, her zaman ilk kullanıcıdan başla</span>
							<span v-else-if="form['strategy'] === 'random'">Rastgele bir kullanıcıya bağla</span>
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
									@change="onMembersChanged"
								>
									<template slot-scope="{ row }">
										{{ row.name }}
										<small class="d-block text-muted">{{ row.email }}</small>
									</template>
								</app-selector>
							</div>
						</template>
						<div class="px-3 pb-3">
							<el-alert type="info" :closable="false" show-icon>
								<small>
									Kullanıcıları sürükleyerek sıralayabilirsiniz. Bu sıralama, <strong>"Listedeki sıraya göre dene"</strong> stratejisi seçildiğinde çağrı dağıtımını doğrudan etkiler — üstteki kullanıcı her çağrıda ilk denenen olur. Diğer stratejilerde sıra yalnızca gösterim amaçlıdır.
								</small>
							</el-alert>
						</div>
						<div v-if="form.users.length === 0" class="text-center p-3">
							<small>Arama grubunda herhangi bir kullanıcı bulunamadı.</small>
						</div>
						<div v-else>
							<draggable v-model="form.users" handle=".queue-user-drag" @end="updateOrder">
								<div
									class="list list-row p-0"
									v-for="item in form.users"
									:key="item.id"
								>
									<div class="list-item p-0 mb-4 align-items-center">
										<div class="p-0 pr-2 queue-user-drag" style="cursor: grab;" title="Sürükleyerek sırala">
											<i class="el-icon-rank text-muted" style="font-size: 18px;"></i>
										</div>
										<div class="p-0">
											<span class="w-40 mr-1 avatar circle bg-light"
												>{{ item.name[0] }}{{ (item.surname || item.name)[0] }}</span
											>
										</div>
										<div class="flex">
											<span class="item-author"
												>{{ item.name }} {{ item.surname }}</span
											>
											<small class="d-block text-muted">{{ item.email }}</small>
										</div>
									</div>
								</div>
							</draggable>
						</div>
					</app-card>
				</div>
			</div>
		</app-module-body>
	</app-module>
</template>
<script>
import API from "../../../utils/API";
import draggable from "vuedraggable";

export default {
	components: {
		draggable,
	},
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
	methods: {
		onMembersChanged() {
			// app-selector kayıt sonrası burada bildirir; yeni eklenenleri
			// sıranın sonuna koymak için tekrar order PUT etmiyoruz çünkü
			// selector zaten /users alanını PUT etti. Position değerleri
			// backend'de dizi sırasına göre yeniden atanır.
		},
		updateOrder() {
			this.$api.put(
				"settings/queues/" + this.form.id,
				{ users: this.form.users.map((u) => u.id) },
				() => {}
			);
		},
	},
};
</script>
