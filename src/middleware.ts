import { defineMiddleware, sequence } from "astro:middleware";
import { supabase } from "./lib/supabase";

const PRIVATE_PREFIX_ROUTES = "/app";

const anonAndLoggedUserMiddleware = defineMiddleware(async (context, next) => {
  const { cookies, redirect } = context;

  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");
  const isPrivateRoute = context.url.pathname.includes(PRIVATE_PREFIX_ROUTES);

  if (isPrivateRoute) {
    if (accessToken && refreshToken) {
      // Is private route and is logged or there is a session open
      const { error } = await supabase.auth.setSession({
        refresh_token: refreshToken.value,
        access_token: accessToken.value,
      });

      // If the current is invalid it is going to redirect to login
      if (error) {
        cookies.delete("sb-access-token", {
          path: "/",
        });
        cookies.delete("sb-refresh-token", {
          path: "/",
        });

        return redirect("/login", 302);
      }

      return next();
    } else {
      // Is private route but is anon user
      return redirect("/login", 302);
    }
  } else {
    if (accessToken && refreshToken) {
      // Is public route and is logged
      return redirect("/app", 302);
    } else {
      // Is public route and is anon user
      return next();
    }
  }
});

export const onRequest = sequence(anonAndLoggedUserMiddleware);
