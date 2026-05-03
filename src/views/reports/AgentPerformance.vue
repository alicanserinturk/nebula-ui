<template>
	<app-module>
		<app-module-header> </app-module-header>
		<app-module-body>
			<app-table
				:downloadable="true"
				:selectable="true"
				:before-download="download"
				endpoint="reports/agent"
				vector="report"
				:filters="filters"
			>
				<el-table-column width="55px">
					<template slot-scope="scope">
						<span class="w-36 avatar bg-light">
							{{ scope.row.user.name[0] }}{{ scope.row.user.surname[0] }}
						</span>
					</template>
				</el-table-column>
				<el-table-column label="Kullanıcı">
					<template slot-scope="scope">
						<h6 class="mb-1">
							{{ scope.row.user.name }} {{ scope.row.user.surname }}
						</h6>
						<span class="sub-item">{{ scope.row.user.email }}</span>
					</template>
				</el-table-column>
				<el-table-column label="Gelen Arama">
					<template slot-scope="scope">
						<div class="row mr-2">
							<div class="col-auto">
								<span v-if="scope.row.calls.inbound">{{
									scope.row.calls.inbound.count_talking
								}}</span>
								<span v-else><i class="el-icon-minus"></i></span>
								<small class="sub-item text-muted d-block">Çağrı</small>
							</div>
							<div class="col-auto">
								<span v-if="scope.row.calls.inbound">{{
									scope.row.calls.inbound.talking_time
								}}</span>
								<span v-else><i class="el-icon-minus"></i></span>
								<small class="sub-item text-muted d-block">Konuşma</small>
							</div>
							<div class="col-auto">
								<span v-if="scope.row.calls.inbound">{{
									scope.row.calls.inbound.avg_talking_time.split('.')[0] ? scope.row.calls.inbound.avg_talking_time.split('.')[0] : scope.row.calls.inbound.avg_talking_time
								}}</span>
								<span v-else><i class="el-icon-minus"></i></span>
								<small class="sub-item text-muted d-block">Ortalama</small>
							</div>
						</div>
					</template>
				</el-table-column>

				<el-table-column label="Giden Arama">
					<template slot-scope="scope">
						<div class="row mr-2">
							<div class="col-auto">
								<span v-if="scope.row.calls.outbound">{{
									scope.row.calls.outbound.count_talking
								}}</span>
								<span v-else><i class="el-icon-minus"></i></span>
								<small class="sub-item text-muted d-block">Çağrı</small>
							</div>
							<div class="col-auto">
								<span v-if="scope.row.calls.outbound">{{
									scope.row.calls.outbound.talking_time
								}}</span>
								<span v-else><i class="el-icon-minus"></i></span>
								<small class="sub-item text-muted d-block">Konuşma</small>
							</div>
							<div class="col-auto">
								<span v-if="scope.row.calls.outbound">{{
									scope.row.calls.outbound.avg_talking_time.split('.')[0] ? scope.row.calls.outbound.avg_talking_time.split('.')[0] : scope.row.calls.outbound.avg_talking_time
								}}</span>
								<span v-else><i class="el-icon-minus"></i></span>
								<small class="sub-item text-muted d-block">Ortalama</small>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column type="expand">
					<template slot-scope="scope">
						<AgentPerformanceGraphs :data="scope.row" :row="scope.row"></AgentPerformanceGraphs>	
					</template>
				</el-table-column>
			</app-table>
		</app-module-body>
	</app-module>
</template>
<script>
import AgentPerformanceGraphs from "./AgentPerformanceGraphs.vue";
import moment from 'moment';

export default {
	components:{
		AgentPerformanceGraphs
	},
	data() {
		return {
			
			filters: {
				date: {
					name: "Tarih Aralığı",
					type: "daterange",
					value: [moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")],
					options: [],
				},
				queue_id: {
					name: "Arama Grubu",
					type: "queue",
					value: null,
					options: [],
				},
				number_id: {
					name: "Numara",
					type: "number",
					value: null,
					options: [],
				},
			},
		};
	},
	created() {
		
	},
	methods: {
		download(data){
			let arr = [];
			data.forEach((item) => {
				let cache = {};
				
				cache.id = item.user.id ? item.user.id : "";
				cache.name = item.user.name ? item.user.name : "";
				cache.email = item.user.email ? item.user.email : "";
				cache.inbound_avg_ringing_time = item.calls.inbound ? item.calls.inbound.avg_ringing_time : "";
				cache.inbound_avg_talking_time = item.calls.inbound ? item.calls.inbound.avg_talking_time : "";
				cache.inbound_count_talking = item.calls.inbound ? item.calls.inbound.count_talking : "";
				cache.inbound_max_talking_time = item.calls.inbound ? item.calls.inbound.max_talking_time : "";
				cache.inbound_min_talking_time = item.calls.inbound ? item.calls.inbound.min_talking_time : "";
				cache.inbound_ringing_time = item.calls.inbound ? item.calls.inbound.ringing_time : "";
				cache.inbound_talking_time = item.calls.inbound ? item.calls.inbound.talking_time : "";
				cache.inbound_no_answer = item.no_answer.inbound ? item.no_answer.inbound : "";
				cache.outbound_avg_ringing_time = item.calls.outbound ? item.calls.outbound.avg_ringing_time : "";
				cache.outbound_avg_talking_time = item.calls.outbound ? item.calls.outbound.avg_talking_time : "";
				cache.outbound_count_talking = item.calls.outbound ? item.calls.outbound.count_talking : "";
				cache.outbound_max_talking_time = item.calls.outbound ? item.calls.outbound.max_talking_time : "";
				cache.outbound_min_talking_time = item.calls.outbound ? item.calls.outbound.min_talking_time : "";
				cache.outbound_ringing_time = item.calls.outbound ? item.calls.outbound.ringing_time : "";
				cache.outbound_talking_time = item.calls.outbound ? item.calls.outbound.talking_time : "";
				cache.outbound_no_answer = item.no_answer.outbound ? item.no_answer.outbound : "";

				item.states.forEach((item) => {
					cache['state_' + item.key] = item.time;
				});
				
				arr.push(cache);
			});
			console.log("Arr",arr)
			return arr;
		}
	},
};
</script>
<style>
.over {
	width: 100%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
