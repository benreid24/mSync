# mSync

Lightweight Node + React app to sync Youtube playlists with local folders.

## Project Structure

```
msync
├── apps
│   ├── api              # Node.js backend using Express
│   └── web              # React frontend
├── packages
│   └── msync-api-types  # Shared API types and schemas
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- pnpm (version 6 or higher)
- yt-dlp
- ffmpeg

### Local Development

1. Allow build scripts: `pnpm approve-builds`
2. Install dependencies: `pnpm install`
3. Build types package: `cd packages/msync-api-types && pnpm build`
4. Create environment file: `touch apps/api/.env`
5. Run the application: `pnpm dev`

## Deployment

See `docker-compose.yml`. It can be used as is or modified to deploy via Docker.

### Environment

The following environment variables can be set to control the behvaior of mSync:

- `PORT`: The port the API and web app are served on
- `NODE_ENV`: Set to `development` or `production`
- `YTDLP_PATH`: Optional path to yt-dlp
- `FFMPEG_PATH`: Optional path to ffmpeg
- `DATA_PATH`: Path to store the sqlite database file in
- `MUSIC_PATH`: Path to write saved audio files to
