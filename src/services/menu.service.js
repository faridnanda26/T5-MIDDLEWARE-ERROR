import * as data from '../data/menu.data.js';
import { AppError } from '../utils/AppError.js';

export async function daftarMenu({ kategori }) {
    const semua = data.semua();
    return kategori
        ? semua.filter(m => m.kategori.toLocaleLowerCase() === kategori.toLocaleLowerCase())
        : semua;
}

export async function detailMenu(id) {
    const m = data.cariById(Number(id));
    if (!m) {
        throw new AppError(404, 'Menu tidak ditemukan', 'NOT_FOUND');
    }
    return m;
}

export async function buatMenu(input) {
    if (data.cariByNama(input.nama)) {
        throw new AppError(409, `NAMA ${input.nama} sudah terdaftar`, 'NAMA_DUPLIKAT');
    }
    return data.simpan(input);
}

export async function updateMenu(id, input) {
    const m = data.cariById(Number(id));
    const pemilikNama = data.cariByNama(input.nama);

    if (!m) {
        throw new AppError(404, 'Menu tidak ditemukan', 'NOT_FOUND');
    } else if (pemilikNama && pemilikNama.id !== m.id) {
        throw new AppError(409, `NAMA ${input.nama} sudah terdaftar`, 'NAMA_DUPLIKAT');
    }

    return data.perbarui(m.id, input);
}

export async function hapusMenu(id) {
    const m = data.cariById(Number(id));
    if (!m) {
        throw new AppError(404, 'Menu tidak ditemukan', 'NOT_FOUND');
    }

    return data.hapus(m.id);
}