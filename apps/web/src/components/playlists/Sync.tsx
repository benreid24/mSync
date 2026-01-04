import { Button } from "../common/Button";
import { useSyncContext } from "./SyncContext";

export const Sync = () => {
  const { active, startSync } = useSyncContext();

  return (
    <div className="flex flex-row align-center justify-start">
      <Button disabled={active} variant="primary" onClick={startSync}>
        Sync Now
      </Button>
    </div>
  );
};
