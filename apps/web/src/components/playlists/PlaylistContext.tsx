import React, { createContext, useContext, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { Playlist, NewPlaylist } from "@msync/api-types";
import {
  createPlaylist as createPlaylistApi,
  fetchAllPlaylists as fetchAllPlaylistsApi,
  updatePlaylist as updatePlaylistApi,
  deletePlaylist as deletePlaylistApi,
} from "@/api/playlists";
import { useSyncContext } from "./SyncContext";

interface PlaylistContextState {
  playlists: Playlist[];
}

interface PlaylistContextActions {
  createPlaylist: (newPlaylist: NewPlaylist) => Promise<void>;
  updatePlaylist: (id: number, updatedPlaylist: NewPlaylist) => Promise<void>;
  deletePlaylist: (id: number) => Promise<void>;
}

type PlaylistContextType = PlaylistContextState & PlaylistContextActions;

const PlaylistContext = createContext<PlaylistContextType | undefined>(
  undefined
);

interface PlaylistProviderProps {
  children: ReactNode;
}

// Provider component
export const PlaylistProvider: React.FC<PlaylistProviderProps> = ({
  children,
}) => {
  const { syncState } = useSyncContext();
  const [queryInvalidator, setQueryInvalidator] = useState(0);

  const { data: playlists } = useQuery<Playlist[]>({
    queryKey: ["playlists", syncState, queryInvalidator],
    queryFn: fetchAllPlaylistsApi,
    initialData: [],
    placeholderData: (previousData) => previousData,
  });

  const createPlaylist = async (data: NewPlaylist) => {
    await createPlaylistApi(data);
    setQueryInvalidator((prev) => prev + 1);
  };

  const updatePlaylist = async (id: number, data: NewPlaylist) => {
    await updatePlaylistApi(id, data);
    setQueryInvalidator((prev) => prev + 1);
  };

  const deletePlaylist = async (id: number) => {
    await deletePlaylistApi(id);
    setQueryInvalidator((prev) => prev + 1);
  };

  const value: PlaylistContextType = {
    // State
    playlists,

    // Actions
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylistContext = (): PlaylistContextType => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error(
      "usePlaylistContext must be used within a PlaylistProvider"
    );
  }
  return context;
};
