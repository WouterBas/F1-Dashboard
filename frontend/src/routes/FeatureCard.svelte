<script lang="ts">
	let { title, text } = $props();
</script>

<div class="rounded bg-neutral-800 px-3 py-2">
	<h3 class="text-lg font-bold uppercase">{title}</h3>
	<p class="font-sans text-sm">
		{text}
	</p>
</div>
