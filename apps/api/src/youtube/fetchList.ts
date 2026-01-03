import { YtDlp, VideoInfo } from "ytdlp-nodejs";

export async function fetchYoutubePlaylistItems(
  playlistId: string
): Promise<VideoInfo[]> {
  const ytDlp = new YtDlp();
  const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;

  const output = await ytDlp.getInfoAsync(playlistUrl, {
    flatPlaylist: true,
  });

  if (output._type !== "playlist") {
    throw new Error("Failed to fetch playlist items");
  }

  return output.entries;
}
