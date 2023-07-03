<script>
    import Content from "$components/about-content.svelte"
</script>

<div class="flex grow w-full justify-center items-center">
    <div class="max-w-xl px-4">
        <h3 class="h3 font-mono"># Hello, welcome to <b class="text-primary-500 underline underline-offset-4">kuistion!</b></h3>
        <p>made with <a href="https://kit.svelte.dev" class="font-bold font-mono text-orange-600">SvelteKit</a>, by <a href="https://github.com/ariomoklo" target="_blank" class="text-primary-500 hover:text-secondary-500">ariomoklo 🤖</a></p>
        
        <br>
        
        <Content />
    </div>
</div>

