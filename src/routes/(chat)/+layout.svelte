<script lang="ts">
  import Sidebar from "$components/sidebar.svelte";

  let { children } = $props();
</script>

<div class="flex">
  <Sidebar />
  <main class="mx-auto min-h-dvh w-full px-4 pt-4 md:max-w-3xl">
    {@render children()}
  </main>
</div>
