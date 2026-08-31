# 🚀 ALVIAN.SPACE — Personal Space Portfolio

Website portofolio & perkenalan bertema **luar angkasa futuristik** milik:

> **Alvian Bagus Wijaksono** — Kelas X-4, SMA Negeri 1 Babat
> Dusun Sreto, Ds. Pule, Kec. Modo, Kab. Lamongan, Jawa Timur
> 📞 0857-2729-8747

## ✨ Fitur
- **Preloader** ala sistem peluncuran roket
- **Starfield canvas** interaktif (parallax mengikuti mouse + scroll) & bintang jatuh
- **Kursor komet** custom (desktop)
- **Hero 3D tilt** — planet, cincin, bulan mengorbit, teks mengetik otomatis
- **Tata surya interaktif** — drag untuk memutar, scroll untuk zoom, klik planet → modal info, tombol pause/reset
- **Kartu holografik** dengan efek cahaya mengikuti kursor
- **Scroll reveal**, progress bar, counter animasi, dan skill bar animasi
- **Timeline perjalanan**, galeri, dan form pesan yang langsung terkirim ke **WhatsApp**
- **Responsif** penuh + dukungan `prefers-reduced-motion`

## 📂 Struktur
```
index.html
assets/
  css/style.css
  js/main.js
  img/            ← taruh fotomu di sini
```

## ▶️ Cara menjalankan
Cukup buka `index.html` di browser. Atau jalankan server lokal:

```bash
python3 -m http.server 8000
```
lalu buka `http://localhost:8000`.

## 🌐 Publikasikan (GitHub Pages)
Settings → Pages → Source: **Deploy from a branch** → pilih branch → folder `/ (root)` → Save.

## 🛠️ Cara mengganti isi
| Yang ingin diubah | Lokasi |
|---|---|
| Teks profil, alamat, kontak | `index.html` (bagian `#about`, `#contact`) |
| Kalimat mengetik di hero | `assets/js/main.js` → array `words` |
| Nama & isi planet | `assets/js/main.js` → array `planets` |
| Warna tema | `assets/css/style.css` → `:root` |
| Foto galeri | ganti isi `<figure class="gal">` dengan `<img src="assets/img/...">` |
