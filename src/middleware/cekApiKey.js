import { AppError } from '../utils/AppError.js';

export function cekApiKey(req, res, next) {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        throw new Error('API_KEY belum dikonfigurasi pada environment');
    }

    const kunci = req.headers['x-api-key'];

    if (kunci !== apiKey) {
        return next(
            new AppError(401, 'API key tidak valid', 'UNAUTHORIZED')
        );
    }

    next();
}
