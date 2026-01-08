export const PORT = process.env.PORT || 3000;

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const isDev = NODE_ENV === 'development';

export const YTDLP_PATH = process.env.YTDLP_PATH || 'yt-dlp';
export const FFMPEG_PATH = process.env.FFMPEG_PATH || 'ffmpeg';

export const TMP_PATH = process.env.TMP_PATH || './tmp';
export const DATA_PATH = process.env.DATA_PATH || './data';
export const MUSIC_PATH = process.env.MUSIC_PATH || `./music`;

export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '';
export const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';
