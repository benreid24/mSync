import { mkdir, copyFile } from "fs/promises";
import { join, dirname, extname, basename } from "path";

import { MUSIC_PATH, TMP_PATH } from "@msync/env.js";
import { getYtdlp } from "@msync/plugins/ytdlp.js";
import { DB } from "@msync/plugins/db/index.js";

import { Playlist } from "@msync/entities/playlist.js";
import { Video } from "@msync/entities/video.js";

import { fetchYoutubePlaylistItems } from "./fetchList.js";
import { makeVideoFilename } from "./makeVideoFilename.js";

import { SyncStateEvent } from "@msync/sync/state.js";
import { SyncError } from "@msync/sync/error.js";
import { existsSync } from "fs";

export async function syncPlaylist(
  playlistId: number,
  db: DB,
  onUpdate: (event: SyncStateEvent) => Promise<void>
): Promise<void> {
  // ensure tmp directory exists
  await mkdir(TMP_PATH, { recursive: true });

  try {
    const playlist = await db.findOne(Playlist, { id: playlistId });
    if (!playlist) {
      throw new SyncError(`Playlist not found: ${playlistId}`);
    }

    // ensure output directory exists
    const outputDir = join(MUSIC_PATH, playlist.folder);
    await mkdir(outputDir, { recursive: true });

    const ytDlp = getYtdlp();
    const videoList = await fetchYoutubePlaylistItems(playlist.source);
    await onUpdate({
      type: "notifyVideosFound",
      totalVideos: videoList.length,
    });

    // mark playlist checked
    playlist.lastChecked = new Date();
    await db.flush();

    for (const video of videoList) {
      try {
        let dst = makeVideoFilename(outputDir, video.title, "mp3");

        const isSameVideo = (existingVideoPath: string) => {
          if (dirname(existingVideoPath).endsWith(outputDir)) {
            return true;
          }
          return false;
        };

        const existingVideos = await db.findAll(Video, {
          where: { videoId: video.id },
        });
        const existingVideo = existingVideos.reduce<Video | null>(
          (best, current) => {
            if (!best) return current;
            return isSameVideo(current.localPath) ? current : best;
          },
          null
        );

        if (existingVideo && isSameVideo(existingVideo.localPath)) {
          console.debug(
            `Skipping download for existing video in this playlist: ${video.title}`
          );
          await onUpdate({ type: "notifyVideoCompleted", action: "skipped" });
          continue;
        }

        let downloadNew = true;
        if (existingVideo) {
          // output needs to be sanitized, use same basename as existing file
          const existingVideoBasename = basename(existingVideo.localPath);
          dst = join(outputDir, existingVideoBasename);

          // copy existing video to new location
          try {
            await copyFile(existingVideo.localPath, dst);
            console.info(
              `Copied existing video to new location: ${video.title} -> ${dst}`
            );
            await onUpdate({ type: "notifyVideoCompleted", action: "copied" });
            downloadNew = false;
          } catch (copyError) {
            console.error(
              `Failed to copy existing video for ${video.title}, will re-download.`,
              copyError
            );
          }
        }

        if (downloadNew) {
          dst = (
            await ytDlp.downloadAsync(
              `https://www.youtube.com/watch?v=${video.id}`,
              {
                output: `${dst.slice(0, -extname(dst).length)}.%(ext)s`,
                extractAudio: true,
                keepVideo: false,
                audioFormat: "mp3",
                print: "after_move:filepath",
                windowsFilenames: true,
                embedInfoJson: false,
                embedThumbnail: true,
                embedMetadata: true,
                paths: { temp: TMP_PATH },
              }
            )
          ).trim();
          console.info(`Downloaded video: ${video.title} -> ${dst}`);
          await onUpdate({
            type: "notifyVideoCompleted",
            action: "downloaded",
          });
        }

        // record result
        const videoRecord = new Video();
        videoRecord.videoId = video.id;
        videoRecord.localPath = dst;
        playlist.lastFetched = new Date();
        db.persist(videoRecord);
        await db.flush();
      } catch (error) {
        console.error(`Error processing video ${video.title}:`, error);
        await onUpdate({ type: "notifyError", error: String(error) });
      }
    }

    console.log(
      `Successfully synced playlist "${playlist.name}" with ${videoList.length} videos.`
    );
  } catch (error) {
    console.error("Error syncing playlist:", error);
    await onUpdate({ type: "notifyError", error: String(error) });
  }
}
