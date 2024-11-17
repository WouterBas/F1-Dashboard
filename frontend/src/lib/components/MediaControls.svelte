<script lang="ts">
	import { Play } from 'lucide-svelte';
</script>

<div class="absolute bottom-0 flex w-full items-center justify-stretch gap-1 p-1">
	<button class="aspect-square w-8 rounded-full bg-neutral-700">
		<Play fill="#fff" class="m-auto w-3.5 translate-x-[1px]" />
	</button>
	<select class="h-fit appearance-none rounded bg-neutral-700 px-2 py-0.5">
		<option>x1</option>
		<option>x2</option>
		<option>x4</option>
	</select>
	<input type="range" class="h-1 w-full appearance-none rounded bg-neutral-500/50 accent-white" />
	<p>00:00</p>
</div>
