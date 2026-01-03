import React from "react";
import { Button } from "../common/Button";
import { usePlaylistContext } from "./PlaylistContext";
import { Playlist } from "@msync/api-types";
import { DeleteModal } from "./DeleteModal";
import { PlaylistModal } from "./PlaylistModal";

export const PlaylistTable: React.FC = () => {
  const { playlists, updatePlaylist, deletePlaylist } = usePlaylistContext();
  const [deletingPlaylist, setDeletingPlaylist] =
    React.useState<Playlist | null>(null);
  const [editingPlaylist, setEditingPlaylist] = React.useState<Playlist | null>(
    null
  );

  return (
    <div>
      <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 bg-gray-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Source
            </th>
            <th className="px-6 py-3 bg-gray-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Folder
            </th>
            <th className="px-6 py-3 bg-gray-800" />
          </tr>
        </thead>
        <tbody>
          {playlists.map((playlist) => (
            <PlaylistRow
              key={playlist.id}
              playlist={playlist}
              onDelete={() => setDeletingPlaylist(playlist)}
              onEdit={() => setEditingPlaylist(playlist)}
            />
          ))}
          {playlists.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-center"
              >
                No playlists being synced yet. Add one!
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {deletingPlaylist && (
        <DeleteModal
          playlist={deletingPlaylist}
          onCancel={() => setDeletingPlaylist(null)}
          onConfirm={() => {
            deletePlaylist(deletingPlaylist.id);
            setDeletingPlaylist(null);
          }}
        />
      )}

      {editingPlaylist && (
        <PlaylistModal
          initialValue={editingPlaylist}
          onRequestClose={() => setEditingPlaylist(null)}
          onSubmit={(data) => {
            updatePlaylist(editingPlaylist.id, data);
            setEditingPlaylist(null);
          }}
        />
      )}
    </div>
  );
};

const PlaylistRow: React.FC<{
  playlist: Playlist;
  onDelete: () => void;
  onEdit: () => void;
}> = ({ playlist: { name, source, folder }, onDelete, onEdit }) => {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
        {name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        <a
          href={`https://www.youtube.com/playlist?list=${source}`}
          className="text-blue-400 hover:underline"
          target="_blank"
        >
          {source}
        </a>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {folder}
      </td>
      <td className="whitespace-nowrap text-sm text-gray-300">
        <Button variant="secondary" compact onClick={onEdit}>
          Edit
        </Button>
        <Button variant="danger" compact onClick={onDelete}>
          Delete
        </Button>
      </td>
    </tr>
  );
};
