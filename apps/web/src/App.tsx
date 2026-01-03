import React from "react";

import { Playlists } from "./components/playlists/Playlists";
import { PlaylistProvider } from "./components/playlists/PlaylistContext";

const App: React.FC = () => {
  return (
    <PlaylistProvider>
      <div className="container mx-auto px-4 flex flex-col justify-center w-full mt-20">
        <h1 className="text-4xl font-bold mb-2">mSync</h1>
        <p className="mb-8 text-gray-400">
          Automatically sync your YouTube playlists locally
        </p>
        <Playlists />
      </div>
    </PlaylistProvider>
  );
};

export default App;
