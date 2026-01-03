export async function request<T>({
  method,
  route,
  body,
  query,
}: {
  method: "GET" | "POST" | "PUT" | "DELETE";
  route: string;
  body?: Record<string, unknown>;
  query?: Record<string, unknown>;
}): Promise<T> {
  const url = new URL(`/api${route}`, window.location.origin);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }
  
  return await response.json();
}
