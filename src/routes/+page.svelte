<script lang="ts">
	import { useLocalSession } from '$utils/storage';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let formRef: HTMLFormElement;
	let onLocalSessionCheck = true;
	let name = form?.name;
	let refresh = form?.refresh;

	onMount(() => {
		const session = useLocalSession();
		const sesdat = session.load();

		name = sesdat.name;
		refresh = sesdat.token;

		if (name && refresh) {
			if (form?.errors?.status !== 'error') {
				setTimeout(() => {
					formRef.submit();
				}, 1500);
			}
		}

		setTimeout(() => {
			onLocalSessionCheck = false;
		}, 1000);
	});
</script>

<div class="flex flex-col gap-4 items-center justify-center w-full h-full min-h-screen">
	<div class="container max-w-md text-center">
		<h1 class="h1 font-mono text-center">Kuistion!</h1>
		<hr class="mt-8 mb-4" />
	</div>

	<form bind:this={formRef} method="POST" class="container relative max-w-md">
		{#if onLocalSessionCheck}
			<div
				transition:fade={{ duration: 100 }}
				class="absolute flex flex-col gap-2 items-center justify-center bg-surface-900 w-full h-full z-10"
			>
				<p class="animate-pulse">Checking Local Session</p>
				<p class="animate-bounce">😁😁😁</p>
			</div>
		{/if}

		{#if form?.errors.form.length}
			<p class="block bg-error-500 text-on-error-token px-2 py-1 w-full mb-4">
				{form?.errors.form.join(', ')}
			</p>
		{/if}

		<label class="label mb-8">
			{#if refresh}
				<span>Welcome back</span>
			{:else}
				<span>Enter your name to join</span>
			{/if}

			<input type="hidden" bind:value={name} name="name" />

			<input
				class="input"
				type="text"
				disabled={!!refresh}
				placeholder="example: PeterParker"
				bind:value={name}
			/>

			{#if form?.errors.name.length}
				<small class="block bg-error-500 text-on-error-token px-2 py-1 w-full"
					>{form?.errors.name.join(', ')}</small
				>
			{:else if !refresh}
				<small>alphanumeric with no spaces</small>
			{/if}
		</label>

		{#if refresh}
			<input type="hidden" name="refresh" bind:value={refresh} />
		{:else}
			<button type="submit" class="btn variant-filled-primary w-full">Enter</button>
		{/if}
	</form>
</div>
