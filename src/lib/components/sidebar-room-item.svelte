<script lang="ts">
	export let rooms: App.Room[];
</script>

{#each rooms as room, i}
	<li class="hover:bg-primary-500/20 hover:rounded cursor-pointer pt-1 pb-2 px-2">
		<a href="/{room.host}/{room.name}" data-sveltekit-reload class="flex flex-col items-start">
			<p class="mb-1">{room.name}</p>
			<p class="inline-flex gap-2 flex-wrap text-xs">
				<span class="inline-flex items-center">
					<span class="bg-black text-white px-2 py-1 rounded-s-full"
						>{room.questionPerPlayer}</span
					>
					<span class="bg-primary-500 text-on-primary-token pr-2 pl-1 py-1 rounded-e-full"
						>questions</span
					>
				</span>
				<span class="inline-flex items-center">
					{#if room.status === 'ready'}
						<span class="bg-success-500 text-on-success-token pr-2 pl-1 py-1 rounded-full"
							>🙆‍♂️ ready all</span
						>
					{:else if room.status === 'in-play'}
						<span class="bg-warning-500 text-on-warning-token px-2 py-1 rounded-full">Running</span>
					{:else if room.status === 'finish'}
						<span class="bg-black text-white px-2 py-1 rounded-full">finished</span>
					{:else}
						<span class="bg-black text-white px-2 py-1 rounded-s-full"
							>{ Object.entries(room.playerReadyState).filter(([_,v]) => v).length }</span
						>
						<span class="bg-success-500 text-on-success-token pr-2 pl-1 py-1 rounded-e-full"
							>🙆‍♂️ ready</span
						>
					{/if}
				</span>
			</p>
		</a>
	</li>
{/each}

{#if rooms.length === 0}
	<li>
		<p class="text-xs text-center opacity-20">Room not found. Create or join room to play!</p>
	</li>
{/if}