import type { APIRoute } from "astro";
import { getPasswords } from "../../lib/repositories/passwords";

export const GET: APIRoute = () => {
  const passwords = getPasswords();

  return new Response(JSON.stringify(passwords), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
