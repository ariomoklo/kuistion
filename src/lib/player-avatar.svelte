<script lang="ts">
    export let name: string
    export let scale: number
    export let rounded: 'none' | 'md' | 'lg' | 'full' = 'none'
</script>
<img
  src="https://api.dicebear.com/6.x/bottts-neutral/svg?seed={name}"
  class="{rounded === 'none' ? '':'rounded-'+rounded }"
  style="width: {scale}px;"
  alt="avatar">