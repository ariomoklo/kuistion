<script lang="ts">
export let rooms: App.Room[]

function countReadyPlayer(players: App.Player[] = []) {
    return players.reduce((count: number, player: App.Player) => {
        if (player.ready) count++
        return count
    }, 0)
}
</script>

{#each rooms as game, i}
    <li class="hover:bg-primary-500/20 hover:rounded cursor-pointer pt-1 pb-2 px-2">
        <a href="/room/{game.name}" class="flex flex-col items-start">
            <p class="mb-1">{game.name}</p>
            <p class="inline-flex gap-2 flex-wrap text-xs">
                <span class="inline-flex items-center">
                    <span class="bg-black text-white px-2 py-1 rounded-s-full">{game.questions.length}</span>
                    <span class="bg-primary-500 text-on-primary-token pr-2 pl-1 py-1 rounded-e-full">questions</span>
                </span>
                <span class="inline-flex items-center">
                    {#if game.status === 'ready'}
                        <span class="bg-success-500 text-on-success-token pr-2 pl-1 py-1 rounded-full">🙆‍♂️ ready all</span>
                    {:else if game.status === 'in-play'}
                        <span class="bg-warning-500 text-on-warning-token px-2 py-1 rounded-full">Running</span>   
                    {:else if game.status === 'finish'}
                        <span class="bg-black text-white px-2 py-1 rounded-full">finished</span>   
                    {:else}
                        <span class="bg-black text-white px-2 py-1 rounded-s-full">{countReadyPlayer(game.players)}</span>
                        <span class="bg-success-500 text-on-success-token pr-2 pl-1 py-1 rounded-e-full">🙆‍♂️ ready</span>
                    {/if}
                </span>
            </p>            
        </a>
    </li>
{/each}