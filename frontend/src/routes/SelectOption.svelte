<script lang="ts">
	import { ChevronDown } from 'lucide-svelte';

	type Props = { label: string; options: { name: string; value: number }[]; value: number };

	let { label, options, value = $bindable() }: Props = $props();
</script>

<div>
	<label for={label} class="text-base sm:text-lg">{label}</label>
	<div class="relative">
		<select
			id={label}
			bind:value
			class="w-full appearance-none rounded bg-neutral-700 px-3 py-1.5 outline-none focus:ring-2 focus:ring-neutral-500"
		>
			{#each options as { name, value }}
				<option {value}>{name}</option>
			{/each}
		</select>
		<ChevronDown class="absolute right-2 top-1.5" />
	</div>
</div>
