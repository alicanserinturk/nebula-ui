<template>
	<el-dialog
		v-if="visible"
		:visible.sync="visible"
		custom-class="app-modal app-modal-preferences"
		:append-to-body="true"
	>
		<template slot="title">
			<h5 class="mb-0 py-3 font-weight-bold">
				<ion-icon class="mr-1" name="settings-outline"></ion-icon> Ayarlar
			</h5>
		</template>
		<div class="row no-gutters">
			<div class="col-4 col-100 b-r">
				<div class="sidenav h-100 hv">
					<div class="flex scrollable hover">
						<div class="nav-border b-primary" data-nav="">
							<ul class="nav pt-3">
								<li class="nav-header">
									<span class="text-xs hidden-folded">Tüm Tercihler</span>
								</li>
								<li :class="{ active: activeTab === 'account' }">
									<a href="javascript:" @click="activeTab = 'account'"
										><span class="nav-icon"
											><ion-icon name="person-outline"></ion-icon></span
										><span class="nav-text">Hesap Bilgileri</span></a
									>
								</li>
								<li :class="{ active: activeTab === 'design' }">
									<a href="javascript:" @click="activeTab = 'design'"
										><span class="nav-icon"
											><ion-icon name="color-palette-outline"></ion-icon></span
										><span class="nav-text">Arayüz</span></a
									>
								</li>
								<li :class="{ active: activeTab === 'favorites' }">
									<a href="javascript:" @click="activeTab = 'favorites'"
										><span class="nav-icon"
											><ion-icon name="star-outline"></ion-icon></span
										><span class="nav-text">Favoriler</span></a
									>
								</li>
								<li :class="{ active: activeTab === 'phone' }">
									<a href="javascript:" @click="activeTab = 'phone'"
										><span class="nav-icon"
											><ion-icon name="call-outline"></ion-icon></span
										><span class="nav-text">Telefon</span></a
									>
								</li>
								<li :class="{ active: activeTab === 'notification' }">
									<a href="javascript:" @click="activeTab = 'notification'"
										><span class="nav-icon"
											><ion-icon name="notifications-outline"></ion-icon></span
										><span class="nav-text">Bildirim</span></a
									>
								</li>
								<li :class="{ active: activeTab === 'location' }">
									<a href="javascript:" @click="activeTab = 'location'"
										><span class="nav-icon"
											><ion-icon name="globe-outline"></ion-icon></span
										><span class="nav-text">Bölge ve Dil</span></a
									>
								</li>

								<li :class="{ active: activeTab === 'permission' }">
									<a href="javascript:" @click="activeTab = 'permission'"
										><span class="nav-icon"
											><ion-icon name="key-outline"></ion-icon></span
										><span class="nav-text">İzinler</span></a
									>
								</li>
								<li class="nav-header">
									<span class="text-xs hidden-folded"
										>Görüşlerinizi Bildirin</span
									>
								</li>
								<li :class="{ active: activeTab === 'feedback' }">
									<a href="javascript:" @click="activeTab = 'feedback'"
										><span class="nav-icon"
											><ion-icon name="happy-outline"></ion-icon></span
										><span class="nav-text">Geri Bildirim</span></a
									>
								</li>
							</ul>
						</div>
					</div>
					<div class="py-2 mt-2 b-t no-shrink">
						<ul class="nav no-border">
							<li>
								<a href="#"
									><span class="nav-icon"
										><ion-icon name="log-out-outline"></ion-icon> </span
									><span class="nav-text" @click="logout"
										>Oturumu Kapat</span
									></a
								>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="col-8 col-100">
				<div class="px-4 pt-1 pb-3 d-block">
					<div class="row">
						<div class="col pb-2">
							<h5 class="mb-2 mt-4 font-weight-bold">{{ $t(activeTab) }}</h5>
							<small class="d-block">{{
								$t(activeTab + "_description")
							}}</small>
						</div>
						<div class="col-auto">
							<app-svg
								style="width: 140px;"
								:src="'/assets/img/vectors/settings-' + activeTab + '.svg'"
							></app-svg>
						</div>
					</div>
				</div>

				<div class="settings-tab" v-if="activeTab === 'account'">
					<app-accordion>
						<template slot="header">
							<app-list-item>
								<template slot="label">
									<div>
										<span
											class="avatar w-36 bg-secondary"
											v-if="currentUser.settings.avatar.type === 'text'"
											:style="
												'background:' +
													currentUser.settings.avatar.parameter +
													' !important;'
											"
											>{{ currentUser.name[0]
											}}{{ currentUser.surname[0] }}</span
										>
										<span class="avatar w-36 bg-secondary" v-else
											><img
												:src="
													'/assets/img/vectors/avatars/avatar' +
														currentUser.settings.avatar.parameter +
														'.svg'
												"
												alt=""
										/></span>
									</div>
									<div class="mx-3 d-none d-md-block">
										<strong
											>{{ currentUser.name }} {{ currentUser.surname }}</strong
										>
										<div class="text-sm text-muted">
											{{ currentUser.email }}
										</div>
									</div>
								</template>
							</app-list-item>
						</template>
						<app-form-row label="Adınız">
							<el-input size="medium" v-model="currentUser.name"></el-input>
						</app-form-row>
						<app-form-row label="Soyadınız">
							<el-input size="medium" v-model="currentUser.surname"></el-input>
						</app-form-row>
						<app-form-row label="E-posta Adresiniz">
							<el-input size="medium" v-model="currentUser.email"></el-input>
						</app-form-row>
						<div class="d-block text-right pt-2">
							<el-button
								type="primary"
								size="small"
								class="mr-2"
								@click="updateProfileDetails"
								:disabled="loading"
							>
								Kaydet <i class="el-icon-loading ml-2" v-if="loading"></i>
							</el-button>
						</div>
					</app-accordion>
					<app-list-action
						label="Avatar"
						icon="contrast-outline"
						description="Hesabınızı özelleştirin ve sizi yansıtan bir avatar seçin."
					>
						<el-popover
							placement="bottom"
							width="400"
							popper-class="app-avatar-popper"
							trigger="click"
						>
							<div class="row row-sm">
								<div
									class="col-2 mb-3"
									@click="setAvatar('text', avatar.background)"
									v-for="(avatar, index) in avatars"
									:key="'avatar-text-' + index"
								>
									<span
										v-if="avatar.type === 'text'"
										class="avatar pointer"
										:style="
											'width: 50px; height: 50px;background:' +
												avatar.background +
												';color:' +
												avatar.color +
												';'
										"
										>SS</span
									>
								</div>
								<div
									class="col-2 mb-3"
									@click="setAvatar('vector', avatar + 1)"
									v-for="avatar in 90"
									:key="'avatar-vector-' + avatar"
								>
									<span
										class="avatar pointer"
										:style="'width: 50px; height: 50px;'"
										><img
											:src="
												'/assets/img/vectors/avatars/avatar' +
													(avatar + 1) +
													'.svg'
											"
											alt=""
									/></span>
								</div>
							</div>
							<el-button size="small" slot="reference"
								>Avatarı Değiştir</el-button
							>
						</el-popover>
					</app-list-action>
					<app-accordion>
						<app-warning></app-warning>
						<template slot="header">
							<app-list-item
								label="Şiferyi Değiştir"
								icon="lock-closed-outline"
							></app-list-item>
						</template>
						<app-form-row
							label="Şifreniz"
							description="Lütfen güncel şifrenizi girin"
						>
							<el-input
								v-model="passwordChangeForm.password"
								prefix-icon="el-icon-lock"
								size="medium"
								type="password"
								show-password
							></el-input>
						</app-form-row>
						<app-form-row
							label="Yeni Şifresiniz"
							description="Yeni şifreniz eski şifrelerinizden biriyle aynı olmamalı."
						>
							<app-form-password-input
								v-model="passwordChangeForm.new_password"
							></app-form-password-input>
						</app-form-row>
						<app-form-row label="Şifrenizi Onaylayın">
							<el-input
								v-model="passwordChangeForm.new_password_repeat"
								prefix-icon="el-icon-lock"
								size="medium"
								type="password"
								show-password
							></el-input>
						</app-form-row>
						<el-button type="primary" size="small" @click="changePassword"
							>Değiştir</el-button
						>
					</app-accordion>
				</div>

				<div class="settings-tab" v-if="activeTab === 'password'">
					<div class="">
						<h6 class="mb-3">Şifre</h6>
						<div class="mt-2"></div>
						<div class="text-right">
							<button class="btn btn-primary i-con-h-a d-block">
								Şifremi Değiştir
							</button>
						</div>
					</div>
				</div>

				<div class="settings-tab" v-if="activeTab === 'design'">
					<app-list-action label="Öne Çıkan Renk" icon="color-fill-outline">
						<div class="row row-xs">
							<div class="col" v-for="(color, index) in colors" :key="index">
								<span
									class="avatar w-24 bg-light pointer"
									@click="setColor(color)"
									:style="'background:' + color + ' !important;'"
								></span>
							</div>
						</div>
					</app-list-action>
					<app-list-action
						label="Koyu Mod"
						icon="contrast-outline"
						description="Koyu mod gözlerinizi daha az yorar ve odaklanmanıza yardım olur."
					>
						<el-switch
							v-model="currentUser.settings['interface_dark_mode']"
							@input="updateCurrentUser"
						></el-switch>
					</app-list-action>
					<app-list-action
						label="Boyut"
						icon="resize-outline"
						description="Uygulama boyutunu ekranınıza göre belirleyebilirsiniz."
					>
						<el-input-number
							size="small"
							v-model="currentUser.settings['interface_zoom']"
							:min="85"
							:max="115"
							:step="5"
						></el-input-number>
					</app-list-action>
				</div>

				<div class="settings-tab" v-if="activeTab === 'location'">
					<app-list-action
						label="Dil"
						icon="language-outline"
						description="Varsayılan olarak tarayıcı dili algılanır."
					>
						<el-select
							size="small"
							v-model="currentUser.settings['interface_language']"
							@change="setLang"
						>
							<el-option value="tr" label="Türkçe">Türkçe</el-option>
							<el-option value="en" label="English">English</el-option>
						</el-select>
					</app-list-action>
					<app-list-action
						label="Konum"
						icon="globe-outline"
						description="Konumunuzu doğru belirtmeniz raporlarda göreceğiniz saatlerin en doğru biçimde sunulmasını sağlar."
					>
						<el-select
							v-model="currentUser.settings['interface_location']"
							size="small"
							filterable
							@input="updateCurrentUser"
						>
							<el-option
								:key="key"
								v-for="(timezone, key) in timezones"
								:value="timezone.value"
								:label="timezone.text"
								>{{ timezone.text }}</el-option
							>
						</el-select>
					</app-list-action>
				</div>

				<div class="settings-tab" v-if="activeTab === 'favorites'">
					
					<div class="text-center px-5 py-4 b-t" v-if="currentUser.settings.favorites.length === 0">
						<h5 class="font-weight-bold">Favoriniz bulunmuyor</h5>
						<span class="d-block">Favorilerinize eklemek istediğiniz sayfadayken sol alt tarafta bulunan yıldız simgesiniz tıklayabilirsiniz.</span>
					</div>
					<div v-else>
						<app-list-action
						label="Favorileri Temizle"
						icon="star-outline"
						description="Tüm favorilerinizi tek bir tuşla temizleyebilirsiniz."
					>
						<button class="btn btn-light btn-sm btn-rounded" @click="clearFavorites">Favorileri Temizle <ion-icon name="trash-outline" class="ml-1"></ion-icon></button>
					</app-list-action>
						<draggable v-model="currentUser.settings.favorites" group="favorites">
						<app-list-action
							v-for="(item, index) in currentUser.settings.favorites"
							:key="'fav-' + index"
							:label="item.title"
							:icon="item.type === 'internal' ? item.icon : 'link-outline'"
							:description="item.type !== 'internal' ? item.url : false"
						>
							<div style="width:120px">
								<el-popover
									placement="right"
									width="350"
									trigger="click"
								>
									<div class="p-2 pt-0">
										<template>
											<app-form-row label="Bağlantı Türü">
												<el-radio-group v-model="item.type" size="small">
													<el-radio label="internal" border
														>Dahili Bağlantı</el-radio
													>
													<el-radio label="external" border
														>Harici Bağlantı</el-radio
													>
												</el-radio-group>
											</app-form-row>
											<app-form-row label="Bağlatı">
												<el-input
													v-if="item.type === 'internal'"
													size="small"
													v-model="item.url"
												></el-input>
												<el-input
													v-else
													size="small"
													v-model="item.url"
													@change="setName(0)"
												>
													<template slot="suffix">
														<img
															class="el-input__image"
															:src="getFavicon(item.url)"
															alt=""
														/>
													</template>
												</el-input>
											</app-form-row>
											<app-form-row label="Başlık">
												<el-input v-model="item.title" size="small"></el-input>
											</app-form-row>
											<app-form-row
												v-if="item.type === 'internal'"
												label="Icon"
											>
												<app-form-icon-input
													v-model="item.icon"
												></app-form-icon-input>
											</app-form-row>
											<app-form-row
												v-if="item.type === 'internal'"
												label="Yeni Sekmede Aç"
											>
												<el-switch size="small"></el-switch>
											</app-form-row>
										</template>
									</div>
									<div class="text-right mt-1">
										<el-button
											type="text"
											size="mini"
											class="mr-1"
											@click=""
											>Vazgeç
										</el-button>
										<el-button
											type="primary"
											size="mini"
											@click=""
											>Kaydet</el-button
										>
									</div>
									<button
										slot="reference"
										class="btn btn-white btn-icon btn-rounded mr-1"
									>
										<ion-icon name="create-outline"></ion-icon>
									</button>
								</el-popover>

								<button class="btn btn-white btn-icon btn-rounded mr-1">
									<ion-icon name="trash-outline"></ion-icon>
								</button>
								<button class="btn btn-white btn-icon btn-rounded">
									<ion-icon name="menu-outline"></ion-icon>
								</button>
							</div>
						</app-list-action>
					</draggable>
					<div class="px-4">
						<small
							>Favorilerinizi sürükleyip bırakarak sıralayabilirsiniz.</small
						>
					</div>
					</div>
					
				</div>
				<div class="settings-tab" v-if="activeTab === 'phone'">
					<app-list-action
						label="Ses Giriş Aygıtı"
						icon="mic-outline"
						description="Görüşmelerinizde kullandığınız mikrofonu belirleyebilirsiniz."
					>
						<el-select style="width:200px" size="medium">
							<el-option
								v-for="item in devices.audioInputs"
								:value="item.deviceId"
								:key="item.deviceId"
								:label="item.label"
								>{{ item.label }}
							</el-option>
						</el-select>
					</app-list-action>
					<app-list-action
						label="Ses Çıkış Aygıtı"
						icon="volume-high-outline"
						description="Görüşmelerinizde kullandığınız mikrofonunuzu belirleyebilirsiniz."
					>
						<el-select style="width:200px" size="medium">
							<el-option
								v-for="item in devices.audioOutputs"
								:value="item.deviceId"
								:key="item.deviceId"
								:label="item.label"
								>{{ item.label }}
							</el-option>
						</el-select>
					</app-list-action>
					<div class="pl-4 py-3 mb-0  mt-3 b-t">
						<span class="font-weight-bold">Diğer</span>
					</div>

					<app-list-action
						label="Varsayılan Dış Arama Numarası"
						icon="call-outline"
						description="Dış aramalarınızda kullanacağınız varsayılan numaranızı belirleyebilirsiniz."
					>
						<el-select
							style="width:200px"
							v-model="currentUser.settings.sip.default_number"
							size="medium"
							@input="updateCurrentUser"
						>
							<el-option :value="null" label="Hatta girdiğimde sor"
								>Hatta girdiğimde sor</el-option
							>
							<el-option
								v-for="item in currentUser.numbers"
								:value="item.id"
								:key="item.id"
								:label="item.number"
								>{{ item.number }}
							</el-option>
						</el-select>
					</app-list-action>
					<app-list-action
						label="Varsayılan Hat Durumu"
						icon="menu-outline"
						description="Gelen arama, giden arama ya da mola durumunuzu belirleyip hatta girdiğinizde varsayılan olarak hat durumunuzu aktifleştirebilirsiniz."
					>
						<el-select
							style="width:200px"
							v-model="currentUser.settings.sip.default_state"
							size="medium"
							@input="updateCurrentUser"
						>
							<el-option :value="null" label="Hatta girdiğimde sor"
								>Hatta girdiğimde sor</el-option
							>
							<el-option
								v-for="item in currentUser.states"
								:value="item.id"
								:key="item.id"
								:label="item.name"
								>{{ item.name }}
							</el-option>
						</el-select>
					</app-list-action>
					<app-list-action
						icon="newspaper-outline"
						label="Otomatik CRM"
						description="Çağrı geldiğinde CRM penceresini otomatik olarak açmanıza yardımcı olur."
					>
						<el-switch
							v-model="currentUser.settings.sip.auto_crm"
							size="mini"
							@input="updateCurrentUser"
						></el-switch>
					</app-list-action>
					<app-list-action
						icon="keypad-outline"
						label="Tuşlayarak Giriş"
						description="Numaraları tuşlayarak da girebileceğin pencereyi aktif eder."
					>
						<el-switch
							v-model="currentUser.settings.sip.pad"
							size="mini"
							@input="updateCurrentUser"
						></el-switch>
					</app-list-action>
				</div>

				<div class="settings-tab" v-if="activeTab === 'notification'">
					<app-list-action
						label="Bildirimler"
						:icon="
							currentUser.settings['notifications']
								? 'notifications-outline'
								: 'notifications-off-outline'
						"
					>
						<el-switch
							v-model="currentUser.settings['notifications']"
							@input="updateCurrentUser"
						></el-switch>
					</app-list-action>
					<app-list-action
						:disabled="!currentUser.settings['notifications']"
						label="Çevrimiçi Bildirimi"
						icon="eye-outline"
						description="Takım arkadaşlarınızdan biri çevirimiçi olduğunda bildirilir."
					>
						<el-switch
							v-model="currentUser.settings['notifications_online']"
							@input="updateCurrentUser"
						></el-switch>
					</app-list-action>
					<app-list-action
						:disabled="!currentUser.settings['notifications']"
						label="Sohbet Bildirimleri"
						icon="eye-outline"
						description="Yeni bir mesaj aldığınızda bildirilir."
					>
						<el-switch
							v-model="currentUser.settings['notifications_chat']"
							@input="updateCurrentUser"
						></el-switch>
					</app-list-action>
					<app-list-action
						:disabled="!currentUser.settings['notifications']"
						label="Diğer"
						icon="eye-outline"
					>
						<el-switch
							v-model="currentUser.settings['notifications_other']"
							@input="updateCurrentUser"
						></el-switch>
					</app-list-action>
				</div>

				<div class="settings-tab" v-if="activeTab === 'permission'">
					<app-list-action
						description="Telefonla görüşme yapabilmek için mikrofon erişimine izin vermeniz gerekiyor."
						label="Mikrofon Erişimi"
						:icon="
							permissions.microphone === 'granted'
								? 'mic-circle-outline'
								: 'mic-off-circle-outline'
						"
					>
						<el-button
							type="primary"
							v-if="permissions.microphone === 'prompt'"
							size="small"
							@click="getMicrophonePermission"
							><i class="el-icon-microphone"></i> Mikrofon Erişimine İzin
							Ver</el-button
						>
						<el-button
							type="danger"
							v-else-if="permissions.microphone === 'denied'"
							size="small"
							:disabled="true"
							><i class="el-icon-circle-close"></i> Engellendi</el-button
						>
						<el-button
							type="primary"
							v-else-if="permissions.microphone === 'granted'"
							size="small"
							:disabled="true"
							><i class="el-icon-circle-check"></i> İzin Verildi</el-button
						>
					</app-list-action>
					<app-list-action
						description="Bildirimlerinizi uygulama sekme durumundayken de gönderebilmemiz için bildirim erişimine izin vermeniz gerekiyor."
						label="Bildirim Erişimi"
						:icon="
							permissions.notification === 'granted'
								? 'notifications-circle-outline'
								: 'notifications-off-circle-outline'
						"
					>
						<el-button
							type="primary"
							v-if="permissions.notification === 'prompt'"
							size="small"
							@click="getNotificationsPermission"
							><i class="el-icon-bell"></i> Bildirim Erişimine İzin
							Ver</el-button
						>
						<el-button
							type="danger"
							v-else-if="permissions.notification === 'denied'"
							size="small"
							:disabled="true"
							><i class="el-icon-circle-close"></i> Engellendi</el-button
						>
						<el-button
							type="primary"
							v-else-if="permissions.notification === 'granted'"
							size="small"
							:disabled="true"
							><i class="el-icon-circle-check"></i> İzin Verildi</el-button
						>
					</app-list-action>
				</div>

				<div class="settings-tab p-4 b-t" v-if="activeTab === 'feedback'">
					<app-form-row label="Konu">
						<el-radio-group v-model="feedback.type" size="medium">
							<el-radio value="Idea" label="Idea">Görüş</el-radio>
							<el-radio value="Bug" label="Bug">Hata Bildirimi</el-radio>
							<el-radio value="Other" label="Other">Diğer</el-radio>
						</el-radio-group>
					</app-form-row>
					<app-form-row
						label="Mesajınız"
						description="Lütfen detaylı olarak bilgilendirin."
					>
						<el-input
							type="textarea"
							v-model="feedback.comment"
							:rows="6"
						></el-input>
					</app-form-row>
					<el-button type="primary" size="small" @click="saveFeedback"
						>Gönder</el-button
					>
				</div>
			</div>
		</div>
	</el-dialog>
</template>
<script>
import EventBus from "@/utils/EventBus";
import { mapActions, mapGetters } from "vuex";
import draggable from "vuedraggable";

export default {
	components: {
		draggable,
	},
	data() {
		return {
			visible: false,
			activeTab: "account",
			menus: {},
			feedback: { comment: "", type: "Idea" },
			devices: {
				audioInputs: [],
				audioOutputs: [],
			},
			colors: [
				"#181a1d",
				"#007AFF",
				"#237ab3",
				"#652eb3",
				"#b32ea1",
				"#b32e2e",
				"#51b32e",
				"#ca4c26",
				"#5066e0",
			],
			timezones: [
				{
					value: -12,
					text: "(GMT -12:00) Eniwetok, Kwajalein",
				},
				{
					value: -11,
					text: "(GMT -11:00) Midway Island, Samoa",
				},
				{
					value: -10,
					text: "(GMT -10:00) Hawaii",
				},
				{
					value: -9,
					text: "(GMT -9:00) Alaska",
				},
				{
					value: -8,
					text: "(GMT -8:00) Pacific Time (US & Canada)",
				},
				{
					value: -7,
					text: "(GMT -7:00) Mountain Time (US & Canada)",
				},
				{
					value: -6,
					text: "(GMT -6:00) Central Time (US & Canada), Mexico City",
				},
				{
					value: -5,
					text: "(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima",
				},
				{
					value: -4,
					text: "(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz",
				},
				{
					value: -3.5,
					text: "(GMT -3:30) Newfoundland",
				},
				{
					value: -3,
					text: "(GMT -3:00) Brazil, Buenos Aires, Georgetown",
				},
				{
					value: -2,
					text: "(GMT -2:00) Mid-Atlantic",
				},
				{
					value: -1,
					text: "(GMT -1:00) Azores, Cape Verde Islands",
				},
				{
					value: 0,
					text: "(GMT) Western Europe Time, London, Lisbon, Casablanca",
				},
				{
					value: 1,
					text: "(GMT +1:00) Brussels, Copenhagen, Madrid, Paris",
				},
				{
					value: 2,
					text: "(GMT +2:00) Kaliningrad, South Africa",
				},
				{
					value: 3,
					text: "(GMT +3:00) İstanbul, Baghdad, Riyadh, Moscow, St. Petersburg",
				},
				{
					value: 3.5,
					text: "(GMT +3:30) Tehran",
				},
				{
					value: 4,
					text: "(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi",
				},
				{
					value: 4.5,
					text: "(GMT +4:30) Kabul",
				},
				{
					value: 5,
					text: "(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent",
				},
				{
					value: 5.5,
					text: "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi",
				},
				{
					value: 5.75,
					text: "(GMT +5:45) Kathmandu",
				},
				{
					value: 6,
					text: "(GMT +6:00) Almaty, Dhaka, Colombo",
				},
				{
					value: 7,
					text: "(GMT +7:00) Bangkok, Hanoi, Jakarta",
				},
				{
					value: 8,
					text: "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong",
				},
				{
					value: 9,
					text: "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk",
				},
				{
					value: 9.5,
					text: "(GMT +9:30) Adelaide, Darwin",
				},
				{
					value: 10,
					text: "(GMT +10:00) Eastern Australia, Guam, Vladivostok",
				},
				{
					value: 11,
					text: "(GMT +11:00) Magadan, Solomon Islands, New Caledonia",
				},
				{
					value: 12,
					text: "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka",
				},
			],
			avatars: [
				{ type: "text", background: "#2b3035", color: "#FFF", key: "" },
				{ type: "text", background: "#6b6b6b", color: "#FFF", key: "" },
				{ type: "text", background: "#f44336", color: "#FFF", key: "" },
				{ type: "text", background: "#e91e63", color: "#FFF", key: "" },
				{ type: "text", background: "#9c27b0", color: "#FFF", key: "" },
				{ type: "text", background: "#673ab7", color: "#FFF", key: "" },
				{ type: "text", background: "#3f51b5", color: "#FFF", key: "" },
				{ type: "text", background: "#2196f3", color: "#FFF", key: "" },
				{ type: "text", background: "#03a9f4", color: "#FFF", key: "" },
				{ type: "text", background: "#00bcd4", color: "#FFF", key: "" },
				{ type: "text", background: "#009688", color: "#FFF", key: "" },
				{ type: "text", background: "#4caf50", color: "#FFF", key: "" },
			],
			passwordChangeForm: {
				password: "",
				new_password_repeat: "",
				new_password: "",
			},
			profileDetailForm: {
				name: "",
				surname: "",
				email: "",
			},
		};
	},
	computed: {
		...mapGetters(["currentUser", "loading", "permissions"]),
	},
	created() {
		// Listens
		EventBus.$on("openPreferences", (activeTab = false) => {
			this.visible = true;
			if (activeTab) this.activeTab = activeTab;
		});
		EventBus.$on("closePreferences", () => {
			this.visible = false;
		});
		// Set Variables
		this.profileDetailForm = {
			name: this.currentUser.name,
			surname: this.currentUser.surname,
			email: this.currentUser.email,
		};
		this.getDevices();
	},
	beforeDestroy() {
		EventBus.$off("openPreferences");
		EventBus.$off("closePreferences");
	},
	methods: {
		...mapActions(["updateCurrentUser"]),
		clearFavorites(){
			this.currentUser.settings.favorites = [];
			this.updateSettings();
		},
		updateSettings() {
			this.updateCurrentUser();
			this.$message.success("Kaydedildi.");
		},
		updateProfileDetails() {
			this.currentUser.name = this.profileDetailForm.name;
			this.currentUser.surname = this.profileDetailForm.surname;
			this.currentUser.email = this.profileDetailForm.email;
			this.updateSettings();
		},
		changePassword() {
			this.$api.patch(
				"profile/change-password",
				this.passwordChangeForm,
				(response) => {
					this.passwordChangeForm.password = "";
					this.passwordChangeForm.new_password_repeat = "";
					this.passwordChangeForm.new_password = "";
					this.passwordResetModalVisible = false;
					this.$message.success("Şifreniz güncellendi.");
				}
			);
		},
		setColor(color) {
			this.currentUser.settings["interface_primary_color"] = color;
			this.updateSettings();
		},
		setAvatar(type, parameter) {
			this.currentUser.settings["avatar"] = {
				type,
				parameter,
			};
			this.updateSettings();
		},
		getMicrophonePermission() {
			navigator.mediaDevices.getUserMedia({ audio: true });
		},
		getNotificationsPermission() {
			Notification.requestPermission();
		},
		setLang() {
			this.$i18n.locale = this.currentUser.settings["interface_language"];
			this.updateSettings();
		},
		saveFeedback() {
			let color = null;
			if (this.feedback.type === "Bug") {
				color = "danger";
			} else if (this.feedback.type === "Idea") {
				color = "#007AFF";
			} else if (this.feedback.type === "Other") {
				color = "#444444";
			}
			this.$api.post(
				"feedback",
				{
					comment: this.feedback.comment,
					type: this.feedback.type,
					color: color,
				},
				() => {
					this.feedback.comment = "";
					this.feedback.type = "Idea";
					this.$message.success("Geri bildiriminiz gönderildi.");
				}
			);
		},
		logout() {
			EventBus.$emit("logout");
		},
		getFavicon(url) {
			return "https://s2.googleusercontent.com/s2/favicons?domain_url=" + url;
		},
		getDevices(list) {
			navigator.mediaDevices
				.enumerateDevices()
				.then((list) => {
					console.log(list);
					list.forEach((item) => {
						if (item.kind === "audioinput") {
							this.devices.audioInputs.push(item);
						} else if (item.kind === "audiooutput") {
							this.devices.audioOutputs.push(item);
						}
					});
				})
				.catch((error) => {
					console.log(error);
				});
		},
		setDevice(element, sinkId) {
			if (typeof element.sinkId !== "undefined") {
				element
					.setSinkId(sinkId)
					.then(() => {
						console.log(`Success, audio output device attached: ${sinkId}`);
					})
					.catch((error) => {
						let errorMessage = error;
						if (error.name === "SecurityError") {
							errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
						}
						console.error(errorMessage);
						// Jump back to first output device in the list as it's the default.
						audioOutputSelect.selectedIndex = 0;
					});
			} else {
				console.warn("Browser does not support output device selection.");
			}
		},
	},
	i18n: {
		messages: {
			tr: {
				account: "Hesap Bilgileri",
				design: "Arayüz",
				location: "Bölge ve Dil",
				phone: "Telefon",
				permission: "İzinler",
				notification: "Bildirimler",
				feedback: "Geri Bildirim",
				favorites: "Favoriler",
				account_description:
					"Kişisel bilgilerinizi ve şifrelerinizi değiştirebilir, sizi yansıtan bir avatar belirleyebilirsiniz.",
				design_description:
					"Arayüzü alışkanlıklarınıza göre özelleştirerek daha fazla odaklanabilirsiniz.",
				location_description:
					"Konumunuzu belirlemek sistem saatlerini doğru görmenize yardımcı olacaktır.",
				phone_description:
					"Tekrar eden işlerinizi otomatikleştirin ve telefon tercihlerinizi belirleyin.",
				permission_description:
					"Uygulamayı daha iyi kullanabilmeniz için tarayıcınızdan bazı izinler vermeniz gerekiyor.",
				notification_description:
					"Ne tür bildirimler almak istediğinizi belirleyin ve bildirimlerin dikkatinizi dağıtmasının önüne geçin.",
				feedback_description:
					"Görüş, istek ve hata bildirimlerinizi dilediğiniz zaman bize iletebilirsiniz. En yakın zamanda bildiriminizle ilgileniyor olacağız.",
				favorites_description:
					"Kullandığınız modüllerden favorilerinizi belirleyerek daha hızlı erişebilir, favorilerinize dış bağlantılar ekleyebilirsiniz.",
			},
		},
	},
};
</script>
<style>
.bg-dark .el-collapse-item__header {
	color: #ccc;
}
.bg-dark .el-collapse {
	border-bottom: 0;
	border-top: 1px solid rgba(135, 150, 165, 0.1);
}
.app-modal-preferences .el-dialog__header {
	border-bottom: 1px solid rgba(135, 150, 165, 0.1);
}
.app-modal-preferences {
	width: 80%;
	max-width: 800px;
}

.app-modal-preferences .el-dialog__header {
	padding: 10px 15px 10px 15px;
}

.app-modal-preferences .el-dialog__body {
	padding: 0 !important;
	height: calc(90vh - 73px) !important;
}

.col-100 {
	height: calc(90vh - 75px) !important;
	overflow-y: auto;
}

.input-custom {
	position: relative;
	display: block;
}

.input-custom small {
	position: absolute !important;
	top: -6px;
	left: 10px;
	background: #fff;
	padding: 0 5px;
	z-index: 22;
	font-size: 10px;
	border-radius: 10px;
}

.settings-tab .form-group small {
	font-size: 12px;
	font-style: italic;
}

.settings-tab .form-group label {
	font-weight: 400 !important;
	font-size: 12px;
}

.settings-tab h6 {
	font-weight: 400 !important;
}

.app-avatar-popper {
	max-height: 500px;
	overflow-y: auto;
	padding: 20px;
}
</style>
