import { SyncState } from "@msync/api-types";
import { request } from "./base";

export async function fetchSyncState(): Promise<SyncState> {
  const response = await request<{ state: SyncState }>({
    method: "GET",
    route: "/sync/state",
  });
  return response.state;
}

export async function startSync(): Promise<boolean> {
  const response = await request<{ started: boolean; message: string }>({
    method: "POST",
    route: "/sync/start",
  });
  return response.started;
}
