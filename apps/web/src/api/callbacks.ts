import { request } from "./base";

import { NewCallback, Callback } from "@msync/api-types";

export async function fetchAllCallbacks(): Promise<Callback[]> {
  const response = await request<{ callbacks: Callback[] }>({
    method: "GET",
    route: "/callback/list",
  });
  return response.callbacks;
}

export async function createCallback(
  newCallback: NewCallback
): Promise<Callback> {
  const response = await request<{ callback: Callback }>({
    method: "POST",
    route: "/callback",
    body: newCallback,
  });
  return response.callback;
}

export async function deleteCallback(id: number): Promise<void> {
  await request<void>({
    method: "DELETE",
    route: `/callback/${id}`,
  });
}

export async function updateCallback(
  id: number,
  updatedCallback: NewCallback
): Promise<Callback> {
  const response = await request<{ callback: Callback }>({
    method: "PUT",
    route: `/callback/${id}`,
    body: updatedCallback,
  });
  return response.callback;
}
