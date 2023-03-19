<script lang="ts">
	import Package from "$lib/components/package/package.svelte";
	import SearchBar from "$lib/components/search/search_bar.svelte";
	import { Feed } from "svaria";

	const svg = `"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(213 219 249 / 0.08)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e"`;
</script>

<header class="relative pt-40 pb-32">
	<div
		class="absolute inset-0 h-[150%] w-full bg-bottom -z-1 bg-fixed"
		style="mask-image: radial-gradient(closest-side, black 50%, transparent 100%); background-image: url({svg});"
	/>

	<div class="container px-5 mx-auto relative">
		<span
			class="-z-10 absolute h-[64rem] w-[64rem] bg-gradient-radial from-primary top-1/2 right-1/3 transform -translate-y-1/2 opacity-50 mix-blend-hard-light"
		/>
		<span
			class="-z-10 absolute h-[64rem] w-[64rem] bg-gradient-radial from-secondary top-1/2 left-1/3 transform -translate-y-1/2 opacity-50  mix-blend-hard-light"
		/>

		<svg
			class="absolute left-1/2 -top-28 transform -translate-x-1/2 opacity-50 mix-blend-soft-light -z-1"
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

		<h1 class="text-center font-bold text-white text-6xl mb-8">
			winget<span class="font-normal">dot</span>run
		</h1>
		<SearchBar class="mx-auto max-w-3xl " />
	</div>
</header>

<div class="container px-5 mx-auto">
	<h2 id="popular-packages-title" class="text-2xl text-title font-bold mb-8">Most popular packages this month</h2>
	<Feed class="grid grid-cols-4 gap-8" feedLabelId="popular-packages-title" isLoading={false}>
		{#each Array(8) as _, i}
			<Package
				highlights={null}
				svariaProps={{
					index: i,
					itemCount: 8,
					labelId: `popular-${"Microsoft.VisualStudioCode"}`,
					descriptionId: `popular-${"Microsoft.VisualStudioCode"}-desc`,
				}}
				pack={{
					id: "Microsoft.VisualStudioCode",
					wingetId: "Microsoft.VisualStudioCode",
					name: "Visual Studio Code",
					description:
						"Visual Studio Code is a code editor redefined and optimized for building and debugging modern web and cloud applications. Visual Studio Code is free and available on your favorite platform - Linux, macOS, and Windows.",
					homepage: "https://code.visualstudio.com/",
					license: "MIT",
					licenseUrl: "",
					featured: true,
					publisherId: "Microsoft",
				}}
			/>
		{/each}
	</Feed>
</div>
