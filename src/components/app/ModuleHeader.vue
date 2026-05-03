<template>
	<div
		class="page-hero bg-base"
		id="page-hero"
		v-bind:class="{ 'page-hero-sticky': sticky }"
	>
		<div class="mb-3 pb-2">
			<div class="row no-gutters">
				<div class="col-md">
					<div class="row mb-0 mt-3 row-xs">
						<div class="col-auto" style="padding-top: 1px;">
							<span class="d-inline-block">
								<ion-icon
									:name="$route.meta.icon"
									style="font-size:22px; font-weight:700"
								></ion-icon>
								<span
									v-if="isActionType"
									style="position:absolute;top:-6px;right:-3px;padding:2px;"
									><ion-icon
										class="bg-white"
										style="font-size:12px; background:#FFF;border-radius:50px;"
										:name="typeIcon"
									></ion-icon
								></span>
							</span>
						</div>
						<div class="col-auto pl-1">
							<h4 class="mb-0 font-weight-bold">
								{{ $t("menu.modules." + $route.meta.key + ".title") }}
							</h4>
						</div>
					</div>
					<div>
						<router-link v-if="$route.path !== '/'" to="/"
							><small class="text-muted">{{
								$t("menu.modules.dashboard.title")
							}}</small
							><small class="text-muted" style="font-size:9px"
								><i
									style="margin-left:5px; margin-right: 0"
									class="el-icon-arrow-right"
								></i
							></small>
						</router-link>
						<span v-else
							><small class="text-muted"
								>Hoş geldin
								<strong class="font-weight-bold">{{
									currentUser.name
								}}</strong></small
							></span
						>
						<router-link
							v-if="module.meta.icon !== ''"
							:to="module.fullPath"
							v-for="(module, key) in modules"
							:key="key"
						>
							<small class="text-muted">{{
								$t("menu.modules." + module.meta.key + ".title")
							}}</small>
							<small
								v-if="modules.length - 1 !== key"
								class="text-muted"
								style="font-size:9px"
							>
								<i class="el-icon-arrow-right" style="margin-right:4px;"></i>
							</small>
						</router-link>
						<span v-else style="margin-right:5px;">
							<small class="text-muted">{{
								$t("menu.modules." + module.meta.key + ".title")
							}}</small>
							<small
								v-if="modules.length - 1 !== key"
								class="text-muted"
								style="font-size:9px"
							>
								<i class="el-icon-arrow-right"></i>
							</small>
						</span>
					</div>
				</div>
				<div class="col-md-auto pt-4">
					<slot name="action"></slot>
				</div>
			</div>
		</div>
		<div>
			<slot name="toolbar"></slot>
		</div>
	</div>
</template>
<style>
.bg-dark .bg-base {
	background: #1f2124 !important;
}

.custom-md {
	font-weight: 400 !important;
	font-size: 16px;
	color: #5e676f;
}

.custom-head {
	font-size: 14px;
	font-weight: 400 !important;
	color: #5e676f;
	padding-top: 2px;
}

.custom-head a {
	color: #5e676f;
}

.custom-head i {
	/*color:#69A2FF;*/
	color: #5e676f;
	margin: 0 5px;
}

.module-header-title {
	border-left: 3px solid #dadada;
	border-radius: 3px;
	padding-left: 1rem;
}

.breadcrumb {
	height: 30px !important;
	line-height: 30px !important;
	border-radius: 4px;
	border: 1px solid #eaeaea;
	padding: 0;
	margin: 0 0 10px 0;
	background: #fff;
	box-sizing: border-box;
	width: auto !important;
	display: inline-flex;
	padding-right: 1.5rem;
}

.breadcrumb li:first-child {
	padding-left: 1.5rem;
}

.breadcrumb li {
	line-height: 28px;
	padding: 0 0 0 10px;
}

.breadcrumb li:before {
	margin-right: 10px;
}

.breadcrumb li a {
	color: #444;
}

.breadcrumb-2 {
	text-align: center;
	display: inline-block;
	border: 1px solid #dadada;
	overflow: hidden;
	border-radius: 5px;
	margin-bottom: 10px;
}

.breadcrumb__step {
	text-decoration: none;
	outline: none;
	display: block;
	float: left;
	font-size: 12px;
	line-height: 28px;
	padding: 0 0.8rem 0 2.1rem;
	position: relative;
	background: #fff;
	color: #444;
	transition: background 0.5s;
}

.breadcrumb__step:first-child {
	padding-left: 1.5rem;
	border-radius: 5px 0 0 5px;
}

.breadcrumb__step:first-child::before {
	left: 14px;
}

.breadcrumb__step:last-child {
	border-radius: 0 5px 5px 0;
	padding-right: 20px;
}

.breadcrumb__step:last-child::after {
	content: none;
}

.breadcrumb__step::before {
	border-radius: 100%;
	width: 20px;
	height: 20px;
	line-height: 20px;
	margin: 8px 0;
	position: absolute;
	top: 0;
	left: 30px;
	font-weight: bold;
	background: #fff;
	box-shadow: 0 0 0 1px #fff;
}

.breadcrumb__step::after {
	content: "";
	position: absolute;
	top: 0;
	right: -18px;
	width: 28px;
	height: 28px;
	transform: scale(0.707) rotate(45deg);
	z-index: 1;
	border-radius: 0 5px 0 50px;
	background: #fff;
	transition: background 0.5s;
	box-shadow: 1px -1px 0 1px #eaeaea;
}

.breadcrumb__step--active {
	color: #444;
	background: #fff;
}

.breadcrumb__step--active::before {
	color: #fff;
}

.breadcrumb__step--active::after {
	background: #fff;
}

.breadcrumb__step:hover {
	color: #000;
	background: #fff;
}

.breadcrumb__step:hover::before {
	color: #fff;
}

.breadcrumb__step:hover::after {
	color: #fff;
	background: #fff;
}

.app-module-toolbar .el-button {
	border: 1px solid transparent !important;
	box-shadow: 0 2px 4px -3px rgba(0, 0, 0, 0.2) !important;
}

.app-module-toolbar .el-radio-button__inner {
	border: 1px solid transparent !important;
	box-shadow: 0 2px 4px -3px rgba(0, 0, 0, 0.2) !important;
}

.app-module-toolbar .el-radio-button {
	margin-bottom: 0 !important;
}

.app-module-toolbar .el-radio-button:first-child .el-radio-button__inner {
	border: 1px solid transparent !important;
	box-shadow: 0 2px 4px -3px rgba(0, 0, 0, 0.2) !important;
}

.app-module-toolbar .el-input__inner {
	border: 1px solid transparent !important;
	box-shadow: 0 2px 4px -3px rgba(0, 0, 0, 0.2) !important;
}

.page-title-text {
	color: #555;
	font-weight: 500;
	font-size: 18px;
}

.page-title-text a {
	color: inherit;
}

.page-title-text i {
	color: #bbb;
	font-size: 8px;
	margin: 0 6px;
	vertical-align: middle;
}

.page-title-text:first-child {
	color: #111;
	font-weight: 500;
}

.page-hero {
	top: 60px;
	background: #f9f9fa;
	position: sticky;
	z-index: 999;
	margin-left: -24px;
	padding: 0 26px 0 26px;
	width: calc(100% + 48px);
}

.page-hero-sticky {
	box-shadow: 0 30px 30px -35px rgb(0 0 0 / 15%);
    padding-bottom: 1px;
}

.page-hero-sticky .padding {
}

.page-back {
	margin-bottom: 10px;
	font-size: 11px;
	color: #aaa;
}

.page-back i {
	margin-right: -2px;
}
</style>
<script>
import { mapGetters } from "vuex";

export default {
	data() {
		return {
			sticky: false,
			modules: [],
		};
	},
	created() {
		window.addEventListener("scroll", this.handleScroll);
		this.analysis();
	},
	destroyed() {
		window.removeEventListener("scroll", this.handleScroll);
	},
	computed: {
		...mapGetters(["currentUser"]),
		isActionType() {
			return (
				this.$route.meta.key.includes("_create") ||
				this.$route.meta.key.includes("_edit")
			);
		},
		typeIcon() {
			if (this.$route.meta.key.includes("_create")) return "add-circle-outline";
			else if (this.$route.meta.key.includes("_edit")) return "create-outline";
			else return false;
		},
	},
	methods: {
		handleScroll(event) {
			if (window.scrollY > 1 && !this.sticky) this.sticky = true;
			if (window.scrollY < 2 && this.sticky) this.sticky = false;
		},
		analysis: function() {
			this.modules = [];
			this.module = this.$route.meta.title;
			const parts = this.$route.path.split("/");

			let url = "";

			parts.forEach((item, key) => {
				/*if (key < 0) return;*/
				if (item === "") return;
				url = url + "/" + item;
				let module = this.$router.resolve({
					path: url,
				}).resolved;
				this.modules.push(module);
			});
		},
	},
	watch: {
		$route(to, from) {
			this.analysis();
		},
	},
};
</script>
