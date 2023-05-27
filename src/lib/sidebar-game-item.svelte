<script lang="ts">
export let room: App.Room
</script>

<ul class="space-y-2">
    {#each room.players as player, i}
        <li class="py-2 px-2 bg-primary-500/20 rounded-lg">
            <p class="mb-1">{player.name} {player.host ? '[🤖:host]' : ''} {player.winner ? '[🏆:winner]' : ''}</p>
            <p class="inline-flex gap-2 flex-wrap text-xs">
                <span class="inline-flex items-center">
                    <span class="bg-black text-white px-2 py-1 rounded-s-full">point</span>
                    <span class="bg-primary-500 text-on-primary-token px-2 py-1 rounded-e-full">{player.point}</span>
                </span>
                
                {#if room.status === 'in-play'}
                    {#if player.vote === true}
                        <span class="inline-flex items-center">
                            <span class="bg-black px-2 py-1 rounded-s-full">vote</span>
                            <span class="bg-success-500 px-2 py-1 rounded-e-full">correct</span>
                        </span>
                    {:else if  player.vote === false}
                        <span class="inline-flex items-center">
                            <span class="bg-black text-white px-2 py-1 rounded-s-full">vote</span>
                            <span class="bg-error-500 px-2 py-1 rounded-e-full">incorrect</span>
                        </span>
                    {/if}

                    {#if player.asker}
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
                    {:else}
                        <span class="inline-flex items-center">
                            <span class="bg-black text-white px-2 py-1 rounded-s-full">🙆‍♂️</span>
                            <span class="bg-warning-500 text-on-warning-token px-2 py-1 rounded-e-full">waiting</span>
                        </span>
                    {/if}
                {/if}


            </p>
        </li>
    {/each}
</ul>