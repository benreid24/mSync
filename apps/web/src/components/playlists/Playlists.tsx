import React from "react";

import { Button } from "../common/Button";
import { PlaylistTable } from "./PlaylistTable";
import { PlaylistModal } from "./PlaylistModal";
import { usePlaylistContext } from "./PlaylistContext";
import { NewPlaylist } from "@msync/api-types";

export const Playlists: React.FC = () => {
  const { createPlaylist } = usePlaylistContext();
  const [showPlaylistModal, setShowPlaylistModal] = React.useState(false);

  const onSubmit = async (data: NewPlaylist) => {
    try {
      await createPlaylist(data);
      setShowPlaylistModal(false);
    } catch (error) {
      console.error("Failed to create playlist:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-2">Playlists</h1>
      <Button
        variant="primary"
        onClick={() => {
          setShowPlaylistModal(true);
        }}
      >
        Sync New Playlist
      </Button>
      <PlaylistTable />
      {showPlaylistModal && (
        <PlaylistModal
          onRequestClose={() => setShowPlaylistModal(false)}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
};
