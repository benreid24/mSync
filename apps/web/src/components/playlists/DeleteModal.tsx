import { Modal, ModalBody, ModalFooter, ModalHeader } from "../common/Modal";
import { Playlist } from "@msync/api-types";
import { Button } from "../common/Button";

export const DeleteModal = ({
  onCancel,
  onConfirm,
  playlist,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  playlist: Playlist;
}) => {
  return (
    <Modal onRequestClose={onCancel}>
      <ModalHeader>
        <h2 className="text-2xl font-bold">Confirm Delete Playlist</h2>
      </ModalHeader>
      <ModalBody>
        <p>
          Are you sure you want to stop syncing the following playlist?
          <br />
          Downloaded files will not be deleted
        </p>
        <p className="mt-4">
          Removing: <span className="text-red-500">{playlist.name}</span>
        </p>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={onCancel} compact>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} compact>
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};
