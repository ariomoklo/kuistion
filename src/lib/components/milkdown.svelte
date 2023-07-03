<script lang="ts">
	import {
		Editor,
		rootCtx,
		defaultValueCtx,
		editorViewOptionsCtx,
		commandsCtx,
		EditorStatus
	} from '@milkdown/core';
	import { listener, listenerCtx } from '@milkdown/plugin-listener';
	import { commonmark } from '@milkdown/preset-commonmark';
	import { createEventDispatcher } from 'svelte';
	import { nord } from '@milkdown/theme-nord';

	export let markdown = '';
	export let readonly = false;

	let status = EditorStatus.Idle;
	let lines = 0;

	const editable = () => !readonly;
	const dispatch = createEventDispatcher();

	function editor(dom: Node) {
		const ed = Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, dom);
				ctx.set(defaultValueCtx, markdown);
				ctx.set(editorViewOptionsCtx, {
					editable,
					attributes: () => ({ class: 'prose-sm' })
				});

				const l = ctx.get(listenerCtx);

				l.markdownUpdated((_, md, prev) => {
					if (md !== prev) {
						dispatch('change', { md, prev });
					}
				});

				l.updated((ctx, doc) => {
					lines = doc.childCount;
					status = ed.status;
				});

				l.focus((ctx) => {
					status = ed.status;
					dispatch('focus', ctx);
				});

				l.blur((ctx) => {
					status = ed.status;
					dispatch('blur', ctx);
				});
			})
			.config(nord)
			.use(listener)
			.use(commonmark);

		ed.create();
	}
</script>

<div class="relative w-full border-2 border-surface-500 rounded bg-surface-700">
	<div use:editor class="p-4" />
	<div class="flex items-center justify-between px-4 py-2">
		<p class="text-xs">lines: {lines}</p>
		<p class="text-xs">{status}</p>
	</div>
</div>
