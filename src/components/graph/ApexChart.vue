<script>
import VueApexCharts from "vue-apexcharts";

export default {
	props: {
		labels: {
			required: true,
		},
		values: {
			required: true,
		},
	},
	components: {
		apexchart: VueApexCharts,
	},
	data() {
		return {
			show: false,
			chart: {
				series: [],
				chartOptions: {
					grid: {
						show: false,
					},
					chart: {
						type: "bar",
						height: 350,
					},
					plotOptions: {
						bar: {
							horizontal: false,
							columnWidth: "40%",
							endingShape: "rounded",
						},
					},
					dataLabels: {
						enabled: false,
					},
					stroke: {
						curve: "smooth",
						show: true,
						width: 1,
					},
					xaxis: {
						categories: [],
					},
                    fill: {
						type: "gradient",
						gradient: {
							shade: "light",
							type: "vertical",
							shadeIntensity: 0.9,
							gradientToColors: undefined,
							inverseColors: false,
							opacityFrom: 1,
							opacityTo: 1,
							stops: [0, 90, 100],
							colorStops: [],
						},
					},
				},
			},
		};
	},
};
</script>
