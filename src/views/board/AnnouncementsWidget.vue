<template>
	<div>
		<el-dialog
			:append-to-body="true"
			:title="selected.title"
			:visible.sync="modalVisible"
		>
			<div v-html="selected.description"></div>
		</el-dialog>
		<app-card :title="$t('view.starter.announcements')" :remove-body-padding="true">
			<div class="px-3 pb-3">
				<table class="table table-theme v-middle m-0" v-if="data.length > 0">
					<thead class="text-muted">
						<tr>
							<th>{{ $t("view.starter.announcement") }}</th>
							<th width="40px"></th>
							<th width="160px" class="text-nowrap">{{ $t("view.starter.date") }}</th>
						</tr>
					</thead>
					<tbody>
						<tr
							@click="show(item)"
							v-for="item in data"
							:key="item.id"
							class="v-middle pointer"
						>
							<td class="flex">{{ item.title }}</td>
							<td>
								<span v-if="item.is_pinned"><i class="el-icon-place"></i></span>
							</td>
							<td class="text-nowrap">
								<app-date-text :text="item.created_at"></app-date-text>
							</td>
						</tr>
					</tbody>
				</table>
				<div class="text-center pt-2 pb-5" v-else>
					<app-svg class="col-2 mx-auto" src="/assets/img/vectors/announcements.svg"></app-svg>
					<h6 class="font-weight-bold">Şu an için bir duyuru bulunmuyor</h6>
					<span>Duyurular eklendiğinde bu alanda görüntüleyebiliyor olacaksınız.</span>
				</div>
			</div>
		</app-card>
	</div>
</template>

<script>
export default {
	props: {
		data: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			modalVisible: false,
			selected: {},
		};
	},
	methods: {
		show(item) {
			this.selected = item;
			this.modalVisible = true;
		},
	},
};
</script>
