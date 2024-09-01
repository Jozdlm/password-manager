import type { InsertPassword, Password } from "@/lib/interfaces/password";
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
  addPassword: defineAction({
    accept: "form",
    input: z.object({
      url: z.string(),
      username: z.string(),
      password: z.string(),
      note: z
        .string()
        .nullable()
        .transform((val) => val ?? ""),
    }),
    handler: async (form) => {
      const { session } = (await supabase.auth.getSession()).data;

      if (!session) throw new ActionError({ code: "FORBIDDEN" });

      const newPassword: InsertPassword = {
        ...form,
        user_id: session.user.id,
      };

      const { error } = await supabase.from("passwords").insert(newPassword);

      if (error)
        throw new ActionError({ code: "BAD_REQUEST", message: error.message });

      return { success: true };
    },
  }),
  deletePasswordById: defineAction({
    // TODO: Change to z.object
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
  logout: defineAction({
    accept: "form",
    handler: (_, ctx) => {
      ctx.cookies.delete("sb-access-token", { path: "/" });
      ctx.cookies.delete("sb-refresh-token", { path: "/" });

      console.log(ctx.cookies.get("sb-refresh-token"));

      return { success: true };
    },
  }),
};
