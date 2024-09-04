import type { Password, InsertPassword } from "@/lib/interfaces/password";
import { supabase } from "@/lib/supabase";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:content";

export const getPasswords = defineAction({
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
});

export const getPasswordById = defineAction({
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
});

export const addPassword = defineAction({
  accept: "form",
  input: z.object({
    url: z
      .string({ message: "Por favor ingresa la URL del sitio web" })
      .trim()
      .url({ message: "Por favor ingresa una URL válida" }),
    username: z
      .string({ message: "Por favor ingresa un correo o nombre de usuario" })
      .trim()
      .min(6, {
        message: "El email o usuario debe contener un mínimo de 5 carácteres",
      }),
    password: z
      .string({ message: "Por favor ingresa una contraseña" })
      .trim()
      .min(6, {
        message: "La contraseña debe tener un mínimo de 6 carácteres ",
      }),
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
});

export const updatePassword = defineAction({
  accept: "form",
  input: z.object({
    id: z.string(),
    url: z.string(),
    username: z.string(),
    password: z.string(),
    note: z
      .string()
      .nullable()
      .transform((val) => val ?? ""),
  }),
  handler: async ({ id, url, username, password, note }) => {
    const { error } = await supabase
      .from("passwords")
      .update({ url, username, password, note })
      .eq("id", id);

    if (error)
      throw new ActionError({ code: "BAD_REQUEST", message: error.message });

    return { success: true };
  },
});

export const deletePasswordById = defineAction({
  accept: "form",
  input: z.object({
    passwordId: z.string(),
  }),
  handler: async ({ passwordId }) => {
    const { error } = await supabase
      .from("passwords")
      .delete()
      .eq("id", passwordId);

    if (error)
      throw new ActionError({ code: "BAD_REQUEST", message: error.message });

    return { success: true };
  },
});
