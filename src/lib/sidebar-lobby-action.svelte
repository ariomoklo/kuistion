<script lang="ts">
	import { page } from '$app/stores';
	export let room: App.Room | undefined = undefined;
</script>

{#if room}
	{#if !$page.url.pathname.endsWith('about')}
		<a href="/room/about" class="btn variant-filled w-full">About</a>
	{:else}
		<a href="/{room.host.name}/{room.name}" class="btn variant-filled w-full">Back to Game</a>
	{/if}
	<a href="/{room.host.name}/{room.name}/forfeit" class="btn variant-filled-secondary w-full"
		>Forfeit</a
	>
{:else}
	<!-- Create Room Action -->
	{#if $page.url.pathname !== '/room/create'}
		<a href="/room/create" class="btn variant-filled w-full">Create Room</a>
	{/if}

	<!-- Join Room Action -->
	{#if $page.url.pathname !== '/room/join'}
		<a href="/room/join" class="btn variant-filled w-full">Join Room</a>
	{/if}
{/if}
