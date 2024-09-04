import { supabase } from "@/lib/supabase";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import * as passwordActions from "./password.action";

export const server = {
  ...passwordActions,
  login: defineAction({
    accept: "form",
    input: z.object({
      email: z
        .string({
          message: "El correo no puede estar vacío",
        })
        .email({
          message: "El correo proporcionado no es válido",
        }),
      password: z
        .string({
          message: "El campo contraseña es requerido",
        })
        .trim()
        .min(6, {
          message: "La contraseña debe contener un mínimo de 6 carácteres",
        }),
    }),
    handler: async ({ email, password }, ctx) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error)
        throw new ActionError({ code: "BAD_REQUEST", message: error.message });

      const { access_token, refresh_token } = data.session;

      ctx.cookies.set("sb-access-token", access_token, {
        path: "/",
      });
      ctx.cookies.set("sb-refresh-token", refresh_token, {
        path: "/",
      });

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
