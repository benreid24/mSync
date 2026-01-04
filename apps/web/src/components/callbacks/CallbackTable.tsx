import React from "react";
import { Button } from "../common/Button";
import { useCallbackContext } from "./CallbackContext";
import { Callback } from "@msync/api-types";
import { DeleteModal } from "./DeleteModal";
import { CallbackModal } from "./CallbackModal";

export const CallbackTable: React.FC = () => {
  const { callbacks, updateCallback, deleteCallback } = useCallbackContext();
  const [deletingCallback, setDeletingCallback] =
    React.useState<Callback | null>(null);
  const [editingCallback, setEditingCallback] = React.useState<Callback | null>(
    null
  );

  return (
    <div>
      <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              URL
            </th>
            <th className="px-6 py-3 bg-gray-800 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Event Type
            </th>
            <th className="px-1 py-3 bg-gray-800  text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {callbacks.map((callback) => (
            <CallbackRow
              key={callback.id}
              callback={callback}
              onDelete={() => setDeletingCallback(callback)}
              onEdit={() => setEditingCallback(callback)}
            />
          ))}
          {callbacks.length === 0 && (
            <tr>
              <td
                colSpan={3}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-center"
              >
                No callbacks configured yet. Add one!
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {deletingCallback && (
        <DeleteModal
          callback={deletingCallback}
          onCancel={() => setDeletingCallback(null)}
          onConfirm={() => {
            deleteCallback(deletingCallback.id);
            setDeletingCallback(null);
          }}
        />
      )}

      {editingCallback && (
        <CallbackModal
          initialValue={editingCallback}
          onRequestClose={() => setEditingCallback(null)}
          onSubmit={(data) => {
            updateCallback(editingCallback.id, data);
            setEditingCallback(null);
          }}
        />
      )}
    </div>
  );
};

const CallbackRow: React.FC<{
  callback: Callback;
  onDelete: () => void;
  onEdit: () => void;
}> = ({ callback: { url, eventType }, onDelete, onEdit }) => {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
        {url}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {eventType}
      </td>
      <td className="px-1 whitespace-nowrap text-sm text-gray-300">
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
