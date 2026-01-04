import React from "react";

import { Modal, ModalBody, ModalFooter, ModalHeader } from "../common/Modal";
import { Button } from "../common/Button";
import { NewCallback } from "@msync/api-types";

export const CallbackModal = ({
  onRequestClose,
  onSubmit,
  initialValue,
}: {
  onRequestClose?: () => void;
  onSubmit: (callback: NewCallback) => void;
  initialValue?: NewCallback;
}) => {
  const [url, setUrl] = React.useState(initialValue?.url || "");
  const [eventType, setEventType] = React.useState<"completed" | "error">(
    initialValue?.eventType || "completed"
  );

  const [urlError, setUrlError] = React.useState<string | null>(null);

  const validateUrl = () => {
    if (url.trim() === "") {
      setUrlError("URL is required");
      return false;
    }
    try {
      new URL(url.trim());
      setUrlError(null);
      return true;
    } catch {
      setUrlError("Invalid URL format");
      return false;
    }
  };

  const handleSubmit = () => {
    const urlValid = validateUrl();

    if (!urlValid) {
      return;
    }

    onSubmit({ url: url.trim(), eventType });
  };

  return (
    <Modal onRequestClose={onRequestClose} modalClassName="w-120">
      <ModalHeader>
        <h2 className="text-2xl font-bold">
          {initialValue ? "Edit Callback" : "Add New Callback"}
        </h2>
      </ModalHeader>
      <ModalBody>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="url">
              Callback URL
            </label>
            <input
              type="text"
              id="url"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/webhook"
            />
            {urlError && (
              <p className="text-red-500 text-sm mt-1 ml-1">{urlError}</p>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="eventType"
            >
              Event Type
            </label>
            <select
              id="eventType"
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-800 text-white"
              value={eventType}
              onChange={(e) =>
                setEventType(e.target.value as "completed" | "error")
              }
            >
              <option value="completed">Completed</option>
              <option value="error">Error</option>
            </select>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button variant="primary" onClick={handleSubmit}>
          {initialValue ? "Save" : "Add Callback"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
