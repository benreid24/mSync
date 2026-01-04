import React, { createContext, useContext, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { SyncState } from "@msync/api-types";

import {
  fetchSyncState as fetchSyncStateApi,
  startSync as startSyncApi,
} from "@/api/sync";

interface SyncContextState {
  syncState: SyncState;
  active: boolean;
}

interface SyncContextActions {
  startSync: () => Promise<boolean>;
}

type SyncContextType = SyncContextState & SyncContextActions;

const SyncContext = createContext<SyncContextType | undefined>(undefined);

interface SyncProviderProps {
  children: ReactNode;
}

const INTERVALS: Record<SyncState["state"], number> = {
  idle: 5000,
  syncing: 1000,
};

// Provider component
export const SyncProvider: React.FC<SyncProviderProps> = ({ children }) => {
  const [keyInvalidator, setKeyInvalidator] = useState(0);
  const [interval, setInterval] = useState(INTERVALS["idle"]);

  const { data: syncState } = useQuery<SyncState>({
    queryKey: ["syncState", keyInvalidator],
    queryFn: async () => {
      const result = await fetchSyncStateApi();
      setInterval(INTERVALS[result.state]);
      return result;
    },
    refetchInterval: interval,
    initialData: { state: "idle", errors: [] },
    placeholderData: (previousData) => previousData,
  });

  const startSync = async (): Promise<boolean> => {
    const started = await startSyncApi();
    setKeyInvalidator((prev) => prev + 1);
    setInterval(INTERVALS["syncing"]);
    return started;
  };

  const value: SyncContextType = {
    syncState,
    active: syncState?.state === "syncing",
    startSync,
  };

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
};

// Custom hook to use the SyncContext
export const useSyncContext = (): SyncContextType => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error("useSyncContext must be used within a SyncProvider");
  }
  return context;
};
