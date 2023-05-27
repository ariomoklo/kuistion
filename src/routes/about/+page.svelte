<script>
    import Content from "$lib/about-content.svelte"
    import IconHome from "~icons/streamline/interface-home-2-door-entrance-home-house-map-roof-round"
</script>

<div class="flex flex-col gap-4 items-center justify-center w-full h-full min-h-screen">
    <div class="container max-w-lg">

        <div class="container max-w-md">
            <h1 class="h1 font-mono text-center">About</h1>
            <hr class="mt-8 mb-2">
            <p>made with <a href="https://kit.svelte.dev" class="font-bold font-mono text-orange-600">SvelteKit</a>, by <a href="https://github.com/ariomoklo" target="_blank" class="text-primary-500 hover:text-secondary-500">ariomoklo 🤖</a></p>
        </div>

        <br>

        <Content />

        <a href="/" class="btn !justify-stretch variant-filled w-full mt-6">
            <span class="grow-0"><IconHome class="text-md" /></span>
            <p class="text-center grow">Back to Home</p>
        </a>
    </div>
</div>