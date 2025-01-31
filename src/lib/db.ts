import { type Message } from "ai";
import Dexie, { type EntityTable } from "dexie";

interface Chat {
  id: string;
  messages: Message[];
  title: string;
  createdAt: Date;
}

const db = new Dexie("svelte-chat") as Dexie & {
  chats: EntityTable<Chat, "id">;
};

db.version(1).stores({
  chats: "id",
});

export type { Chat };
export { db };
