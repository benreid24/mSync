import { request } from "./base";

import { Playlist, NewPlaylist } from "@msync/api-types";

export async function fetchAllPlaylists(): Promise<Playlist[]> {
  const response = await request<{ playlists: Playlist[] }>({
    method: "GET",
    route: "/playlist/list",
  });
  return response.playlists;
}

export async function createPlaylist(
  newPlaylist: NewPlaylist
): Promise<Playlist> {
  const response = await request<{ playlist: Playlist }>({
    method: "POST",
    route: "/playlist",
    body: newPlaylist,
  });
  return response.playlist;
}

export async function deletePlaylist(id: number): Promise<void> {
  await request<void>({
    method: "DELETE",
    route: `/playlist/${id}`,
  });
}

export async function updatePlaylist(
  id: number,
  updatedPlaylist: NewPlaylist
): Promise<Playlist> {
  const response = await request<{ playlist: Playlist }>({
    method: "PUT",
    route: `/playlist/${id}`,
    body: updatedPlaylist,
  });
  return response.playlist;
}
