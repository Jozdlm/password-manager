import type { Password } from "@/lib/interfaces/password";
import { supabase } from "@/lib/supabase";

export const getPasswords = async (): Promise<Password[]> => {
  const { session } = (await supabase.auth.getSession()).data;

  if (!session) {
    throw new Error("There isn't a user logged");
  }

  let { data: passwords, error } = await supabase
    .from("passwords")
    .select("*")
    .eq("user_id", session.user.id);

  if (error) {
    throw new Error(error.message);
  }

  return passwords as Password[];
};
