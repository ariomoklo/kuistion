<script>
// @ts-nocheck

    export let form
</script>

<div class="flex flex-col gap-4 items-center justify-center w-full h-full min-h-screen">
    <div class="container max-w-md text-center">
        <h1 class="h1 font-mono text-center">Kuistion!</h1>
        <hr class="mt-8 mb-4">
    </div>

    <form method="POST" class="container max-w-md">
        
        {#if form?.errors.form.length > 0 }
            <p class="block bg-error-500 text-on-error-token px-2 py-1 w-full mb-4">{ form?.errors.form.join(', ') }</p>
        {/if}

        <label class="label mb-8">
            <span>Enter your name to join</span>
            <input class="input" name="name" type="text" placeholder="example: PeterParker" value={form?.name ?? ''} />
            
            {#if form?.errors.name.length > 0}
                <small class="block bg-error-500 text-on-error-token px-2 py-1 w-full">{form?.errors.name.join(', ')}</small>
            {:else}
                <small>alphanumeric with no spaces</small>
            {/if}

        </label>

        <!-- <input type="hidden" name="refresh" value={form?.refresh ?? ''}> -->
        <button type="submit" class="btn variant-filled-primary w-full">Enter</button>
    </form>
</div>