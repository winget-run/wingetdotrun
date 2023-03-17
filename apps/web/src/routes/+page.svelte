<script lang="ts">
	import { trpc } from "$lib/trpc/client";

	const query = trpc.publishers.list.query({});
</script>

{#if $query.isSuccess}
	<p>{JSON.stringify($query.data)}</p>
{:else if $query.isError}
	<p>{$query.error.message}</p>
{:else}
	<p>Loading...</p>
{/if}

<h1 class="text-lg">Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
