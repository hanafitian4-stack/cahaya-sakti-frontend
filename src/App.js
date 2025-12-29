import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Beranda from './pages/Beranda';
import BuatPesanan from './pages/BuatPesanan';
import PesananSaya from './pages/PesananSaya'; 

// TAMBAHKAN IMPORT INI (Pastikan file sudah dibuat di folder pages)
import PesananMasuk from './pages/PesananMasuk';
import StokBarang from './pages/StokBarang';

function App() {
    return (
        <Router>
            <Routes>
                {/* Rute Umum & User */}
                <Route path="/" element={<Login />} />
                <Route path="/beranda" element={<Beranda />} />
                <Route path="/buat-pesanan/:motorId" element={<BuatPesanan />} />
                <Route path="/pesanan-saya" element={<PesananSaya />} />

                {/* RUTE KHUSUS ADMIN (Tambahkan di sini) */}
                <Route path="/pesanan-masuk" element={<PesananMasuk />} />
                <Route path="/stok-barang" element={<StokBarang />} />
            </Routes>
        </Router>
    );
}

export default App;