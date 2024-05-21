import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(["1", "earth", "falsetrue"]));
};
