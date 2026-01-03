import React from "react";

import { Modal, ModalBody, ModalFooter, ModalHeader } from "../common/Modal";
import { Button } from "../common/Button";
import { NewPlaylist } from "@msync/api-types";

export const PlaylistModal = ({
  onRequestClose,
  onSubmit,
  initialValue,
}: {
  onRequestClose?: () => void;
  onSubmit: (playlist: NewPlaylist) => void;
  initialValue?: NewPlaylist;
}) => {
  const [name, setName] = React.useState(initialValue?.name || "");
  const [source, setSource] = React.useState(initialValue?.source || "");
  const [folder, setFolder] = React.useState(initialValue?.folder || "");

  return (
    <Modal onRequestClose={onRequestClose} modalClassName="w-120">
      <ModalHeader>
        <h2 className="text-2xl font-bold">
          {initialValue ? "Edit Playlist" : "Sync New Playlist"}
        </h2>
      </ModalHeader>
      <ModalBody>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Playlist Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="source">
              Source URL
            </label>
            <input
              type="text"
              id="source"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="folder">
              Local Folder
            </label>
            <input
              type="text"
              id="folder"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
            />
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="primary"
          onClick={() => onSubmit({ name, source, folder })}
        >
          {initialValue ? "Save" : "Sync Playlist"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
