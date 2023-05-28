<script lang="ts">
  import { Editor, rootCtx, defaultValueCtx, editorViewOptionsCtx } from '@milkdown/core'
  import { listener, listenerCtx } from '@milkdown/plugin-listener'
  import { commonmark } from '@milkdown/preset-commonmark'
  import { createEventDispatcher } from 'svelte'
  import { nord } from '@milkdown/theme-nord'

  export let markdown = ''
  export let readonly = false

  const editable = () => !readonly
  const dispatch = createEventDispatcher()

  function editor(dom: Node) {
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, dom)
        ctx.set(defaultValueCtx, markdown)
        ctx.set(editorViewOptionsCtx, { editable })

        const l = ctx.get(listenerCtx);

        l.markdownUpdated((_, md, prev) => {
          if (md !== prev) {
            dispatch('change', { md, prev });
          }
        })
      })
      .config(nord)
      .use(listener)
      .use(commonmark)
      .create()
  }
</script>

<div use:editor class="w-full border-2 border-surface-500 rounded bg-surface-700 p-4" />