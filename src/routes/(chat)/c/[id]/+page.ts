import { db } from "$lib/db";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
  const chat = await db.chats.get(params.id);

  if (!chat) error(404, "Not found");

  return chat;
};
