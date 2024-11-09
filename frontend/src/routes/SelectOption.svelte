<script lang="ts">
	import { ChevronDown } from 'lucide-svelte';

	let { label }: { label: string } = $props();
</script>

<div>
	<label for={label} class="text-base sm:text-lg">{label}</label>
	<div class="relative">
		<select id={label} class="w-full appearance-none rounded bg-neutral-700 px-3 py-1.5">
			<option value="">choose a pet</option>
			<option value="dog">Dog</option>
			<option value="cat">Cat</option>
			<option value="hamster">Hamster</option>
			<option value="parrot">Parrot</option>
			<option value="spider">Spider</option>
			<option value="goldfish">Goldfish</option>
		</select>
		<ChevronDown class="absolute right-2 top-1.5" />
	</div>
</div>
