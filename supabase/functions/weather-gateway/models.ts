import { type JWTPayload } from "npm:jose@5";

export type VerifiedToken = {
  payload: JWTPayload;
  tokenType: "supabase" | "custom";
};

export type SupportedRoute = {
  pattern: RegExp;
  methods: readonly string[];
};