<!-- Header -->
<header class="flex gap-4 items-center border-b border-surface-500/30 p-4">
    <slot name="header"></slot>
</header>

<!-- List -->
<div class="p-4 space-y-4 overflow-y-auto">
    <slot name="content"></slot>
</div>

<!-- Action -->
{#if $$slots.action}
    <div class="flex flex-col gap-2 p-4 border-t border-success-500/30">
        <slot name="action"></slot>
    </div>
{/if}