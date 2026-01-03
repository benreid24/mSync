import { mkdir, copyFile } from "fs/promises";
import { join, dirname } from "path";

import { MUSIC_PATH } from "@msync/env.js";
import { getYtdlp } from "@msync/plugins/ytdlp.js";
import { DB } from "@msync/plugins/db/index.js";

import { Playlist } from "@msync/entities/playlist.js";
import { Video } from "@msync/entities/video.js";

import { fetchYoutubePlaylistItems } from "./fetchList.js";
import { makeVideoFilename } from "./makeVideoFilename.js";

export async function syncPlaylist(playlistId: number, db: DB): Promise<void> {
  try {
    const playlist = await db.findOne(Playlist, { id: playlistId });
    if (!playlist) {
      throw new Error("Playlist not found");
    }

    // ensure output directory exists
    const outputDir = join(MUSIC_PATH, playlist.folder);
    await mkdir(outputDir, { recursive: true });

    const ytDlp = getYtdlp();
    const videoList = await fetchYoutubePlaylistItems(playlist.source);

    // mark playlist checked
    playlist.lastChecked = new Date();
    await db.flush();

    for (const video of videoList) {
      try {
        const existingVideo = await db.findOne(Video, {
          videoId: video.id,
        });

        const dst = makeVideoFilename(outputDir, video.title, "mp3");
        const dstNoExtension = dst.slice(0, -4); // remove .mp3

        if (existingVideo) {
          const existingVideoPath = dirname(existingVideo.localPath);
          if (existingVideoPath === outputDir) {
            console.debug(
              `Skipping download for existing video: ${video.title}`
            );
            continue;
          }

          // copy existing video to new location
          await copyFile(existingVideo.localPath, dst);
          console.info(
            `Copied existing video to new location: ${video.title} -> ${dst}`
          );
        } else {
          await ytDlp.downloadAsync(
            `https://www.youtube.com/watch?v=${video.id}`,
            {
              output: `${dstNoExtension}.%(ext)s`,
              extractAudio: true,
              keepVideo: false,
              audioFormat: "mp3",
            }
          );
        }

        // record result
        const videoRecord = new Video();
        videoRecord.videoId = video.id;
        videoRecord.localPath = dst;
        db.persist(videoRecord);
        await db.flush();
      } catch (error) {
        console.error(`Error processing video ${video.title}:`, error);
      }
    }

    console.log(
      `Successfully synced playlist "${playlist.name}" with ${videoList.length} videos.`
    );
  } catch (error) {
    console.error("Error syncing playlist:", error);
  }
}
