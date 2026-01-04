import { Button } from "../common/Button";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../common/Modal";

const Error = ({ error }: { error: string }) => {
  return (
    <div className="rounded border border-red-200 bg-rose-800 p-4 my-2">
      {error}
    </div>
  );
};

export const ErrorModal = ({
  errors,
  onRequestClose,
}: {
  errors: string[];
  onRequestClose: () => void;
}) => {
  return (
    <Modal onRequestClose={onRequestClose} modalClassName="w-200">
      <ModalHeader>
        <h2 className="text-2xl font-bold text-red-600">Sync Errors</h2>
      </ModalHeader>
      <ModalBody>
        <div
          className="border border-red-100 rounded shadow shadow-white p-2 flex flex-col justify-start overflow-y-auto"
          style={{ maxHeight: "65vh" }}
        >
          {errors.map((error, index) => (
            <Error key={index} error={error} />
          ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="primary" onClick={onRequestClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};
