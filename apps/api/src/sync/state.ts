import { SyncError } from "./error.js";
import { SyncState, InProgressState, IdleState } from "@msync/api-types";

export function createStartedState(): InProgressState {
  return {
    state: "syncing",
    playlistsCompleted: 0,
    totalPlaylists: 0,
    videosDownloaded: 0,
    videosCopied: 0,
    videosCompleted: 0,
    totalVideos: 0,
    errors: [],
  };
}

export function createIdleState(runningState?: SyncState): IdleState {
  return {
    state: "idle",
    errors: runningState ? runningState.errors : [],
  };
}

interface NotifyVideosFound {
  type: "notifyVideosFound";
  totalVideos: number;
}

interface NotifyVideoCompleted {
  type: "notifyVideoCompleted";
  action: "downloaded" | "copied" | "skipped";
}

interface NotifyError {
  type: "notifyError";
  error: string;
}

export type SyncStateEvent =
  | NotifyVideosFound
  | NotifyVideoCompleted
  | NotifyError;

export function reduceSyncState(
  currentState: SyncState,
  event: SyncStateEvent
) {
  const state =
    currentState.state === "syncing" ? currentState : createStartedState();
  switch (event.type) {
    case "notifyVideosFound":
      state.totalVideos = state.totalVideos + event.totalVideos;
      break;
    case "notifyVideoCompleted":
      if (event.action === "downloaded") {
        state.videosDownloaded = state.videosDownloaded + 1;
        state.videosCompleted = state.videosCompleted + 1;
      } else if (event.action === "copied") {
        state.videosCopied = state.videosCopied + 1;
        state.videosCompleted = state.videosCompleted + 1;
      } else {
        state.videosCompleted = state.videosCompleted + 1;
      }
      break;
    case "notifyError":
      state.errors.push(event.error);
    default:
      break;
  }
}

export function addErrorToState(currentState: SyncState, error: any) {
  if (error instanceof SyncError) {
    currentState.errors.push(error.message);
  } else {
    currentState.errors.push(`Unknown error: ${String(error)}`);
  }
}
