import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";
import type { InsertPassword } from "../../lib/interfaces/password";

export const GET: APIRoute = async ({ redirect }) => {
  const { session } = (await supabase.auth.getSession()).data;

  if (!session) {
    redirect("/login");
  }

  let { data: passwords, error } = await supabase
    .from("passwords")
    .select("*")
    .eq("user_id", session?.user.id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(passwords), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();

  const url = formData.get("url")?.toString();
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();
  const note = formData.get("note")?.toString();
  const userId = formData.get("userId")?.toString();

  if (!url || !username || !password) {
    return new Response(
      JSON.stringify({ error: "Url, username and password are required" }),
      { status: 400 }
    );
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: "An user ID are required" }), {
      status: 400,
    });
  }

  const newPassword: InsertPassword = {
    url,
    username,
    password,
    note: note || "",
    user_id: userId,
  };

  const { error } = await supabase.from("passwords").insert(newPassword);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return redirect("/");
};
