<template>
	<div class="agent-tasks-widget">
		<app-card>
			<div class="task-stats">
				<div class="task-stat">
					<div class="task-icon is-pending">
						<ion-icon name="hourglass-outline"></ion-icon>
					</div>
					<div class="task-info">
						<small class="text-muted">Bekleyen</small>
						<strong>{{ data.pending || 0 }}</strong>
					</div>
				</div>
				<div class="task-stat">
					<div class="task-icon is-scheduled">
						<ion-icon name="calendar-outline"></ion-icon>
					</div>
					<div class="task-info">
						<small class="text-muted">Planlanmış</small>
						<strong>{{ data.scheduled || 0 }}</strong>
					</div>
				</div>
				<div class="task-stat">
					<div class="task-icon is-mine">
						<ion-icon name="person-outline"></ion-icon>
					</div>
					<div class="task-info">
						<small class="text-muted">Üstlendiklerim</small>
						<strong>{{ data.mine || 0 }}</strong>
					</div>
				</div>
			</div>

			<div class="task-footer">
				<router-link to="/agent/task" class="task-link">
					Listeye Git
					<ion-icon name="arrow-forward-outline"></ion-icon>
				</router-link>
			</div>
		</app-card>
	</div>
</template>

<script>
export default {
	props: {
		data: {
			type: Object,
			required: true,
		},
	},
};
</script>

<style scoped>
.task-stats {
	display: flex;
	flex-direction: column;
	gap: 10px;
}
.task-stat {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 10px 14px;
	background: #f6f7f9;
	border: 1px solid #ebeef2;
	border-radius: 10px;
}
.task-icon {
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 17px;
	flex-shrink: 0;
}
.task-icon.is-pending {
	color: #f0a500;
	background: rgba(240, 165, 0, 0.12);
}
.task-icon.is-scheduled {
	color: #17a2b8;
	background: rgba(23, 162, 184, 0.12);
}
.task-icon.is-mine {
	color: #28a745;
	background: rgba(40, 167, 69, 0.12);
}
.task-info {
	display: flex;
	flex-direction: column;
	flex: 1;
	line-height: 1.2;
}
.task-info small {
	font-size: 11px;
	letter-spacing: 0.3px;
}
.task-info strong {
	font-size: 20px;
	font-variant-numeric: tabular-nums;
	color: #2b3340;
}

.task-footer {
	margin-top: 16px;
	padding-top: 12px;
	border-top: 1px solid #eef0f3;
	text-align: right;
}
.task-link {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	font-size: 12px;
	font-weight: 600;
	color: #6c757d;
	text-decoration: none;
	letter-spacing: 0.2px;
}
.task-link:hover {
	color: #007bff;
}
.task-link ion-icon {
	font-size: 14px;
}
</style>
