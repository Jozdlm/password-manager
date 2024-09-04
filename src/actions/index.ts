import * as passwordActions from "./password.action";
import * as authActions from "./auth.action";

export const server = {
  ...passwordActions,
  ...authActions,
};
