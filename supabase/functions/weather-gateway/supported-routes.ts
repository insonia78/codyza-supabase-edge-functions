import { SupportedRoute } from "./models.ts";

export const supportedRoutes: readonly SupportedRoute[] = [
  { pattern: /^\/health\/?$/, methods: ["GET"] },
  { pattern: /^\/accounts\/?$/, methods: ["POST"] },
  { pattern: /^\/accounts\/login\/?$/, methods: ["POST"] },
  { pattern: /^\/accounts\/\d+\/?$/, methods: ["PUT", "PATCH", "DELETE"] },
];