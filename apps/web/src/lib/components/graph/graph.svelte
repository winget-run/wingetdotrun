<script lang="ts">
	import { onMount } from "svelte";
	import { draw, fade } from "svelte/transition";

	export let height = 100;
	export let width = 300;
	export let verticalPadding = 0;

	export let stats: number[];
	export let selected: number | null = null;

	$: max = stats.reduce((a, c) => (c > a ? c : a), 0);
	$: min = stats.reduce((a, c) => (c < a ? c : a), 0);
	$: interval = width / (stats.length - 1);

	$: points = stats.map((e, i) => ({
		x: interval * i,
		y:
			e === 0
				? height
				: height - (((e - min) * 100) / (max - min)) * ((height - verticalPadding * 2) / 100) - verticalPadding,
	}));

	$: curvePoints = points
		.map(({ x, y }, i) => {
			const r = Math.round;
			if (i === 0) return `${r(x)} ${r(y)}`;
			const prevPoint = points[i - 1];
			return `${r(prevPoint.x + interval / 3)} ${r(prevPoint.y)} ${r(x - interval / 3)} ${r(y)} ${r(x)}	${r(y)}`;
		})
		.join("C");

	const handleMouseMove = (
		e: MouseEvent & {
			currentTarget: EventTarget & SVGSVGElement;
		},
	) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		let closest = points.reduce((a, c) => (Math.abs(c.x - x) < Math.abs(a.x - x) ? c : a));

		selected = points.indexOf(closest);
	};

	let mounted = false;
	onMount(() => {
		mounted = true;
	});
</script>

<svg
	on:mousemove={handleMouseMove}
	on:mouseleave={() => (selected = null)}
	class={$$props.class}
	viewBox="0 0 {width} {height}"
>
	{#key mounted}
		<path
			in:fade|local={{ duration: 1000, delay: 1000 }}
			fill="url(#graph-gradient)"
			d="M{curvePoints} L{width} {height} L0 {height} Z"
		/>
		<path
			in:draw|local={{ duration: 1000, delay: 0 }}
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			d="M{curvePoints}"
		/>
	{/key}

	{#if selected !== null}
		<circle r="12" fill="currentColor" cx={points[selected].x} cy={points[selected].y} class="pulse" />
		<circle r="6" fill="currentColor" cx={points[selected].x} cy={points[selected].y} />
	{/if}

	<defs>
		<linearGradient id="graph-gradient" x1="0" y1="0" x2="-4.12994e-06" y2={height} gradientUnits="userSpaceOnUse">
			<stop stop-color="currentColor" stop-opacity="0.4" />
			<stop stop-color="currentColor" stop-opacity="0.05" offset="1" />
		</linearGradient>
	</defs>
</svg>

<style>
	@keyframes pulse {
		0%,
		100% {
			opacity: 0%;
		}
		50% {
			opacity: 20%;
		}
	}
	.pulse {
		animation: pulse 1s infinite ease-in-out;
	}
</style>
