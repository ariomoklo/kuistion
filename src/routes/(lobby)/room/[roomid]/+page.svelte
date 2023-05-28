<script lang="ts">
import QuestionEditor from "$lib/question-editor.svelte";
export let data

const factory = (index: number): App.Question => ({ id: index+'', question: '', maker: data.player, choices: [] })
const questions = new Array(data.room?.questionPerPlayer ?? 1).fill(true).map((_, i) => factory(i))
</script>

<div class="grow w-full overflow-auto">
    {#if data.player.ready}

        {#if data.room?.status === 'waiting'}
            <div class="flex w-full h-full m-auto items-center justify-center">
                <p>Waiting for other player</p>
            </div>
        {/if}

        <!-- content here -->

    {:else}
        <div class="mx-auto max-w-3xl p-4 space-y-8">
            {#each questions as question, index}
                <QuestionEditor {question} index={index+1} />
            {/each}
        </div>
    {/if}
</div>

<footer class="grow-0 text-right w-full p-4 border-t border-surface-500/30">
    <button class="btn variant-filled-success"><span class="mx-8">Submit & Ready</span></button>
</footer>