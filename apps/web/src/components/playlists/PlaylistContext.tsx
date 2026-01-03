import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

import { Playlist, NewPlaylist } from "@msync/api-types";
import {
  createPlaylist as createPlaylistApi,
  fetchAllPlaylists as fetchAllPlaylistsApi,
  updatePlaylist as updatePlaylistApi,
  deletePlaylist as deletePlaylistApi,
} from "@/api/playlists";

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
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const createPlaylist = async (data: NewPlaylist) => {
    const newPlaylist = await createPlaylistApi(data);
    setPlaylists((prev) => [...prev, newPlaylist]);
  };

  const updatePlaylist = async (id: number, data: NewPlaylist) => {
    const updatedPlaylist = await updatePlaylistApi(id, data);
    setPlaylists((prev) =>
      prev.map((playlist) => (playlist.id === id ? updatedPlaylist : playlist))
    );
  };

  const deletePlaylist = async (id: number) => {
    await deletePlaylistApi(id);
    setPlaylists((prev) => prev.filter((playlist) => playlist.id !== id));
  };

  const value: PlaylistContextType = {
    // State
    playlists,

    // Actions
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
  };

  useEffect(() => {
    void fetchAllPlaylistsApi().then((data) => setPlaylists(data));
  }, []);

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
