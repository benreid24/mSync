import { getRequestContext } from "./db/index.js";
import { getYtdlp } from "./ytdlp.js";
import { YTDLP_PATH, FFMPEG_PATH } from "@msync/env.js";

export function initPlugins() {
  void getRequestContext();

  const ytDlp = getYtdlp();
  console.log("YTDLP_PATH:", YTDLP_PATH);
  console.log("FFMPEG_PATH:", FFMPEG_PATH);
  ytDlp.checkInstallation({ ffmpeg: true });
}
