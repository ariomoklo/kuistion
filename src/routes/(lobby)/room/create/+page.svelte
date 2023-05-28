<script>
    import IconBack from "~icons/streamline/interface-arrows-turn-backward-arrow-bend-curve-change-direction-return-left-back-backward"
</script>

<div class="flex grow w-full justify-center items-center">
    <div class="max-w-xl px-4">
        <div class="flex flex-col gap-4 items-center justify-center w-full max-w-md">
        
            <p class="w-full text-left h2 mb-8">
                <a href="/room">
                    <IconBack />
                </a>
            </p>
        
            <form class="mb-12 space-y-4">
                <label class="label">
                    <span>Room Name</span>
                    <input class="input !border-primary-500" type="text" placeholder="Write your room name with no space" />
                </label>
                <hr>
                <label class="label">
                    <span>Question Topic</span>
                    <input class="input" type="text" placeholder="Write a topic for the question" />
                </label>
                <label class="label">
                    <span>Question per Player</span>
                    <input class="input" type="number" placeholder="Number of question a player need to make" min="1" />
                </label>
                <hr>
                <a href="/room" class="btn variant-filled-primary w-full">Create Room</a>
            </form>
        </div>
    </div>
</div>
