import { type JWTPayload } from "npm:jose@5";

export function buildForwardHeaders(
  req: Request,
  payload: JWTPayload,
  tokenType: "supabase" | "custom",
): Headers {
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("content-length");
  // headers.set("X-User-Id", getPayloadStringValue(payload, "sub"));
  // headers.set("X-User-Type", tokenType);
  // headers.set("X-User-Payload", JSON.stringify(payload));
  return headers;
}

function getPayloadStringValue(
  payload: JWTPayload,
  key: keyof JWTPayload,
): string {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}
