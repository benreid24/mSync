import { VideoInfo } from "ytdlp-nodejs";
import { getYtdlp } from "@msync/plugins/ytdlp.js";

export async function fetchYoutubePlaylistItems(
  playlistId: string
): Promise<VideoInfo[]> {
  const ytDlp = getYtdlp();
  const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;

  const output = await ytDlp.getInfoAsync(playlistUrl, {
    flatPlaylist: true,
  });

  if (output._type !== "playlist") {
    throw new Error("Failed to fetch playlist items");
  }

  return output.entries;
}
