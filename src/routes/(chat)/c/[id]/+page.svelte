<script lang="ts">
  import Chat from "$components/chat.svelte";
  import type { PageProps } from "./$types";

  let { data: chat }: PageProps = $props();
</script>

{#key chat.id}
  <Chat id={chat.id} initialMessages={chat.messages} />
{/key}
