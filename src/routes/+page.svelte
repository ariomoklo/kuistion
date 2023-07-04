<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { useLocalSession } from '$utils/storage';
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let data: PageData;
	const { form, errors } = superForm(data.form)

	let formRef: HTMLFormElement;
	let onLocalSessionCheck = true;

	onMount(() => {
		const session = useLocalSession();
		const sesdat = session.load();

		form.set({ 
			name: sesdat.name ?? '',
			refresh: sesdat.token ?? ''
		})

		if (sesdat.name && sesdat.token) {
			if (data.form.posted) {
				formRef.submit();
			}
		}

		onLocalSessionCheck = false;
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

		{#if $errors._errors }
			<p class="block bg-error-500 text-on-error-token px-2 py-1 w-full mb-4">
				{$errors._errors.join(', ')}
			</p>
		{/if}

		<label class="label mb-8">
			{#if $form.refresh}
				<span>Welcome back</span>
			{:else}
				<span>Enter your name to join</span>
			{/if}

			<input
				type="text"
				name="name"
				class="input"
				disabled={!!$form.refresh}
				placeholder="example: PeterParker"
				bind:value={$form.name}
			/>

			{#if $errors.name }
				<small class="block bg-error-500 text-on-error-token px-2 py-1 w-full"
					>{$errors.name.join(', ')}</small
				>
			{:else if !$form.refresh}
				<small>alphanumeric with no spaces</small>
			{/if}
		</label>

		{#if $form.refresh}
			<input type="hidden" name="refresh" bind:value={$form.refresh} />
		{:else}
			<button type="submit" class="btn variant-filled-primary w-full">Enter</button>
		{/if}
	</form>
</div>
