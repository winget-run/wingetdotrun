<script>
	import Button from "../button/button.svelte";
	import IconGithub from "~icons/lucide/github";
	import IconHeart from "~icons/lucide/heart";
	import { tippy } from "$lib/actions";
</script>

<nav class="fixed top-0 left-0 w-full z-50 h-[72px] bg-background bg-opacity-60 backdrop-blur border-b border-white/10">
	<div class="container px-5 mx-auto h-full">
		<div class="flex justify-between items-center h-full">
			<div class="flex items-center">
				<a title="Homepage" href="/" aria-label="Homepage">
					<svg width="34" height="39" viewBox="0 0 34 39" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M16.9301 19.5701V38M16.9301 19.5701L33 10.1444M16.9301 19.5701L1 10.1444M16.9301 38L33 28.8556M16.9301 38L1 28.8556M33 10.1444V28.8556M33 10.1444L16.9301 1M33 28.8556L25.5939 24.4943M16.9301 1L1 10.1444M16.9301 1V9.30015M1 10.1444V28.8556M1 28.8556L8.40607 24.4943M8.40607 24.4943L8.40605 14.5057L16.9301 9.30015M8.40607 24.4943L16.9301 29.4184L25.5939 24.4943M25.5939 24.4943L25.594 14.5057L16.9301 9.30015"
							stroke="#4DCAEB"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</a>
				<!-- <ul
          id="main-nav"
          aria-label="Main Navigation"
          role="menubar"
          class="flex items-center ml-8 gap-5"
        >
          {#each items as { title, href }}
            <li role="none">
              <a role="menuitem" {href} class="font-medium text-grey-700">
                {title}
              </a>
            </li>
          {/each}
        </ul> -->
			</div>
			<ul id="cta-nav" aria-label="CTA Buttons" class="flex items-center gap-3">
				<li use:tippy={{ content: "Star us on GitHub" }} role="none">
					<Button
						href="https://github.com/winget-run/wingetdotrun"
						size="sm"
						role="menuitem"
						outlined
						class="!px-0 h-[42px] w-[42px]"
					>
						<IconGithub />
					</Button>
				</li>
				<li role="none">
					<Button href="https://aka.ms/getwinget" size="sm" role="menuitem" outlined>Install winget</Button>
				</li>
				<li role="none">
					<Button href="https://ko-fi.com/wingetdotrun" size="sm" role="menuitem">
						<IconHeart />
						Support Us
					</Button>
				</li>
			</ul>
		</div>
	</div>
</nav>
