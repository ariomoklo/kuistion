<script lang="ts">
	import PlayerAvatar from './player-avatar.svelte';
	import { useRoomStore, usePlayerTurn } from '$lib/store';

	type PlayerMeta = {
		questionCount: number;
		gameCount: number;
	};

	// export let room: App.Room | undefined = undefined;
	export let player: App.Player;
	export let meta: PlayerMeta;

	const room = useRoomStore()
	const turns = usePlayerTurn()

	let point = 0
	turns.subscribe(list => {
		const myturn = list.filter(t => t.player === player.name)
		point = myturn.reduce((p, c) => p + c.receivedPoint, 0)
	})
</script>

<header class="grow-0 flex gap-4 items-center w-full border-b border-surface-500/30">
	<PlayerAvatar name={player.name} scale={80} />
	<div class="flex flex-col items-start">
		<p class="mb-1">{player.name}</p>
		<p class="inline-flex gap-2 flex-wrap text-xs">
			{#if $room }
				{#if $room.status === 'in-play'}
					<span class="inline-flex items-center">
						<span class="bg-black text-white px-2 py-1 rounded-s-full">point</span>
						<span class="bg-primary-500 text-on-primary-token px-2 py-1 rounded-e-full"
							>{point}</span
						>
					</span>
					<!-- {#if playerRoomData.inGameInfo?.vote === true}
						<span class="inline-flex items-center">
							<span class="bg-black px-2 py-1 rounded-s-full">vote</span>
							<span class="bg-success-500 px-2 py-1 rounded-e-full">correct</span>
						</span>
					{:else if playerRoomData.inGameInfo?.vote === false}
						<span class="inline-flex items-center">
							<span class="bg-black text-white px-2 py-1 rounded-s-full">vote</span>
							<span class="bg-error-500 px-2 py-1 rounded-e-full">incorrect</span>
						</span>
					{/if}

					{#if playerRoomData.inGameInfo?.asker}
						<span class="inline-flex items-center">
							<span class="bg-primary-500 text-on-primary-token px-2 py-1 rounded-full"
								>⁉️ maker</span
							>
						</span>
					{/if} -->
				{:else if $room.status === 'waiting'}
					<p class="text-xs">
						Write min [ {$room.questionPerPlayer} ] question based on the topic
						<b class="text-primary-500">"{$room.topic}"</b>.
						<br />Then <kbd class="bg-success-500 text-on-success-token px-1">Submit</kbd> when you are
						ready. Good Luck 🔥.
					</p>
				<!-- {:else if player.inGameInfo?.ready}
					<span class="inline-flex items-center">
						<span class="bg-black text-white px-2 py-1 rounded-s-full">🙆‍♂️</span>
						<span class="bg-success-500 px-2 py-1 rounded-e-full">ready</span>
					</span> -->
				{/if}
			{:else}
				<span class="bg-primary-500 text-on-primary-token pr-2 pl-1 py-1 rounded-full"
					>{meta.questionCount} questions</span
				>
				<span class="bg-primary-500 text-on-primary-token pr-2 pl-1 py-1 rounded-full"
					>{meta.gameCount} games played</span
				>
			{/if}
		</p>
	</div>
</header>
