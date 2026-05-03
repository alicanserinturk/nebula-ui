<template>
	<div>
		<!--<div class="row" v-if="showWave">
      <av-waveform
        noplayed-line-color="#999999"
        :noplayed-line-width="0.5"
        played-line-color="#111111"
        :played-line-width="0.5"
        :audio-controls="false"
        :playtime="false"
        :audio-src="audio.src"
      ></av-waveform>
    </div>-->
		<div v-if="!loaded && !error">
			Yükleniyor
		</div>
		<div class="app-player row row-xs" v-else-if="!error">
			<div class="col-auto i-con-h-a pointer" @click="play" v-if="paused">
				<ion-icon name="play-outline"></ion-icon>
			</div>
			<div class="col-auto i-con-h-a pointer" @click="pause" v-else>
				<ion-icon name="pause-outline"></ion-icon>
			</div>
			<div class="col px-3">
				<el-slider
					input-size="mini"
					@input="toTime"
					:value="currentTime"
					:step="1"
					size="mini"
					:min="0"
					:max="audio.duration"
				></el-slider>
			</div>
			<template v-if="type === 'default'">
				<div class="col-auto">
					<small class="d-inline-block" style="min-width: 60px;"
						>{{ Math.floor(currentTime / 60) }}:{{
							(currentTime % 60).toFixed(0)
						}}
						/ {{ Math.floor(audio.duration / 60) }}:{{
							(audio.duration % 60).toFixed(0)
						}}</small
					>
					<small>{{ audio.playbackRate }}X </small>
				</div>
				<div class="col-auto i-con-h-a pointer" @click="speedDown">
					<ion-icon name="play-back-outline"></ion-icon>
				</div>
				<div class="col-auto i-con-h-a pointer" @click="speedUp">
					<ion-icon name="play-forward-outline"></ion-icon>
				</div>
				<div class="col-auto i-con-h-a pointer" @click="mute" v-if="!muted">
					<ion-icon name="volume-high-outline"></ion-icon>
				</div>
				<div class="col-auto i-con-h-a pointer" @click="unmute" v-else>
					<ion-icon name="volume-mute-outline"></ion-icon>
				</div>
			</template>
		</div>
		<div class="d-inline-block text-left" v-else>
			<el-tooltip
				class="item"
				effect="dark"
				:content="src ? src : 'Bağlantı girilmedi.'"
				placement="top"
			>
				<span>Ses dosyası oynatılamıyor.</span>
			</el-tooltip>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		src: {
			required: true,
		},
		showWave: {
			required: false,
			default: true,
		},
		type: {
			required: false,
			default: "default",
		},
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
	mounted() {},
	created() {
		this.setup();
	},
	beforeDestroy() {
		this.pause();
	},
	computed: {
		time: {
			get() {
				return this.currentTime;
			},
			set(value) {
				this.audio.currentTime = parseInt(value);
			},
		},
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
			this.audio.onerror = (e) => {
				this.error = true;
			};
			this.audio.onloadeddata = (e) => {
				this.loaded = true;
			};
			this.audio.preload = true;
			this.audio.ontimeupdate = (e) => {
				if (e.path[0].currentTime === e.path[0].duration) {
					this.currentTime = 0;
					this.paused = true;
				} else this.currentTime = e.path[0].currentTime;
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
			this.audio.playbackRate = this.audio.playbackRate * 2;
		},
		speedDown() {
			this.audio.playbackRate = this.audio.playbackRate / 2;
		},
		toTime(time) {
			if (isNaN(time)) {
				time = 0;
			}
			if (time !== this.currentTime)
				this.audio.currentTime = parseInt(Math.floor(time));
		},
	},
};
</script>
<style>
.app-player ion-icon {
	font-size: 20px;
	line-height: 34px;
}

.app-player .el-slider {
	margin-top: -8px;
}

.app-player .el-slider__runway {
}
</style>
