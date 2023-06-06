<script lang="ts">
	import IconBack from '~icons/streamline/interface-arrows-turn-backward-arrow-bend-curve-change-direction-return-left-back-backward';
	import { superForm } from 'sveltekit-superforms/client';
	import type { ActionData, PageData } from './$types';

	export let data: ActionData & PageData;

	const { form, errors } = superForm(data?.form);
</script>

<div class="flex grow w-full justify-center items-center">
	<div class="max-w-xl px-4">
		<div class="flex flex-col gap-4 items-center justify-center w-full max-w-md">
			<p class="w-full text-left h2 mb-8">
				<a href="/room">
					<IconBack />
				</a>
			</p>

			<form method="post" class="mb-12 space-y-4">
				<label class="label">
					<span>Room Name</span>
					<input
						type="text"
						name="name"
						class="input !border-primary-500"
						placeholder="Write your room name with no space"
						data-invalid={$errors.name}
						bind:value={$form.name}
					/>
					{#if $errors.name}
						<span class="text-error-500">{$errors.name}</span>
					{/if}
				</label>
				<hr />
				<label class="label">
					<span>Question Topic</span>
					<input
						type="text"
						name="topic"
						class="input"
						placeholder="Write a topic for the question"
						data-invalid={$errors.topic}
						bind:value={$form.topic}
					/>
					{#if $errors.topic}
						<span class="text-error-500">{$errors.topic}</span>
					{/if}
				</label>
				<label class="label">
					<span>Question per Player</span>
					<input
						class="input"
						type="number"
						name="questionPerPlayer"
						placeholder="Number of question a player need to make"
						data-invalid={$errors.questionPerPlayer}
						bind:value={$form.questionPerPlayer}
					/>
					{#if $errors.questionPerPlayer}
						<span class="text-error-500">{$errors.questionPerPlayer}</span>
					{/if}
				</label>
				<hr />
				<button class="btn variant-filled-primary w-full">Create Room</button>
			</form>
		</div>
	</div>
</div>
