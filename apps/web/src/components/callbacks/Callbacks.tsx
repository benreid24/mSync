import React from "react";

import { Button } from "../common/Button";
import { CallbackTable } from "./CallbackTable";
import { CallbackModal } from "./CallbackModal";
import { useCallbackContext } from "./CallbackContext";
import { NewCallback } from "@msync/api-types";

export const Callbacks: React.FC = () => {
  const { createCallback } = useCallbackContext();
  const [showCallbackModal, setShowCallbackModal] = React.useState(false);

  const onSubmit = async (data: NewCallback) => {
    try {
      await createCallback(data);
      setShowCallbackModal(false);
    } catch (error) {
      console.error("Failed to create callback:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-2">Callbacks</h1>
      <div className="flex flex-row align-center justify-start">
        <Button
          variant="primary"
          onClick={() => {
            setShowCallbackModal(true);
          }}
        >
          Add New Callback
        </Button>
      </div>
      <CallbackTable />
      {showCallbackModal && (
        <CallbackModal
          onRequestClose={() => setShowCallbackModal(false)}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
};
