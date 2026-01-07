import { SpotifyClient } from "./client.js";
import NodeID3 from "node-id3";
import { SyncStateEvent } from "@msync/sync/state.js";
import {basename, extname} from 'path';

const spotifyClient = new SpotifyClient();

export async function addMetadataToFile(
  filePath: string,
  onUpdate: (event: SyncStateEvent) => Promise<void>
): Promise<void> {
  const currentMetadata = NodeID3.read(filePath);
  const lengthMs = currentMetadata.length
    ? parseInt(currentMetadata.length as string, 10)
    : 0;

  if (isNaN(lengthMs) || lengthMs <= 0) {
    onUpdate({
      type: "notifyError",
      error: `Could not determine track length from existing metadata: ${filePath}`,
    });
    return;
  }

  const fallbackTitle = basename(filePath, extname(filePath));
  const trackInfo = await spotifyClient.getTrackInfo(
    currentMetadata.title || fallbackTitle,
    lengthMs
  );

  if (!trackInfo) {
    onUpdate({
      type: "notifyError",
      error: `Could not fetch Spotify metadata for file: ${filePath}`,
    });
    return;
  }
    
  const tags: NodeID3.Tags = {
    ...currentMetadata,
    title: trackInfo.name,
    artist: trackInfo.artists.join(", "),
    album: trackInfo.album.name,
    releaseTime: trackInfo.album.releaseDate,
    trackNumber: trackInfo.trackNumber.toString(),
  };
  NodeID3.write(tags, filePath);
}
