import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { Playlists } from "./components/playlists/Playlists";
import { PlaylistProvider } from "./components/playlists/PlaylistContext";
import { SyncProvider } from "./components/playlists/SyncContext";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SyncProvider>
        <PlaylistProvider>
          <div className="container mx-auto px-4 flex flex-col justify-center w-full mt-20">
            <h1 className="text-4xl font-bold mb-2">mSync</h1>
            <p className="mb-8 text-gray-400">
              Automatically sync your YouTube playlists locally
            </p>
            <Playlists />
          </div>
        </PlaylistProvider>
      </SyncProvider>
    </QueryClientProvider>
  );
};

export default App;
