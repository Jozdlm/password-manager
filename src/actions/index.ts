import type { Password } from "@/lib/interfaces/password";
import { supabase } from "@/lib/supabase";
import { ActionError, defineAction } from "astro:actions";

export const server = {
  getPasswords: defineAction({
    handler: async () => {
      const { session } = (await supabase.auth.getSession()).data;

      if (!session) throw new ActionError({ code: "BAD_REQUEST" });

      let { data: passwords, error } = await supabase
        .from("passwords")
        .select("*")
        .eq("user_id", session.user.id);

      if (error)
        throw new ActionError({ code: "BAD_REQUEST", message: error.message });

      return passwords as Password[];
    },
  }),
};
