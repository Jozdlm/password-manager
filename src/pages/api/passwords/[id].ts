import type { APIRoute } from "astro";
import { getPasswordById } from "../../../lib/repositories/passwords";

export const GET: APIRoute = ({ params }) => {
  const id = params.id as string;
  const password = getPasswordById(id);

  if (!password) {
    return new Response(
      JSON.stringify({
        error: "Record not found",
      }),
      {
        status: 404,
        statusText: "Not found",
      }
    );
  }

  return new Response(JSON.stringify(password), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
