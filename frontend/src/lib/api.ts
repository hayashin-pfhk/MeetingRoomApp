// API 呼び出しの共通ラッパ
// - ベースURL を一箇所で管理
// - Laravel の Resource 形式（{ data: ... }）を自動アンラップ
// - 失敗時は ApiError を throw（呼び出し側で message を拾える）

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type JsonBody = Record<string, unknown> | unknown[];

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message =
      (body as { message?: string }).message ?? `HTTP ${res.status}`;
    throw new ApiError(res.status, body, message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const json = await res.json();
  // Laravel API Resource は { data: ... } で包むので自動アンラップ
  return (json?.data ?? json) as T;
}

function jsonInit(method: string, body: JsonBody): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: JsonBody) =>
    request<T>(path, jsonInit("POST", body)),
  put: <T>(path: string, body: JsonBody) =>
    request<T>(path, jsonInit("PUT", body)),
  delete: (path: string) => request<void>(path, { method: "DELETE" }),
};
