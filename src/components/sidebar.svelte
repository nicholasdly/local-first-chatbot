<script lang="ts">
  import { db } from "$lib/db";
  import { liveQuery } from "dexie";
  import { PlusIcon } from "lucide-svelte";

  const chats = liveQuery(() => db.chats.reverse().sortBy("createdAt"));
</script>

<aside class="hidden w-80 min-w-80 border-r p-4 md:block">
  <div class="sticky top-4 bottom-4 left-4 flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-semibold">SvelteKit Chatbot</h1>
      <a
        href="/"
        class="inline-flex size-8 items-center justify-center rounded-md border"
      >
        <PlusIcon class="size-4" />
      </a>
    </div>
    <div>
      <ul class="space-y-2">
        {#each $chats as chat (chat.id)}
          <li>
            <a
              class="block rounded border px-3 py-2 text-sm"
              href={`/c/${chat.id}`}
            >
              {chat.title}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</aside>
