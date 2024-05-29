import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const GET: APIRoute = async ({ params, redirect }) => {
  const { session } = (await supabase.auth.getSession()).data;

  if (!session) {
    redirect("/login");
  }

  const userId = session!.user.id;
  const id = params.id as string;

  let { data: passwords, error } = await supabase
    .from("passwords")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(passwords![0]), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
