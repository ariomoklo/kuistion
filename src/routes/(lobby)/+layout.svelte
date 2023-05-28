<script>
import { Drawer, ProgressBar, drawerStore } from '@skeletonlabs/skeleton';
import { autoModeWatcher } from '@skeletonlabs/skeleton';
import SidebarTemplate from '$lib/sidebar-template.svelte';
import SidebarLobbyAction from '$lib/sidebar-lobby-action.svelte';
import SidebarRoomItem from '$lib/sidebar-room-item.svelte';
import SidebarGameItem from '$lib/sidebar-game-item.svelte';
import PlayerBanner from '$lib/player-banner.svelte';
import IconBack from "~icons/streamline/interface-arrows-turn-backward-arrow-bend-curve-change-direction-return-left-back-backward"
import IconMenuBar from '~icons/streamline/interface-setting-menu-parallel-hamburger-square-navigation-parallel-hamburger-buttonmenu-square'
import IconClose from '~icons/streamline/interface-delete-2-remove-bold-add-button-buttons-delete'

export let data
</script>

<svelte:head>{@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}</svelte:head>
<Drawer>
    <SidebarTemplate>
        <!-- Header -->
        <svelte:fragment slot="header">
            <button class="btn-icon" on:click="{() => drawerStore.close()}"><IconClose class="h2" /></button>
            <h1 class="h1 font-mono font-bold">Kuistion!</h1>
        </svelte:fragment>

        <svelte:fragment slot="content">
            {#if $$slots.content}
                <slot name="content"></slot>
            {:else}
                <small class="opacity-50">My Game Rooms</small>
                <ul>
                    <SidebarRoomItem rooms={data.rooms} />
                </ul>
            {/if}
        </svelte:fragment>

        <!-- Action -->
        <svelte:fragment slot="action">
            <SidebarLobbyAction />
        </svelte:fragment>
    </SidebarTemplate>
</Drawer>

<header class="flex gap-4 items-center lg:hidden border-b border-surface-500/30 p-4">
    <button class="btn-icon" on:click={() => drawerStore.open()}><IconMenuBar class="h1" /></button>
    <h1 class="h1 font-mono font-bold">Kuistion!</h1>
</header>

<div class="chat w-full h-full min-h-[calc(100vh-86px)] lg:min-h-screen grid grid-cols-1 lg:grid-cols-[30%_1fr] xl:grid-cols-[20%_1fr]">
    <!-- Navigation -->
    <div class="hidden lg:grid grid-rows-[auto_1fr_auto] border-r border-surface-500/30 max-h-screen">
        <SidebarTemplate>
            <!-- Header -->
            <svelte:fragment slot="header">
                {#if data.room}
                    <div class="flex flex-col w-full gap-2">
                        <a href="/room" class="inline-flex items-center w-full gap-2">
                            <IconBack class="text-xs" />
                            <span>Room List</span>
                        </a>
                    
                        <div class="bg-{data.room.status === 'in-play' ? 'success':'secondary'}-500/50 px-2 pt-1 pb-2 w-full rounded">
                            <h1 class="h3 font-mono font-bold">{data.room.name}</h1>
                            <p class="text-xs text-secondary-800-100-token">{data.room.topic}</p>
                        </div>

                        {#if data.room.status === 'ready'}
                            <button class="btn variant-filled-success">Start Game</button>
                        {:else if data.room.status === 'waiting'}
                            <button class="btn variant-filled" disabled>Waiting All Player Ready</button>
                        {:else if data.room.status === 'in-play'}
                            <ProgressBar label="Progress Bar" value={20} max={100} />
                        {:else if data.room.status === 'finish'}
                            <button class="btn variant-filled" disabled>Finished</button>
                        {/if}
                    </div>
                {:else}
                    <h1 class="h1 font-mono font-bold">Kuistion!</h1>
                {/if}
            </svelte:fragment>

            <svelte:fragment slot="content">
                {#if data.room}
                    <SidebarGameItem room="{data.room}" />
                {:else}
                    <small class="opacity-50">My Game Rooms</small>
                    <ul>
                        <SidebarRoomItem rooms={data.rooms} />
                    </ul>
                {/if}
            </svelte:fragment>

            <!-- Action -->
            <svelte:fragment slot="action">
                <SidebarLobbyAction room={data.room} />
            </svelte:fragment>
        </SidebarTemplate>
    </div>
    
    <div class="flex flex-col justify-stretch w-full h-screen min-h-screen">
        <PlayerBanner player={data.player} meta={({ questionCount: 10, gameCount: 6 })} />
        
        <slot></slot>
    </div>
</div>