import {
  addErrorToState,
  createIdleState,
  createStartedState,
  reduceSyncState,
} from "./state.js";
import { syncPlaylist } from "@msync/youtube/syncPlaylist.js";
import { Playlist } from "@msync/entities/playlist.js";
import { getRequestContext } from "@msync/plugins/db/index.js";

import { SyncState } from "@msync/api-types";
import { Notifier } from "./notifier.js";

class Syncer {
  state: SyncState = createIdleState();
  inProgress: Promise<void> | null = null;

  getState() {
    return this.state;
  }

  startSync() {
    if (this.inProgress) {
      console.warn("Sync already in progress");
      return false;
    }

    this.inProgress = this.doSync().finally(() => {
      this.inProgress = null;
    });

    return true;
  }

  private async doSync(): Promise<void> {
    try {
      const db = getRequestContext();
      const playlists = await db.find(Playlist, {});

      const notifier = new Notifier();
      await notifier.load(db);

      try {
        this.state = createStartedState();
        this.state.totalPlaylists = playlists.length;

        for (const playlist of playlists) {
          try {
            await syncPlaylist(playlist.id, db, async (e) => {
              reduceSyncState(this.state, e);

              if (e.type === "notifyError") {
                await notifier.notifyError();
              }
            });
            this.state.playlistsCompleted += 1;
          } catch (error) {
            console.error(
              `Error syncing playlist ${playlist.name} (ID: ${playlist.id}):`,
              error
            );
            addErrorToState(this.state, error);
            await notifier.notifyError();
          }
        }

        this.state = createIdleState(this.state);
      } catch (error) {
        console.error("Sync error:", error);
        this.state = createIdleState(this.state);
        addErrorToState(this.state, error);
        await notifier.notifyError();
      }
    } catch (error) {
      console.error("Sync error:", error);
    }
  }
}

const syncer = new Syncer();

export function getSyncer() {
  return syncer;
}
