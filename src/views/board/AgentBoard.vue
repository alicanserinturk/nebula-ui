<template>
	<div class="agent-board">
		<div v-if="hasStates" class="states-bar mb-3">
			<div class="state-row">
				<div
					v-for="item in sortedStates"
					:key="item.key + '_' + item.name"
					class="state-pill"
					:class="{ 'is-empty': !item.time }"
				>
					<div class="state-pill-icon" :class="iconColorClass(item.key)">
						<ion-icon
							v-if="item.key === 'inbound'"
							name="arrow-undo"
						></ion-icon>
						<ion-icon
							v-else-if="item.key === 'outbound'"
							name="arrow-redo"
						></ion-icon>
						<ion-icon v-else name="hourglass-outline"></ion-icon>
					</div>
					<div class="state-pill-info">
						<small class="text-muted text-uppercase">{{ item.name }}</small>
						<strong>{{ item.time || "00:00:00" }}</strong>
					</div>
				</div>
			</div>
		</div>

		<div class="perf-section-header">
			<span class="text-label text-muted">Günlük Performansınız</span>
			<router-link to="/agent/last-call" class="perf-link">
				Son Çağrılarım
				<ion-icon name="arrow-forward-outline"></ion-icon>
			</router-link>
		</div>

		<template v-if="hasInbound || hasOutbound">
			<div class="row">
				<div v-if="hasInbound" :class="performanceColClass">
					<app-card>
						<h6 class="font-weight-bold mb-3 d-flex align-items-center">
							<span class="direction-dot text-success">
								<ion-icon name="arrow-undo"></ion-icon>
							</span>
							Gelen Arama
						</h6>
						<div class="row no-gutters stat-grid">
							<div class="col-6">
								<div class="stat-tile">
									<div class="stat-tile-icon text-success">
										<ion-icon name="call-outline"></ion-icon>
									</div>
									<div class="stat-tile-body">
										<small class="text-muted">Toplam Çağrı</small>
										<strong>
											{{ data.calls.inbound.count_talking || 0 }}
											<span
												v-if="inboundNoAnswer > 0"
												class="missed-badge"
											>
												<ion-icon name="close-circle"></ion-icon>
												{{ inboundNoAnswer }} cevapsız
											</span>
										</strong>
									</div>
								</div>
							</div>
							<div class="col-6">
								<div class="stat-tile">
									<div class="stat-tile-icon text-primary">
										<ion-icon name="mic-outline"></ion-icon>
									</div>
									<div class="stat-tile-body">
										<small class="text-muted">Toplam Konuşma</small>
										<strong>{{
											data.calls.inbound.talking_time || "00:00:00"
										}}</strong>
									</div>
								</div>
							</div>
						</div>
					</app-card>
				</div>

				<div v-if="hasOutbound" :class="performanceColClass">
					<app-card>
						<h6 class="font-weight-bold mb-3 d-flex align-items-center">
							<span class="direction-dot text-primary">
								<ion-icon name="arrow-redo"></ion-icon>
							</span>
							Giden Arama
						</h6>
						<div class="row no-gutters stat-grid">
							<div class="col-6">
								<div class="stat-tile">
									<div class="stat-tile-icon text-success">
										<ion-icon name="call-outline"></ion-icon>
									</div>
									<div class="stat-tile-body">
										<small class="text-muted">Toplam Çağrı</small>
										<strong>{{
											data.calls.outbound.count_talking || 0
										}}</strong>
									</div>
								</div>
							</div>
							<div class="col-6">
								<div class="stat-tile">
									<div class="stat-tile-icon text-primary">
										<ion-icon name="mic-outline"></ion-icon>
									</div>
									<div class="stat-tile-body">
										<small class="text-muted">Toplam Konuşma</small>
										<strong>{{
											data.calls.outbound.talking_time || "00:00:00"
										}}</strong>
									</div>
								</div>
							</div>
						</div>
					</app-card>
				</div>
			</div>
		</template>
		<template v-else>
			<app-card>
				<div class="text-center py-3">
					<app-svg
						class="col-2 mx-auto"
						src="/assets/img/vectors/statistics.svg"
					></app-svg>
					<h6 class="font-weight-bold mt-2">Bugün için çağrı bulunmuyor</h6>
					<span class="text-muted"
						>Hatta girdikçe ve arama yaptıkça çağrılarla ilgili istatistiklerinizi
						bu alanda görüntüleyebilirsiniz.</span
					>
				</div>
			</app-card>
		</template>
	</div>
</template>

<script>
export default {
	props: {
		data: {
			required: true,
		},
	},
	computed: {
		hasStates() {
			return this.data && this.data.states && this.data.states.length > 0;
		},
		sortedStates() {
			if (!this.hasStates) return [];
			const filled = this.data.states.filter((s) => s.time);
			const empty = this.data.states.filter((s) => !s.time);
			return [...filled, ...empty];
		},
		hasInbound() {
			return this.data && this.data.calls && this.data.calls.inbound;
		},
		hasOutbound() {
			return this.data && this.data.calls && this.data.calls.outbound;
		},
		inboundNoAnswer() {
			return (this.data && this.data.no_answer && this.data.no_answer.inbound) || 0;
		},
		performanceColClass() {
			return this.hasInbound && this.hasOutbound
				? "col-md-6 col-12 mb-3"
				: "col-12 mb-3";
		},
	},
	methods: {
		iconColorClass(key) {
			if (key === "inbound") return "is-inbound";
			if (key === "outbound") return "is-outbound";
			return "is-idle";
		},
	},
};
</script>

<style scoped>
.states-bar {
	padding: 0;
}
.state-row {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
	padding: 4px 4px 8px 4px;
}
.state-pill {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 10px 14px;
	background: #fff;
	border: 1px solid #e9ecef;
	border-radius: 12px;
	flex: 1 1 140px;
	min-width: 0;
	box-shadow: 0 1px 2px rgba(20, 30, 60, 0.04);
}
.state-pill.is-empty {
	opacity: 0.55;
}
.state-pill-icon {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 18px;
	flex-shrink: 0;
}
.state-pill-icon.is-inbound {
	color: #28a745;
	background: rgba(40, 167, 69, 0.1);
}
.state-pill-icon.is-outbound {
	color: #007bff;
	background: rgba(0, 123, 255, 0.1);
}
.state-pill-icon.is-idle {
	color: #f0a500;
	background: rgba(240, 165, 0, 0.12);
}
.state-pill-info {
	display: flex;
	flex-direction: column;
	line-height: 1.25;
	min-width: 0;
}
.state-pill-info small {
	font-size: 10px;
	letter-spacing: 0.5px;
	font-weight: 600;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 100%;
}
.state-pill-info strong {
	font-size: 16px;
	font-variant-numeric: tabular-nums;
	color: #2b3340;
}
.perf-section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 4px 8px 4px;
}

.direction-dot {
	width: 28px;
	height: 28px;
	border-radius: 50%;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	margin-right: 10px;
	background: rgba(40, 167, 69, 0.08);
	font-size: 14px;
}
.direction-dot.text-primary {
	background: rgba(0, 123, 255, 0.08);
}

.stat-grid {
	row-gap: 12px;
}
.stat-tile {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 12px 14px;
	border: 1px solid #ebeef2;
	border-radius: 10px;
	margin: 0 4px;
	background: #f6f7f9;
	height: 100%;
}
.stat-tile-icon {
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 16px;
	flex-shrink: 0;
}
.stat-tile-body {
	display: flex;
	flex-direction: column;
	line-height: 1.2;
	min-width: 0;
}
.stat-tile-body small {
	font-size: 11px;
	letter-spacing: 0.3px;
}
.stat-tile-body strong {
	font-size: 18px;
	font-variant-numeric: tabular-nums;
	color: #2b3340;
	display: inline-flex;
	align-items: center;
	gap: 8px;
	flex-wrap: wrap;
}

.missed-badge {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 2px 8px;
	background: rgba(220, 53, 69, 0.1);
	color: #dc3545;
	border-radius: 999px;
	font-size: 11px;
	font-weight: 600;
	letter-spacing: 0.2px;
}
.missed-badge ion-icon {
	font-size: 12px;
}

.perf-link {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	font-size: 12px;
	font-weight: 600;
	color: #6c757d;
	text-decoration: none;
	letter-spacing: 0.2px;
}
.perf-link:hover {
	color: #007bff;
}
.perf-link ion-icon {
	font-size: 14px;
}
</style>
