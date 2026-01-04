import React from "react";
import { SyncState } from "@msync/api-types";
import { ErrorModal } from "./ErrorModal";

const Card = ({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) => {
  return (
    <div
      className={`flex flex-col align-center justify-center shadow-md rounded px-4 py-0 my-4 mx-2 border ${color}`}
    >
      {children}
    </div>
  );
};

export const SyncStatus = ({ state }: { state: SyncState }) => {
  const [showErrors, setShowErrors] = React.useState(false);

  return (
    <div className="flex flex-row align-center justify-start h-full">
      <Card color={state.state === "syncing" ? "bg-lime-700" : "bg-amber-800"}>
        <p className="text-white text-lg font-semibold my-2">
          Syncer:
          <span className="text-green-600 ml-1">
            {state.state === "syncing" ? "Active" : "Idle"}
          </span>
        </p>
      </Card>
      {state.state === "syncing" && (
        <>
          <Card color="bg-cyan-800">
            <p className="text-white text-lg font-semibold my-2">
              Playlists:
              <span className="text-green-400 ml-1">
                {state.playlistsCompleted} / {state.totalPlaylists}
              </span>
            </p>
          </Card>
          <Card color="bg-cyan-800">
            <p className="text-white text-lg font-semibold my-2">
              Videos:
              <span className="text-green-400 ml-1">
                {state.videosCompleted} / {state.totalVideos}
              </span>
            </p>
          </Card>
        </>
      )}
      {state.errors.length > 0 && (
        <button onClick={() => setShowErrors(true)}>
          <Card color="bg-rose-800 hover:bg-rose-600 active:bg-rose-900 cursor-pointer">
            <p className="text-white text-lg font-semibold my-2">
              Errors:
              <span className="text-red-400 ml-1">{state.errors.length}</span>
            </p>
          </Card>
        </button>
      )}
      {showErrors && (
        <ErrorModal
          errors={state.errors}
          onRequestClose={() => setShowErrors(false)}
        />
      )}
    </div>
  );
};
