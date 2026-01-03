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

  const [nameError, setNameError] = React.useState<string | null>(null);
  const [sourceError, setSourceError] = React.useState<string | null>(null);
  const [folderError, setFolderError] = React.useState<string | null>(null);

  const validateName = () => {
    if (name.trim() === "") {
      setNameError("Playlist name is required");
      return false;
    } else {
      setNameError(null);
      return true;
    }
  };

  const validateSource = () => {
    if (source.trim() === "") {
      setSourceError("Source URL is required");
    } else {
      try {
        const sourceUrl = new URL(source.trim());
        const params = sourceUrl.searchParams;
        if (sourceUrl.hostname !== "www.youtube.com") {
          setSourceError("Invalid YouTube playlist URL");
        } else if (!params.get("list")) {
          setSourceError("Invalid YouTube playlist URL");
        } else {
          setSourceError(null);
          return true;
        }
      } catch {
        setSourceError("Invalid URL format");
      }
    }
    return false;
  };

  const validateFolder = () => {
    if (folder.trim() === "") {
      setFolderError("Local folder is required");
      return false;
    } else {
      setFolderError(null);
      return true;
    }
  };

  const handleSubmit = () => {
    const nameValid = validateName();
    const sourceValid = validateSource();
    const folderValid = validateFolder();

    if (!nameValid || !sourceValid || !folderValid) {
      return;
    }

    const sourceUrl = new URL(source.trim());
    const params = sourceUrl.searchParams;
    const sourceId = params.get("list") || "";

    onSubmit({ name, source: sourceId, folder });
  };

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
            {nameError && (
              <p className="text-red-500 text-sm mt-1 ml-1">{nameError}</p>
            )}
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
            {sourceError && (
              <p className="text-red-500 text-sm mt-1 ml-1">{sourceError}</p>
            )}
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
            {folderError && (
              <p className="text-red-500 text-sm mt-1 ml-1">{folderError}</p>
            )}
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button variant="primary" onClick={handleSubmit}>
          {initialValue ? "Save" : "Sync Playlist"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
