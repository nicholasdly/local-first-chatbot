<script lang="ts">
  import { useChat } from "@ai-sdk/svelte";
  import { db } from "$lib/db";
  import { generateId, type Message } from "ai";
  import { add } from "dexie";
  import { onMount, afterUpdate } from "svelte";
  import { replaceState } from "$app/navigation";

  export let id = generateId();
  export let initialMessages: Message[] = [];

  let bottomed: boolean = false;
  let userMessage: Message | undefined = undefined;

  const { input, messages, handleSubmit, isLoading } = useChat({
    id,
    initialMessages,
    onFinish: async (assistantMessage) => {
      const chat = await db.chats.get(id);

      if (chat) {
        db.chats.update(id, {
          messages: add([userMessage!, assistantMessage]),
        });
      } else {
        db.chats.add({
          id,
          title: userMessage!.content.slice(0, 80),
          messages: [userMessage!, assistantMessage],
          createdAt: new Date(),
        });
      }

      replaceState("", `/c/${id}`);
    },
  });

  const submit = async (event?: { preventDefault: () => void }) => {
    event?.preventDefault();
    if (!$input) return;

    userMessage = {
      id: generateId(),
      role: "user",
      content: $input,
      createdAt: new Date(),
    };

    handleSubmit();
  };

  onMount(() => {
    window.addEventListener("scroll", () => {
      const documentHeight = document.documentElement.scrollHeight;
      const distanceScrolled = document.documentElement.scrollTop;
      const viewportHeight = document.documentElement.clientHeight;
      const buffer = 10;

      bottomed = documentHeight - distanceScrolled <= viewportHeight + buffer;
    });
  });

  afterUpdate(() => {
    if (bottomed) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "instant",
      });
    }
  });
</script>

<div class="flex size-full flex-col gap-4">
  <ul class="flex flex-1 flex-col gap-2">
    {#each $messages as message (message.id)}
      {#if message.role === "user"}
        <li
          class="ml-auto rounded-md bg-black px-3 py-2 text-base whitespace-pre-line text-white"
        >
          {message.content}
        </li>
      {:else if message.role === "assistant"}
        <li
          class="mr-auto rounded-md border px-3 py-2 text-base whitespace-pre-line"
        >
          {message.content}
        </li>
      {/if}
    {/each}
  </ul>

  <form
    class="sticky bottom-0 flex flex-col gap-2 rounded-t-md bg-white pb-4"
    onsubmit={submit}
  >
    <textarea
      class="field-sizing-content min-h-10 resize-none rounded-md border px-3 py-2"
      bind:value={$input}
      maxlength="1000"
      onkeydown={(event) => {
        if (event.key === "Enter" && !event.shiftKey && !$isLoading) {
          event.preventDefault();
          submit();
        }
      }}
    ></textarea>
    <button
      class="ml-auto w-fit rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      type="submit"
      disabled={$isLoading}
    >
      Send
    </button>
  </form>
</div>
