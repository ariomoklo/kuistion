<script lang="ts">
import PlayerAvatar from './player-avatar.svelte';
export let room: App.Room
export let user: App.Player

$: players = room.players.filter(p => p.id !== user.id)
</script>

<ul class="space-y-2">
    {#each players as player, i}
        <li class="flex items-center gap-2 py-2 px-2 bg-primary-500/20 rounded-lg">
            <PlayerAvatar name={player.name} scale={60} rounded="md" />

            <article>
                <p class="mb-1">{player.name} {player.host ? '[🤖:host]' : ''} {player.winner ? '[🏆:winner]' : ''}</p>
                <p class="inline-flex gap-2 flex-wrap text-xs">

                    
                    {#if room.status === 'in-play'}
                        
                        <span class="inline-flex items-center">
                            <span class="bg-black text-white px-2 py-1 rounded-s-full">point</span>
                            <span class="bg-primary-500 text-on-primary-token px-2 py-1 rounded-e-full">{player.point}</span>
                        </span>

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
                                <span class="bg-warning-500 text-on-warning-token px-2 py-1 rounded-e-full">not ready</span>
                            </span>
                        {/if}
                    {/if}
                </p>
            </article>
        </li>
    {/each}
</ul>