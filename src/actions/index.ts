import type { InsertPassword, Password } from "@/lib/interfaces/password";
import { supabase } from "@/lib/supabase";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import * as PasswordActions from "./password.action";

export const server = {
  ...PasswordActions,
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
