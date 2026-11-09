import * as service from '../services/menu.service.js';

export async function daftar(req, res) {
    const hasil = await service.daftarMenu(req.query);
    res.json({ data: hasil, meta: { total: hasil.length } });
}

export async function detail(req, res) {
    const m = await service.detailMenu(req.params.id);
    res.json({ data: m });
}

export async function buat(req, res) {
    const baru = await service.buatMenu(req.body);
    res.status(201).json({ data: baru });
}

export async function update(req, res) {
    const mhsUpdate = await service.updateMenu(req.params.id, req.body);
    res.json({data: mhsUpdate});
}

export async function hapus(req, res) {
    await service.hapusMenu(req.params.id);
    res.status(204).end();
}