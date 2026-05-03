<template>
	<app-module>
		<div class="pt-3 pb-3">
			<h5 class="font-weight-bold mb-0">Hoş Geldin {{currentUser.name}}</h5>
			<small>Genel Durum</small>
		</div>
		<app-module-body>
			<div>
                 <CallReportByDate v-if="$api.has('inbound_report')"></CallReportByDate>
				<div class="row row-md">
					<!--<div class="col-md-4">
                        <div class="card">
                            <div class="card-body">
                                <div class="mb-1">
                                    <span class="h3">765 <span class="text-muted text-sm">{{$t('view.starter.remaining_time')}}</span></span>
                                    <div class="text-muted mt-2 text-sm">{{$t('view.starter.total_time')}}</div>
                                    <div>
                                        <span class="text-success">1000 {{$t('view.starter.minute')}}</span>
                                    </div>
                                </div>
                               &lt;!&ndash; <button class="btn btn-sm w-100 btn-rounded btn-primary text-align-auto i-con-h-a mb-1">
                                    <i class="i-con i-con-arrow-right float-right"><i></i></i> {{$t('view.starter.buy_time')}}
                                </button>&ndash;&gt;
                            </div>
                            &lt;!&ndash;<div class="card-body b-t">
                                <div class="row no-gutters">
                                    <div class="col"><small class="text-muted">{{$t('view.starter.inbound')}}: 75%</small>
                                        <div class="progress my-2" style="height:3px">
                                            <div class="progress-bar bg-primary" style="width: 45%"></div>
                                        </div>
                                    </div>
                                    <div class="col"><small class="text-muted">{{$t('view.starter.outbound')}}: 25%</small>
                                        <div class="progress my-2" style="height:3px">
                                            <div class="progress-bar bg-warning" style="width: 35%"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>&ndash;&gt;
                        </div>
                        <div class="card">
                            <div class="card-body">
                                <div class="mb-1">
                                    <span class="h3">17 <span class="text-muted text-sm">{{$t('view.starter.remaining_user')}}</span></span>
                                    <div class="text-muted mt-2 text-sm">{{$t('view.starter.total_user')}}</div>
                                    <div>
                                        <span class="text-success">50 {{$t('view.starter.user')}}</span>
                                    </div>
                                </div>
                               &lt;!&ndash; <button class="btn btn-sm w-100 btn-rounded btn-dark text-align-auto i-con-h-a mb-1">
                                    <i class="i-con i-con-arrow-right float-right"><i></i></i> {{$t('view.starter.buy_user')}}
                                </button>&ndash;&gt;
                            </div>
                        </div>
                    </div>-->
                    <div class="col-md-12">
                        <AgentBoard></AgentBoard>
                    </div>
					<div class="col-md-12">
						<el-dialog
							:append-to-body="true"
							:title="announcement.title"
							:visible.sync="modalAnnouncementVisible"
						>
							<div v-html="announcement.description"></div>
						</el-dialog>
						<div class="row row-md">
							<div class="col-md-12">
								<app-card :title="$t('view.starter.announcements')" :remove-body-padding="true">
										<div class="px-3">
										<table class="table table-theme v-middle m-0" v-if="announcements.length > 0">
											<thead class="text-muted">
												<tr>
													<th>{{ $t("view.starter.announcement") }}</th>
													<th width="50px"></th>
													<th width="120px">{{ $t("view.starter.date") }}</th>
												</tr>
											</thead>
											<tbody>
												<tr
													@click="showAnnouncement(item)"
													v-for="item in announcements"
													class="v-middle pointer"
												>
													<td class="flex">
														{{ item.title }}
													</td>
													<td>
														<span v-if="item.is_pinned"
															><i class="el-icon-place"></i
														></span>
													</td>
													<td>
														<app-date-text
															:text="item.created_at"
														></app-date-text>
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
						</div>
					</div>
				</div>
				
               
			</div>
		</app-module-body>
	</app-module>
</template>
<script>
import CallReportByDate from "./CallReportByDate";
import AgentBoard from "./AgentBoard";
import { mapGetters } from 'vuex';

export default {
	components: {
		CallReportByDate,
		AgentBoard,
	},
	data() {
		return {
			modalAnnouncementVisible: false,
			announcement: {},
			announcements: [],
            items: {}
		};
	},
	computed:{
		...mapGetters(['currentUser']),
	},
	created() {
		this.$api.get("dashboard/announcements", {}, (response) => {
			this.announcements = response.data.data;
		});
       
	},
	methods: {
		showAnnouncement(item) {
			this.announcement = item;
			this.modalAnnouncementVisible = true;
		},
	},
};
</script>
