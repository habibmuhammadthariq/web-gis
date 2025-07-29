# web-gis
Pastikan device-mu sudah terinstall Node.js

# Project Set up 
1. Masuk ke root directory lalu berikan perintah
  ```bash
    npm install atau npm i
  ```

2. copas file env.example dan kemudian ubah menjadi .env.local

3. jalankan kode dengan perintah 
  ```bash
    npm run dev
  ```

# Catatan untuk vector tiles
1. Url untuk membuka maps yang ada vector tiles-nya adalah localhost:3000/tiles
2. Codingan untuk menghandle vector tiles adalah VectorTiles.txs yang ada di src/components
3. Kalau mau mengganti url vector tile-nya, buka aja file-nya terus cari deh yang ada url-nya. tinggal di ganti deh