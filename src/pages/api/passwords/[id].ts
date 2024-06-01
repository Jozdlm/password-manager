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

export const POST: APIRoute = async ({ params, redirect, request }) => {
  const formData = await request.formData();
  const id = params.id;

  const url = formData.get("url")?.toString();
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();
  const note = formData.get("note")?.toString();

  if (!username || !password) {
    return new Response("Missing required fields", {
      status: 400,
    });
  }

  if (!id) {
    return new Response("Cannot find password", {
      status: 404,
    });
  }

  const { error } = await supabase
    .from("passwords")
    .update({ url, username, password, note })
    .eq("id", id);

  if (error) {
    return new Response("Something went wrong", {
      status: 500,
    });
  }

  return redirect(`/app/${id}`);
};

export const DELETE: APIRoute = async ({ params, redirect }) => {
  const id = params.id as string;

  const { error } = await supabase.from("passwords").delete().eq("id", id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return redirect("/");
};
