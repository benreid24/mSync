import { Button } from "../common/Button";
import { useSyncContext } from "./SyncContext";
import { SyncStatus } from "./SyncStatus";

export const Sync = () => {
  const { active, startSync, syncState } = useSyncContext();

  return (
    <div className="flex flex-row align-center justify-start">
      <Button disabled={active} variant="primary" onClick={startSync}>
        Sync Now
      </Button>
      <SyncStatus state={syncState} />
    </div>
  );
};
