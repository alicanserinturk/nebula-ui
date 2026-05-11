<template>
	<div class="app-player-wrap">
		<div v-if="!loaded && !error" class="app-player-loading">
			<i class="el-icon-loading mr-1"></i> Yükleniyor...
		</div>

		<div v-else-if="!error" class="app-player">
			<!-- Equalizer — çalarken hareketli mavi, durduğunda sabit dalgalı gri. -->
			<div v-if="type === 'default'" class="app-player-eq" :class="{ 'is-playing': !paused }">
				<span class="bar"></span>
				<span class="bar"></span>
				<span class="bar"></span>
				<span class="bar"></span>
				<span class="bar"></span>
				<span class="bar"></span>
				<span class="bar"></span>
				<span class="bar"></span>
				<span class="bar"></span>
				<span class="bar"></span>
				<span class="bar"></span>
			</div>

			<!-- Progress slider + zaman göstergesi -->
			<div class="app-player-progress">
				<el-slider
					input-size="mini"
					@input="toTime"
					:value="currentTime"
					:step="1"
					size="mini"
					:min="0"
					:max="audio.duration || 0"
					:show-tooltip="false"
				></el-slider>
				<div v-if="type === 'default'" class="app-player-times">
					<small>{{ formatTime(currentTime) }}</small>
					<small class="text-muted">{{ formatTime(audio.duration) }}</small>
				</div>
			</div>

			<!-- Kontrol butonları -->
			<div class="app-player-controls">
				<button
					v-if="type === 'default'"
					class="app-player-btn app-player-btn-secondary"
					@click="speedDown"
					title="Yavaşlat"
				>
					<ion-icon name="play-back-outline"></ion-icon>
				</button>

				<button class="app-player-btn app-player-btn-main" @click="paused ? play() : pause()">
					<ion-icon v-if="paused" name="play"></ion-icon>
					<ion-icon v-else name="pause"></ion-icon>
				</button>

				<button
					v-if="type === 'default'"
					class="app-player-btn app-player-btn-secondary"
					@click="speedUp"
					title="Hızlandır"
				>
					<ion-icon name="play-forward-outline"></ion-icon>
				</button>

				<template v-if="type === 'default'">
					<span class="app-player-rate">{{ audio.playbackRate }}x</span>

					<button
						class="app-player-btn app-player-btn-secondary"
						@click="muted ? unmute() : mute()"
						:title="muted ? 'Sesi aç' : 'Sustur'"
					>
						<ion-icon v-if="!muted" name="volume-high-outline"></ion-icon>
						<ion-icon v-else name="volume-mute-outline"></ion-icon>
					</button>
				</template>
			</div>
		</div>

		<div v-else class="app-player-error">
			<el-tooltip
				class="item"
				effect="dark"
				:content="src ? src : 'Bağlantı girilmedi.'"
				placement="top"
			>
				<span><i class="el-icon-warning-outline mr-1"></i>Ses dosyası oynatılamıyor.</span>
			</el-tooltip>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		src: { required: true },
		showWave: { required: false, default: true },
		type: { required: false, default: "default" },
	},
	data() {
		return {
			error: false,
			loaded: false,
			audio: false,
			paused: true,
			muted: false,
			currentTime: 0,
		};
	},
	created() {
		this.setup();
	},
	beforeDestroy() {
		this.pause();
	},
	watch: {
		src() {
			this.pause();
			this.toTime(0);
			this.setup();
		},
	},
	methods: {
		setup() {
			this.audio = new window.Audio(this.src);
			this.audio.onerror = () => {
				this.error = true;
			};
			this.audio.onloadeddata = () => {
				this.loaded = true;
			};
			this.audio.preload = true;
			this.audio.ontimeupdate = () => {
				if (this.audio.currentTime === this.audio.duration) {
					this.currentTime = 0;
					this.paused = true;
				} else {
					this.currentTime = this.audio.currentTime;
				}
			};
		},
		play() {
			this.audio.play();
			this.paused = false;
		},
		pause() {
			this.audio.pause();
			this.paused = true;
		},
		mute() {
			this.audio.muted = true;
			this.muted = true;
		},
		unmute() {
			this.audio.muted = false;
			this.muted = false;
		},
		speedUp() {
			this.audio.playbackRate = Math.min(this.audio.playbackRate * 2, 4);
		},
		speedDown() {
			this.audio.playbackRate = Math.max(this.audio.playbackRate / 2, 0.25);
		},
		toTime(time) {
			if (isNaN(time)) time = 0;
			if (time !== this.currentTime) {
				this.audio.currentTime = parseInt(Math.floor(time));
			}
		},
		formatTime(seconds) {
			if (!seconds || isNaN(seconds)) return "0:00";
			const m = Math.floor(seconds / 60);
			const s = Math.floor(seconds % 60);
			return `${m}:${s.toString().padStart(2, "0")}`;
		},
	},
};
</script>

<style scoped>
.app-player-wrap {
	width: 100%;
}

.app-player-loading,
.app-player-error {
	text-align: center;
	padding: 20px 0;
	color: #7f8c9a;
	font-size: 14px;
}

.app-player {
	/* arka plan yok — sadece kontrol satırı kartlı */
}

/* Equalizer — büyük, merkezi, pasifte sabit dalga */
.app-player-eq {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 8px;
	height: 96px;
	margin: 8px auto 35px;
}

.app-player-eq .bar {
	display: inline-block;
	width: 6px;
	height: 100%;
	background: #c7d0db;
	border-radius: 3px;
	transform-origin: center;
	transition: background 0.3s ease, transform 0.4s ease;
}

/* Pasif (duraklatılmış) — her bar farklı yükseklikte, statik dalga formu */
.app-player-eq .bar:nth-child(1)  { transform: scaleY(0.30); }
.app-player-eq .bar:nth-child(2)  { transform: scaleY(0.55); }
.app-player-eq .bar:nth-child(3)  { transform: scaleY(0.80); }
.app-player-eq .bar:nth-child(4)  { transform: scaleY(0.50); }
.app-player-eq .bar:nth-child(5)  { transform: scaleY(0.95); }
.app-player-eq .bar:nth-child(6)  { transform: scaleY(0.65); }
.app-player-eq .bar:nth-child(7)  { transform: scaleY(0.85); }
.app-player-eq .bar:nth-child(8)  { transform: scaleY(0.45); }
.app-player-eq .bar:nth-child(9)  { transform: scaleY(0.70); }
.app-player-eq .bar:nth-child(10) { transform: scaleY(0.40); }
.app-player-eq .bar:nth-child(11) { transform: scaleY(0.25); }

/* Aktif (çalarken) — animasyon devreye girer, statik transform'lar override edilir */
.app-player-eq.is-playing .bar {
	background: linear-gradient(180deg, #4f8cff 0%, #2d6cdf 100%);
	animation: app-player-eq-bounce 0.9s ease-in-out infinite;
	transition: background 0.3s ease;
}

.app-player-eq.is-playing .bar:nth-child(1)  { animation-delay: 0.00s; }
.app-player-eq.is-playing .bar:nth-child(2)  { animation-delay: 0.12s; }
.app-player-eq.is-playing .bar:nth-child(3)  { animation-delay: 0.24s; }
.app-player-eq.is-playing .bar:nth-child(4)  { animation-delay: 0.06s; }
.app-player-eq.is-playing .bar:nth-child(5)  { animation-delay: 0.18s; }
.app-player-eq.is-playing .bar:nth-child(6)  { animation-delay: 0.30s; }
.app-player-eq.is-playing .bar:nth-child(7)  { animation-delay: 0.09s; }
.app-player-eq.is-playing .bar:nth-child(8)  { animation-delay: 0.21s; }
.app-player-eq.is-playing .bar:nth-child(9)  { animation-delay: 0.15s; }
.app-player-eq.is-playing .bar:nth-child(10) { animation-delay: 0.27s; }
.app-player-eq.is-playing .bar:nth-child(11) { animation-delay: 0.03s; }

@keyframes app-player-eq-bounce {
	0%, 100% { transform: scaleY(0.2); }
	50% { transform: scaleY(1); }
}

/* Progress */
.app-player-progress {
	margin-bottom: 12px;
}

.app-player-times {
	display: flex;
	justify-content: space-between;
	margin-top: 4px;
	font-size: 12px;
	color: #6b7888;
}

/* Kontrol satırı — kartlı arka plan sadece burada */
.app-player-controls {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
	background: linear-gradient(135deg, #f6f8fb 0%, #eef2f7 100%);
	border-radius: 999px;
	padding: 10px 18px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
	margin: 0 auto;
	width: fit-content;
}

.app-player-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border: none;
	cursor: pointer;
	transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease;
	padding: 0;
}

.app-player-btn:focus {
	outline: none;
}

.app-player-btn ion-icon {
	display: block;
}

.app-player-btn-main {
	width: 48px;
	height: 48px;
	border-radius: 50%;
	background: linear-gradient(135deg, #4f8cff 0%, #2d6cdf 100%);
	color: #fff;
	box-shadow: 0 4px 12px rgba(45, 108, 223, 0.35);
}

.app-player-btn-main ion-icon {
	font-size: 22px;
	margin-left: 1px; /* play ikonu görsel hizalama */
}

.app-player-btn-main:hover {
	transform: scale(1.06);
	box-shadow: 0 6px 16px rgba(45, 108, 223, 0.45);
}

.app-player-btn-main:active {
	transform: scale(0.96);
}

.app-player-btn-secondary {
	width: 34px;
	height: 34px;
	border-radius: 50%;
	background: #ffffff;
	color: #5a6677;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.app-player-btn-secondary ion-icon {
	font-size: 16px;
}

.app-player-btn-secondary:hover {
	background: #f0f4fa;
	color: #2d6cdf;
}

.app-player-rate {
	min-width: 36px;
	text-align: center;
	font-size: 13px;
	font-weight: 600;
	color: #5a6677;
}

/* Element slider overrides */
.app-player >>> .el-slider__runway {
	background: #d8e0eb;
	height: 6px;
	border-radius: 3px;
	margin: 8px 0;
}

.app-player >>> .el-slider__bar {
	background: linear-gradient(90deg, #4f8cff, #2d6cdf);
	height: 6px;
	border-radius: 3px;
}

.app-player >>> .el-slider__button {
	border-color: #2d6cdf;
	width: 14px;
	height: 14px;
}
</style>
