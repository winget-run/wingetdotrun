<script lang="ts">
	import { enhance } from "$app/forms";

	let form: any;
	let packages: any[] = [];
</script>

<div class="grid h-100 place-content-center">
	<form
		bind:this={form}
		method="POST"
		on:submit|preventDefault
		action="?/search"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type !== "success") {
					return;
				}

				packages = (result as any).data.packages;
			};
		}}
	>
		<input on:input={() => form.requestSubmit()} name="query" class="mb-10 bg-pink-200" />
	</form>

	{#each packages as pkg}
		<div>
			<p>{pkg.ident}</p>
			<p class="bg-sky-50">{pkg.shortDescription}</p>
		</div>
	{/each}
</div>
