import express from 'express';

export function setRoutes(app: express.Express) {
    app.get('/api/health', (req, res) => {
        res.status(200).send('OK');
    });
}
