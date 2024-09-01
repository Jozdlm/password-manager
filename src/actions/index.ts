import type { Password } from "@/lib/interfaces/password";
import { supabase } from "@/lib/supabase";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

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
  getPasswordById: defineAction({
    input: z.string(),
    handler: async (passwordId) => {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError)
        throw new ActionError({
          code: "BAD_REQUEST",
          message: sessionError.message,
        });

      if (!data.session)
        throw new ActionError({
          code: "NOT_FOUND",
          message: "No founded session",
        });

      const userId = data.session.user.id;

      let { data: passwords, error } = await supabase
        .from("passwords")
        .select("*")
        .eq("id", passwordId)
        .eq("user_id", userId);

      if (error)
        throw new ActionError({ code: "BAD_REQUEST", message: error.message });

      if (!passwords)
        throw new ActionError({
          code: "NOT_FOUND",
          message: "Password not founded",
        });

      return passwords[0] as Password;
    },
  }),
  deletePasswordById: defineAction({
    input: z.string(),
    handler: async (passwordId) => {
      const { error } = await supabase
        .from("passwords")
        .delete()
        .eq("id", passwordId);

      if (error)
        throw new ActionError({ code: "BAD_REQUEST", message: error.message });

      return { success: true };
    },
  }),
};
