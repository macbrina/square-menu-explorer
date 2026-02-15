const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? "";

export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const headers = new Headers(init?.headers);
  if (API_KEY) headers.set("x-api-key", API_KEY);

  return fetch(path, { ...init, headers });
}
