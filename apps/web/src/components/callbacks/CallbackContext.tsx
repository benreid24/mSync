import React, { createContext, useContext, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { NewCallback, Callback } from "@msync/api-types";

import {
  fetchAllCallbacks as fetchAllCallbacksApi,
  createCallback as createCallbackApi,
  updateCallback as updateCallbackApi,
  deleteCallback as deleteCallbackApi,
} from "@/api/callbacks";

interface CallbackContextState {
  callbacks: Callback[];
}

interface CallbackContextActions {
  createCallback: (newCallback: NewCallback) => Promise<void>;
  updateCallback: (id: number, updatedCallback: NewCallback) => Promise<void>;
  deleteCallback: (id: number) => Promise<void>;
}

type CallbackContextType = CallbackContextState & CallbackContextActions;

const CallbackContext = createContext<CallbackContextType | undefined>(
  undefined
);

interface CallbackProviderProps {
  children: ReactNode;
}

export const CallbackProvider: React.FC<CallbackProviderProps> = ({
  children,
}) => {
  const [queryInvalidator, setQueryInvalidator] = useState(0);

  const { data: callbacks } = useQuery<Callback[]>({
    queryKey: ["callbacks", queryInvalidator],
    queryFn: fetchAllCallbacksApi,
    initialData: [],
    placeholderData: (previousData) => previousData,
  });

  const createCallback = async (data: NewCallback) => {
    await createCallbackApi(data);
    setQueryInvalidator((prev) => prev + 1);
  };

  const updateCallback = async (id: number, data: NewCallback) => {
    await updateCallbackApi(id, data);
    setQueryInvalidator((prev) => prev + 1);
  };

  const deleteCallback = async (id: number) => {
    await deleteCallbackApi(id);
    setQueryInvalidator((prev) => prev + 1);
  };

  const value: CallbackContextType = {
    callbacks,
    createCallback,
    updateCallback,
    deleteCallback,
  };

  return (
    <CallbackContext.Provider value={value}>
      {children}
    </CallbackContext.Provider>
  );
};

export const useCallbackContext = (): CallbackContextType => {
  const context = useContext(CallbackContext);
  if (!context) {
    throw new Error(
      "useCallbackContext must be used within a CallbackProvider"
    );
  }
  return context;
};
