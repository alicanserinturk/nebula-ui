<template>
	<header id="header" class="page-header bg-body pt-1">
		<div class="navbar navbar-expand-lg">
			<div
				class="d-block collapse order-2 order-lg-1 i-con-h-a"
				id="navbarToggler"
			>
				<form autocomplete="off" autocapitalize="off">
					<div class="d-inline-block app-header-search">
						<i class="text-muted el-icon-search"><i></i></i>
						<el-select
							popper-class="app-header-search-popper"
							remote
							:remote-method="getSearchItems"
							v-if="searchInModules"
							name="search"
							@change="handleChangeSearch()"
							size="small"
							v-model="searchValue"
							filterable
							placeholder="Bir şey mi arıyorsunuz?"
						>
							<el-option-group label="Hızlı Erişim" v-if="options.length > 0">
								<template>
									<el-option
										v-for="item in options"
										:key="item.key"
										:label="$t('menu.modules.' + item.key + '.title')"
										:value="item.path"
									>
										<span class="app-search-icon"
											><ion-icon :name="item.icon"></ion-icon
										></span>
										<span class="app-search-text">{{
											$t("menu.modules." + item.key + ".title")
										}}</span>
									</el-option>
								</template>
							</el-option-group>
							<el-option-group label="İpuçları">
								<el-option
									:key="key"
									:label="tip.label"
									:value="tip.label"
									v-for="(tip, key) in tips"
								>
									<span class="app-search-icon"
										><ion-icon name="bulb-outline"></ion-icon
									></span>
									<span class="app-search-text">{{ tip.label }}</span>
									<span class="app-search-icon"
										><ion-icon name="help-circle-outline"></ion-icon
									></span>
								</el-option>
							</el-option-group>

							<el-option-group v-if="liveSearchValue !== ''" label="Modüller">
								<el-option value="" :label="liveSearchValue">
									<span class="app-search-icon"
										><ion-icon name="search-outline"></ion-icon
									></span>
									<span class="app-search-text"
										>Kullanıcılar içinde
										<span class="badge my-1 badge-md bg-primary">{{
											liveSearchValue
										}}</span>
										ara</span
									>
									<span class="app-search-icon"
										><ion-icon name="search-outline"></ion-icon
									></span>
								</el-option>
							</el-option-group>
						</el-select>
					</div>
				</form>
			</div>
			<ul class="nav navbar-menu order-1 order-lg-2">
				<li class="nav-item">
					<a class="nav-link px-2 i-con-h-a">
						<ion-icon
							style="font-size:20px"
							name="help-circle-outline"
						></ion-icon>
					</a>
				</li>
				<li
					class="nav-item"
					v-if="envParams.VUE_APP_ENV !== 'production'"
				>
					<a class="nav-link px-2 i-con-h-a" @click="openDeveloperConsole()">
						<ion-icon style="font-size:20px" name="terminal-outline"></ion-icon>
						<!--<span class="badge badge-pill badge-up bg-primary">8</span>-->
					</a>
				</li>
				<li class="nav-item">
					<a class="nav-link px-2 i-con-h-a" @click="openNotifications()">
						<el-badge
							:max="9"
							type="primary"
							:value="unreadNotificationCount"
							:hidden="unreadNotificationCount === 0"
						>
							<ion-icon
								style="font-size:20px"
								name="notifications-outline"
							></ion-icon>
						</el-badge>
					</a>
				</li>
				<li class="nav-item d-none d-sm-block">
					<router-link to="/messages" class="nav-link px-2 i-con-h-a"
						><ion-icon
							style="font-size:20px"
							name="chatbubbles-outline"
						></ion-icon
					></router-link>
				</li>
				<li class="nav-item">
					<el-dropdown trigger="click" @command="handleDropdown" size="medium">
						<a class="nav-link px-2 i-con-h-a mr-lg-2"
							><ion-icon
								style="font-size:20px"
								name="person-outline"
							></ion-icon>
						</a>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="updates">
								<div>
									<ion-icon name="megaphone-outline" class="mr-1"></ion-icon>
									<span
										>Güncelleme Notları
										<el-tag size="mini" effect="dark" class="ml-1">{{
											version
										}}</el-tag></span
									>
								</div>
							</el-dropdown-item>
							<el-dropdown-item command="settings"
								><ion-icon name="settings-outline" class="mr-1"></ion-icon>
								Hesap Ayarları</el-dropdown-item
							>
							<div class="mb-2 mt-2 b-t"></div>
							<el-dropdown-item command="logout"
								><ion-icon name="log-out-outline" class="mr-1"></ion-icon>
								Çıkış</el-dropdown-item
							>
						</el-dropdown-menu>
					</el-dropdown>
				</li>
			</ul>
		</div>
	</header>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { modules } from "@/constans/config";
import EventBus from "@/utils/EventBus";

export default {
	data() {
		return {
			items: [],
			searchValue: "",
			liveSearchValue: "",
			searchInModules: true,
			options: [],
			tips: [
				{ label: "Pano", value: "doc.html#Pano" },
				{
					label: "Kullanıcıları nasıl bilgilendiririm",
					value: "doc.html#duyurular",
				},
				{ label: "Canlı İzleme", value: "doc.html#canli-izleme" },
				{ label: "Arama Listem", value: "doc.html#arama-listem" },
				{ label: "Tıklayarak Arama", value: "doc.html#arama-listem" },
				{ label: "Son Çağrılarım", value: "doc.html#son-cagrilarim" },
				{ label: "Gelen Aramalar", value: "doc.html#gelen-aramalar" },
				{ label: "Giden Aramalar", value: "doc.html#giden-aramalar" },
				{ label: "Ses Kayıt Raporu", value: "doc.html#ses-kayit-raporu" },
				{
					label: "Temsilci Performansı",
					value: "doc.html#temsilci-performansi",
				},
				{ label: "Duyurular", value: "doc.html#duyurular" },
				{ label: "Arama Listeleri", value: "doc.html#arama-listeleri" },
				{ label: "Kara Liste", value: "doc.html#kara-liste" },
				{ label: "Numara Engelleme", value: "doc.html#kara-liste" },
				{
					label: "İstemediğim numaraları nasıl engellerim?",
					value: "doc.html#kara-liste",
				},
				{ label: "Otomatik Arama", value: "doc.html#arama-listeleri" },
				{ label: "Excel Yükleme", value: "doc.html#arama-listeleri" },
				{ label: "Excel Listesi Arama", value: "doc.html#arama-listeleri" },
				{ label: "Telefon Hakkında", value: "doc.html#telefon-baslangic" },
				{ label: "Telefon", value: "doc.html#telefon-baslangic" },
				{
					label: "Telefonu Nasıl Kullanırım",
					value: "doc.html#telefon-baslangic",
				},
				{ label: "Sip Phone Nedir", value: "doc.html#telefon-baslangic" },
				{ label: "Telefon Giden Arama", value: "doc.html#giden-arama" },
				{
					label: "Telefon Giden Arama Nasıl Yapılır",
					value: "doc.html#giden-arama",
				},
				{ label: "Telefon Gelen Arama", value: "doc.html#gelen-arama" },
				{
					label: "Telefon Gelen Arama Nasıl Yapılır",
					value: "doc.html#gelen-arama",
				},
				{
					label: "Mola ve Diğer Durumlar",
					value: "doc.html#mola-ve-diger-durumlar",
				},
				{
					label: "Nasıl Mola Alırım",
					value: "doc.html#mola-ve-diger-durumlar",
				},
				{
					label: "Neden Mola Almalıyım",
					value: "doc.html#mola-ve-diger-durumlar",
				},
				{ label: "Çağrı Olayları", value: "doc.html#cagri-olaylari" },
				{
					label: "Telefonda Görünen Simgeler Nelerdir",
					value: "doc.html#cagri-olaylari",
				},
				{
					label: "Soft Phone'da Görünen Simgeler Nelerdir",
					value: "doc.html#cagri-olaylari",
				},
				{ label: "Müşteri Yönetimi", value: "doc.html#musteri-yonetimi" },
				{ label: "CRM", value: "doc.html#musteri-yonetimi" },
				{ label: "Nasıl CRM yapabilirim?", value: "doc.html#musteri-yonetimi" },
				{
					label: "Müşterilerime not yazmak istiyorum",
					value: "doc.html#musteri-yonetimi",
				},
				{
					label: "Telefon Ayarları",
					value: "doc.html#kisisellestirilebilir-ayarlar",
				},
			],
		};
	},
	computed: {
		...mapGetters(["currentUser", "version", "notifications", "unreadNotificationCount"]),
		envParams() {
			return process.env;
		},
	},
	created() {
		Object.keys(modules).forEach((key) => {
			if (
				modules[key].path !== "" &&
				modules[key].path !== this.$route.fullPath &&
				this.$api.has(key)
			) {
				this.items.push({
					...modules[key],
					key: key,
				});
				this.options.push({
					...modules[key],
					key: key,
				});
			}
		});
	},
	methods: {
		...mapActions(["signout", "updateCurrentUser", "readNotifications"]),
		handleDropdown(command) {
			if (command === "logout") this.logout();
			else if (command === "settings") this.openPreferences();
			else if (command === "updates") this.openUpdates();
		},
		logout() {
			EventBus.$emit("logout");
		},
		setLang(key) {
			this.currentUser.settings.interface_language = key;
			this.$i18n.locale = key;
			this.updateCurrentUser();
		},
		disableStyle(styleName, disabled) {
			let styles = document.styleSheets;
			let href = "";
			for (let i = 0; i < styles.length; i++) {
				href = styles[i].href.split("/");
				href = href[href.length - 1];
				if (href === styleName) {
					styles[i].disabled = disabled;
					break;
				}
			}
		},
		handleChangeSearch() {
			this.$router.push(this.searchValue);
			this.searchValue = "";
		},
		getSearchItems(query) {
			this.liveSearchValue = query;
			if (query !== "") {
				this.options = this.items.filter((item) => {
					return item.key.toLowerCase().indexOf(query.toLowerCase()) > -1;
				});
			} else {
				this.options = [];
			}
		},
		openNotifications() {
			EventBus.$emit("openNotifications");
			this.readNotifications();
		},
		openUpdates() {
			EventBus.$emit("openUpdates");
		},
		openPreferences() {
			EventBus.$emit("openPreferences");
		},
		openDeveloperConsole() {
			EventBus.$emit("openDeveloperConsole");
		},
	},
	watch: {},
};
</script>
<style>
.bg-dark .app-header-search .el-icon-search {
	color: #ddd !important;
}

.bg-dark .app-header-search .el-input__inner::placeholder {
	color: #ddd !important;
}
.bg-dark .app-header-search .el-input__inner {
	border: 1px solid #35383c !important;
	background-color: #1f2124 !important;
	color: #ddd !important;
}
.app-header-search .el-input__inner {
	background-color: #fff;
	border-radius: 100px;
	padding-left: 37px;
	width: 300px;
	transition: 0.3s;
	box-shadow: 0 0 6px -2px rgba(0, 0, 0, 0.05);
	border: 1px solid rgba(135, 150, 165, 0.1) !important;
	height: 36px;
}
.el-input__inner::placeholder {
	color: #666;
	font-weight: 400;
	font-size: 12px;
}
.app-header-search .el-icon-search {
	position: absolute;
	left: 15px;
	top: 11px;
	z-index: 2;
	color: #888 !important;
}
.app-header-search .el-input__inner:focus {
	width: 450px;
}
.app-header-search-popper .el-select-dropdown__item ion-icon {
	margin-right: 5px;
	font-size: 16px;
	line-height: 40px;
}
.app-header-search-popper {
	min-width: 450px;
}
.app-header-search-popper .el-select-dropdown__item.selected {
	font-weight: 400 !important;
}
.app-header-search {
	position: relative;
}
.app-search-text {
	flex: 1;
	height: 34px;
	line-height: 34px !important;
	display: inline-block;
	padding-left: 5px;
}
.app-search-icon {
	padding-top: 3px;
	width: auto;
	height: 34px;
	line-height: 34px;
	display: inline-block;
}
.app-header-search-popper .el-select-dropdown__item {
	display: flex !important;
}
</style>
