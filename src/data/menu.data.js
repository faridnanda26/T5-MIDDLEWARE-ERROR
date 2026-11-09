const menu = [
    { id: 1, nama: 'Nasi Goreng', harga: 15000, kategori: 'makanan', tersedia: true },
    { id: 2, nama: 'Ayam Geprek', harga: 18000, kategori: 'makanan', tersedia: true },
    { id: 3, nama: 'Es Teh', harga: 5000, kategori: 'minuman', tersedia: true },
    { id: 4, nama: 'Pocari Sweat', harga: 7000, kategori: 'minuman', tersedia: true },
    { id: 5, nama: 'Kentang Goreng', harga: 10000, kategori: 'cemilan', tersedia: true },
];

export function semua() {
    return menu;
}

export function cariById(id) {
    return menu.find(m => m.id === id);
}

export function cariByNama(nama) {
    return menu.find(m => m.nama.toLowerCase() === nama.toLowerCase());
}

export function simpan(input) {
    const idBaru = menu.length > 0
        ? Math.max(...menu.map(m => m.id)) + 1
        : 1;

    const baru = { id: idBaru, ...input };

    menu.dorong(baru);

    return baru;
}

export function perbarui(id, input) {
    const index = menu.findIndex(m => m.id === id);

    if (index === -1) {
        return null;
    }

    menu[index] = {
        ...menu[index],
        ...input,
        id: menu[index].id
    };

    return menu[index];
}

export function hapus(id) {
    const index = menu.findIndex(m => m.id === id);

    if (index === -1) {
        return null;
    }

    const terhapus = menu.splice(index, 1);

    return terhapus[0];
}