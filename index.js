import 'dotenv/config';

import express from 'express';
import menuRoutes from './src/routes/menu.routes.js';
import { logger } from './src/middleware/logger.js';
import { notFound } from './src/middleware/notFound.js';
import { errorHandler } from './src/middleware/errorHandler.js';

const app = express();
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
    res.send('Halo dari Express!');
});

app.use('/menu', menuRoutes);
app.use(notFound);       
app.use(errorHandler);    

if (!process.env.API_KEY) {
    console.error('ERROR: API_KEY belum dikonfigurasi!');
    process.exit(1);
}

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, (err) => {
    if (err) {
        console.error('Gagal menjalankan server:', err.message);
        process.exit(1);
    }
    console.log(`Server jalan di http://localhost:${PORT}`);
});