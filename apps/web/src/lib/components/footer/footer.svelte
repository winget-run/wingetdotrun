<script lang="ts">
	import Logo from "../svg/logo.svelte";

	const links = {
		"About winget": "https://docs.microsoft.com/en-us/windows/package-manager/",
		GitHub: "https://github.com/winget-run/wingetdotrun",
		Twitter: "https://twitter.com/feinwaru",
		"Buy us a coffee": "https://ko-fi.com/wingetdotrun",
	};
</script>

<footer class="py-8 bg-card p-4 rounded-[1.25rem] flex flex-col items-center text-body mt-10 border-t border-white/10">
	<ul class="flex gap-4 mb-8">
		{#each Object.entries(links) as [text, href]}
			<li>
				<a class="hover:underline" {href}>{text}</a>
			</li>
		{/each}
	</ul>
	<Logo />
	<small class="text-sm text-subtitle mt-3"> Made with ❤ in Belfast and Dublin </small>
</footer>
