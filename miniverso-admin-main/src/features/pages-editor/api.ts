import { ApiError } from "@/lib/api/errors";
import { adminRequest } from "@/lib/api/http";
import { unwrapData } from "@/lib/api/mappers";
import type { JsonValue, ManagedPageKey } from "./types";

function isJsonObject(value: unknown): value is Record<string, JsonValue> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function getManagedPage(key: ManagedPageKey, signal?: AbortSignal): Promise<Record<string, JsonValue>> {
  const payload = unwrapData(await adminRequest(`/page-content?page=${encodeURIComponent(key)}`, { signal }));
  if (!isJsonObject(payload)) throw new ApiError(500);
  return payload;
}

export async function publishManagedPage(key: ManagedPageKey, content: Record<string, JsonValue>): Promise<Record<string, JsonValue>> {
  const payload = unwrapData(await adminRequest(`/page-content?page=${encodeURIComponent(key)}`, { method: "PUT", body: content }));
  if (!isJsonObject(payload)) throw new ApiError(500);
  return payload;
}
