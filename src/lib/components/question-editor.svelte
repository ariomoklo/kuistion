<script lang="ts">
	import { get, writable } from 'svelte/store';
	import Milkdown from './milkdown.svelte';
	import IconTrashCan from '~icons/streamline/interface-delete-bin-2-remove-delete-empty-bin-trash-garbage';
	import IconCheck from '~icons/streamline/interface-validation-check-square-1-check-form-validation-checkmark-success-add-addition-box-square';

	export let editable: boolean = false;
	export let index: number | null = null;
	export let question: App.Question;

	const labels = 'ABCDE'.split('');
	let text: string = question.question;
	const placeholder = `write your question here using markdown,
then checked (✅) one of the answer as the correct answer 👍`;

	type Choice = { id: string; text: string; correct?: boolean };
	let choices = writable<Choice[]>(
		labels.slice(0, 2).map((c) => ({ id: c, text: '', correct: false }))
	);
	if (question.choices.length > 0) {
		choices.set(question.choices);
	}

	function handleToggleChecked(choice: Choice) {
		const temp = get(choices).map((c) => {
			if (c.id === choice.id) return { ...choice, correct: !choice.correct };
			if (!choice.correct === true) return { ...c, correct: false };
			return c;
		});

		choices.set(temp);
	}
</script>

<div class="QuestionEditor flex flex-col gap-4 w-full">
	<div class="w-full">
		<p class="label">Question {index === null ? '' : index}</p>
		<p class="mb-2 text-xs">{placeholder}</p>
		<Milkdown bind:markdown={text} readonly={editable !== true} />
	</div>
	{#each $choices as choice, index}
		<div
			class="input-group input-group-divider grid-cols-[auto_1fr_auto] cursor-pointer {choice.correct
				? '!bg-success-500/40'
				: ''}"
		>
			{#if editable}
				<div class="input-group-shim">{labels[index]}</div>
				<input type="text" bind:value={choice.text} placeholder="Choice Answer {labels[index]}" />
			{:else}
				<button
					class="input-group-shim w-[50px]"
					on:click={() => {
						if (!editable) handleToggleChecked(choice);
					}}><p class="text-center w-full">{labels[index]}</p></button
				>
				<button
					class="py-3 px-4"
					on:click={() => {
						if (!editable) handleToggleChecked(choice);
					}}>{choice.text}</button
				>
			{/if}

			<div class="inline-flex items-center !p-0">
				{#if choice.correct}
					<button on:click={() => handleToggleChecked(choice)}>
						<IconCheck class="text-on-success-token bg-success-500 rounded" />
					</button>
				{:else}
					<button on:click={() => handleToggleChecked(choice)}>
						<IconCheck class="text-on-success-token rounded" />
					</button>
				{/if}

				{#if editable}
					<button
						on:click={() => {
							const c = get(choices);
							c.splice(index, 1);

							choices.set(c);
						}}
						class="h-full border-l border-surface-500"
					>
						<IconTrashCan class="text-red-500" />
					</button>
				{/if}
			</div>
		</div>
	{/each}

	{#if $choices.length < 5}
		<button
			class="btn variant-filled-primary"
			on:click={() => {
				const c = get(choices);
				c.push({ id: labels[c.length], text: '', correct: false });
				choices.set(c);
			}}>Add Choice</button
		>
	{/if}
</div>
