import { Modal, ModalBody, ModalFooter, ModalHeader } from "../common/Modal";
import { Button } from "../common/Button";
import { Callback } from "@msync/api-types";

export const DeleteModal = ({
  callback,
  onCancel,
  onConfirm,
}: {
  callback: Callback;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  return (
    <Modal onRequestClose={onCancel} modalClassName="w-120">
      <ModalHeader>
        <h2 className="text-2xl font-bold">Delete Callback</h2>
      </ModalHeader>
      <ModalBody>
        <p className="text-gray-300">
          Are you sure you want to delete the callback for
          <br />
          <span className="font-semibold">{callback.url}</span>
        </p>
        <p className="text-gray-400 mt-2">This action cannot be undone.</p>
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
