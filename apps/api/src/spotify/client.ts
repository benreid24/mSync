import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "../env.js";

const TOKEN_EXPIRY_BUFFER_MS = 60000;

export interface SpotifyTrackInfo {
  id: string;
  name: string;
  trackNumber: number;
  durationMs: number;
  artists: string[];
  album: {
    name: string;
    releaseDate: string;
    totalTracks: number;
    coverUrl: string;
    artists: string[];
  };
}

interface SpotifySearchResponse {
  tracks: {
    items: Array<{
      id: string;
      name: string;
      track_number: number;
      duration_ms: number;
      artists: Array<{ name: string }>;
      album: {
        name: string;
        release_date: string;
        total_tracks: number;
        images: Array<{ url: string; width: number; height: number }>;
        artists: Array<{ name: string }>;
      };
    }>;
  };
}

type SpotifyTrack = SpotifySearchResponse["tracks"]["items"][number];
type SpotifyAlbumImage =
  SpotifySearchResponse["tracks"]["items"][number]["album"]["images"][number];

export class SpotifyClient {
  private authToken: string | null = null;
  private tokenExpiry: Date | null = null;

  private async getAuthToken(): Promise<string> {
    if (this.authToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.authToken;
    }

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to obtain Spotify auth token");
    }

    const data = await response.json();
    this.authToken = data.access_token as string;
    this.tokenExpiry = new Date(
      Date.now() + data.expires_in * 1000 - TOKEN_EXPIRY_BUFFER_MS
    );

    return this.authToken;
  }

  public enabled(): boolean {
    return SPOTIFY_CLIENT_ID !== "" && SPOTIFY_CLIENT_SECRET !== "";
  }

  public async getTrackInfo(
    title: string,
    expectedDuration: number
  ): Promise<SpotifyTrackInfo | null> {
    if (!this.enabled()) {
      return null;
    }

    const token = await this.getAuthToken();

    const searchQuery = await fetch(
      `https://api.spotify.com/v1/search?${new URLSearchParams({
        q: title,
        type: "track",
        limit: "10",
      })}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!searchQuery.ok) {
      throw new Error("Failed to search Spotify tracks");
    }

    const searchData = (await searchQuery.json()) as SpotifySearchResponse;
    const closestTrack = searchData.tracks.items.reduce<SpotifyTrack | null>(
      (bestMatch, track) => {
        const durationDiff = Math.abs(track.duration_ms - expectedDuration);
        if (
          (bestMatch === null ||
            durationDiff <
              Math.abs(bestMatch.duration_ms - expectedDuration)) &&
          durationDiff <= expectedDuration * 0.1
        ) {
          return track;
        }
        return bestMatch;
      },
      null
    );

    if (!closestTrack) {
      return null;
    }

    const bestImage =
      closestTrack.album.images.reduce<SpotifyAlbumImage | null>(
        (bestImage, image) => {
          if (!bestImage || image.width < bestImage.width) {
            return image;
          }
          return bestImage;
        },
        null
      );

    return {
      id: closestTrack.id,
      name: closestTrack.name,
      trackNumber: closestTrack.track_number,
      durationMs: closestTrack.duration_ms,
      artists: closestTrack.artists.map((artist) => artist.name),
      album: {
        name: closestTrack.album.name,
        releaseDate: closestTrack.album.release_date,
        totalTracks: closestTrack.album.total_tracks,
        coverUrl: bestImage?.url || "",
        artists: closestTrack.album.artists.map((artist) => artist.name),
      },
    };
  }
}
