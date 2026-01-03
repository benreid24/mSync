import express from 'express';

import { router as playlistRouter } from './playlist/playlist.js';

export function setRoutes(app: express.Express) {
    app.get('/api/health', (req, res) => {
        res.status(200).send('OK');
    });

    app.use('/api/playlist', playlistRouter);
}
