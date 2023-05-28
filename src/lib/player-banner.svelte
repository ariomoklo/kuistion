<script lang="ts">
    import PlayerAvatar from "./player-avatar.svelte";

    type PlayerMeta = {
        questionCount: number
        gameCount: number
    }

    export let room: App.Room | undefined = undefined
    export let player: App.Player
    export let meta: PlayerMeta

    function extractPlayerRoomData(roomData: App.Room | undefined) {
        if (!roomData) return player
        return room?.players.find(p => p.id === player.id) ?? player
    }

    $: playerRoomData = extractPlayerRoomData(room)
</script>

<header class="grow-0 flex gap-4 items-center w-full border-b border-surface-500/30">
    <PlayerAvatar name={player.name} scale={80} />
    <div class="flex flex-col items-start">
        <p class="mb-1">{player.name}</p>
        <p class="inline-flex gap-2 flex-wrap text-xs">

            {#if room}
                <span class="inline-flex items-center">
                    <span class="bg-black text-white px-2 py-1 rounded-s-full">point</span>
                    <span class="bg-primary-500 text-on-primary-token px-2 py-1 rounded-e-full">{playerRoomData.point}</span>
                </span>
                
                {#if room.status === 'in-play'}
                    {#if playerRoomData.vote === true}
                        <span class="inline-flex items-center">
                            <span class="bg-black px-2 py-1 rounded-s-full">vote</span>
                            <span class="bg-success-500 px-2 py-1 rounded-e-full">correct</span>
                        </span>
                    {:else if playerRoomData.vote === false}
                        <span class="inline-flex items-center">
                            <span class="bg-black text-white px-2 py-1 rounded-s-full">vote</span>
                            <span class="bg-error-500 px-2 py-1 rounded-e-full">incorrect</span>
                        </span>
                    {/if}

                    {#if playerRoomData.asker}
                        <span class="inline-flex items-center">
                            <span class="bg-primary-500 text-on-primary-token px-2 py-1 rounded-full">⁉️ maker</span>
                        </span>
                    {/if}
                {:else}
                    {#if player.ready}
                        <span class="inline-flex items-center">
                            <span class="bg-black text-white px-2 py-1 rounded-s-full">🙆‍♂️</span>
                            <span class="bg-success-500 px-2 py-1 rounded-e-full">ready</span>
                        </span>
                    {/if}
                {/if}
            {:else}
                <span class="bg-primary-500 text-on-primary-token pr-2 pl-1 py-1 rounded-full">{meta.questionCount} questions</span>
                <span class="bg-primary-500 text-on-primary-token pr-2 pl-1 py-1 rounded-full">{meta.gameCount} questions</span>
            {/if}

        </p>            
    </div>
</header>
