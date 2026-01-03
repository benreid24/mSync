import { YtDlp } from "ytdlp-nodejs";
import { YTDLP_PATH, FFMPEG_PATH } from "@msync/env.js";

export const getYtdlp = () => {
  return new YtDlp({
    binaryPath: YTDLP_PATH,
    ffmpegPath: FFMPEG_PATH,
  });
};
