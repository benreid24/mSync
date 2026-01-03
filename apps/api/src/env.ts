export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const isDev = NODE_ENV === 'development';
export const DB_FILE = process.env.DB_FILE || 'sqlite.db';
