<script lang="ts">
	import { page } from "$app/stores";
	import Button from "$lib/components/button/button.svelte";
	import Codeblock from "$lib/components/codeblock/codeblock.svelte";
	import IconHome from "~icons/lucide/home";

	const svg = `"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(213 219 249 / 0.08)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e"`;
</script>

<header class="relative pt-56 pb-20">
	<div
		class="absolute inset-0 h-[150%] w-full bg-bottom -z-1 bg-fixed"
		style="mask-image: radial-gradient(closest-side, black 50%, transparent 100%); background-image: url({svg});"
	/>

	<div class="container px-5 mx-auto relative text-center">
		<span
			class="-z-10 absolute h-[64rem] w-[64rem] bg-gradient-radial from-primary top-1/2 right-1/3 transform -translate-y-1/2 opacity-50 mix-blend-hard-light"
		/>
		<span
			class="-z-10 absolute h-[64rem] w-[64rem] bg-gradient-radial from-secondary top-1/2 left-1/3 transform -translate-y-1/2 opacity-50  mix-blend-hard-light"
		/>

		<svg
			class="absolute left-1/2 -top-28 transform -translate-x-1/2 opacity-50 mix-blend-soft-light -z-10"
			width="270"
			height="307"
			viewBox="0 0 270 307"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M134.419 154.074V305M134.419 154.074L268 76.885M134.419 154.074L2 76.8849M134.419 305L268 230.115M134.419 305L2 230.115M268 76.885V230.115M268 76.885L134.419 2M268 230.115L206.437 194.399M134.419 2L2 76.8849M134.419 2V69.9715M2 76.8849V230.115M2 230.115L63.5629 194.399M63.5629 194.399L63.5628 112.601L134.419 69.9715M63.5629 194.399L134.419 234.724L206.437 194.399M206.437 194.399L206.437 112.601L134.419 69.9715"
				stroke="url(#paint0_radial_1240_927)"
				stroke-width="4"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<defs>
				<radialGradient
					id="paint0_radial_1240_927"
					cx="0"
					cy="0"
					r="1"
					gradientUnits="userSpaceOnUse"
					gradientTransform="translate(135 153.5) rotate(90) scale(151.5 133)"
				>
					<stop offset="0.557292" stop-color="white" stop-opacity="0.53" />
					<stop offset="1" stop-color="white" />
				</radialGradient>
			</defs>
		</svg>

		<h1 class="text-center text-white font-bold text-8xl">
			{$page.status}
		</h1>
		<p class="text-center text-4xl font-bold my-3 text-title">
			{$page.status === 404 ? "oh dear, that page doesn't exist" : "that wasn't supposed to happen!"}
		</p>

		{#if $page.status !== 404 && $page.error?.message}
			<Codeblock class="mt-8 mx-auto max-w-2xl w-full" code={$page.error?.message} />
		{/if}

		<Button href="/" class="mt-8" outlined let:iconSize>
			<IconHome width={iconSize} height={iconSize} />
			Return to home
		</Button>
	</div>
</header>
