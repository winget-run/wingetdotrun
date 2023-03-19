<script lang="ts">
	import Button from "$lib/components/button/button.svelte";
	import Codeblock from "$lib/components/codeblock/codeblock.svelte";
	import Graph from "$lib/components/graph/graph.svelte";
	import { trpc } from "$lib/trpc/client";
	import { padDate } from "$lib/utils/helpers";
	// import Codeblock from "$lib/components/codeblock.svelte";
	// import TextInput from "$lib/components/forms/text_input.svelte";
	// import PackageIcon from "$lib/components/package_icon.svelte";
	// import Tooltip from "$lib/components/tooltip.svelte";
	// import Versions from "$lib/components/versions.svelte";
	// import { theme } from "$lib/stores/a11y";
	// import { downloads } from "$lib/stores/packages";
	// import type { IResponseSingle } from "$lib/types/package";
	// import { padDate } from "$lib/utils/helpers";
	// import clsx from "clsx";
	// import { backOut } from "svelte/easing";
	// import { fly } from "svelte/transition";
	// import IconCalendar from "~icons/uil/calendar-alt";
	// import IconExternalLink from "~icons/uil/external-link-alt";
	import IconPlus from "~icons/lucide/plus";
	import type { PageData } from "./$types";

	export let data: PageData;

	let graphWidth: number;

	let dates = padDate(
		[
			{
				period: "2023-03-13T00:00:00.000Z",
				value: 20,
			},
			{
				period: "2023-03-14T00:00:00.000Z",
				value: 23,
			},
			{
				period: "2023-03-15T00:00:00.000Z",
				value: 14,
			},
			{
				period: "2023-03-16T00:00:00.000Z",
				value: 13,
			},
			{
				period: "2023-03-17T00:00:00.000Z",
				value: 17,
			},
		],
		1000 * 60 * 60 * 24,
		7,
	);
	let selectedDateIdx: number | null = null;
	$: selectedDate = selectedDateIdx !== null ? dates[selectedDateIdx] : undefined;
</script>

<div class="container px-5 mx-auto">
	<Button class="w-full mb-5" let:iconSize>
		<IconPlus class="mr-2 transform" width={iconSize} height={iconSize} />
		I have aids
	</Button>

	<Codeblock class="mb-5" code="winget install -id" />
	{#if selectedDateIdx !== null}
		{@const views = dates[selectedDateIdx].value}
		<h2 class="px-5 font-semibold text-xl text-title dark:text-white leading-tight">
			{views !== 1 ? `${views} views` : `1 view`}
		</h2>
		<h3 class="px-5 font-medium italic text-sm text-sub dark:text-sub-dark">
			{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(dates[selectedDateIdx].period))}
		</h3>
	{:else}
		{@const views = dates.reduce((a, c) => a + c.value, 0)}
		<h2 class="px-5 font-semibold text-xl text-title dark:text-white leading-tight">
			{views !== 1 ? `${views} views` : `1 view`}
		</h2>
		<h3 class="px-5 font-medium italic text-sm text-sub dark:text-sub-dark">In the last 7 days</h3>
	{/if}
	<div bind:offsetWidth={graphWidth}>
		<Graph
			bind:selected={selectedDateIdx}
			class="text-primary"
			stats={padDate(
				[
					{
						period: "2023-03-13T00:00:00.000Z",
						value: 20,
					},
					{
						period: "2023-03-14T00:00:00.000Z",
						value: 23,
					},
					{
						period: "2023-03-15T00:00:00.000Z",
						value: 14,
					},
					{
						period: "2023-03-16T00:00:00.000Z",
						value: 13,
					},
					{
						period: "2023-03-17T00:00:00.000Z",
						value: 17,
					},
				],
				1000 * 60 * 60 * 24,
				7,
			)}
			verticalPadding={20}
			height={120}
			width={graphWidth}
		/>
	</div>
</div>
