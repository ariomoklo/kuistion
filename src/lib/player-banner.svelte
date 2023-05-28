<script lang="ts">
    import PlayerAvatar from "./player-avatar.svelte";

    type PlayerMeta = {
        questionCount: number
        gameCount: number
    }

    export let player: App.Player
    export let meta: PlayerMeta
</script>

<header class="grow-0 flex gap-4 items-center w-full border-b border-surface-500/30">
    <PlayerAvatar name={player.name} scale={80} />
    <div class="flex flex-col items-start">
        <p class="mb-1">{player.name}</p>
        <p class="inline-flex gap-2 flex-wrap text-xs">
            <span class="bg-primary-500 text-on-primary-token pr-2 pl-1 py-1 rounded-full">{meta.questionCount} questions</span>
            <span class="bg-primary-500 text-on-primary-token pr-2 pl-1 py-1 rounded-full">{meta.gameCount} questions</span>
        </p>            
    </div>
</header>
