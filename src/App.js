import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Beranda from './pages/Beranda';
import BuatPesanan from './pages/BuatPesanan';
// PERBAIKAN: Pindahkan file PesananSaya.js ke folder 'pages' 
// atau ubah path-nya jika file masih di luar folder pages.
import PesananSaya from './pages/PesananSaya'; 

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/beranda" element={<Beranda />} />
                <Route path="/buat-pesanan/:motorId" element={<BuatPesanan />} />
                <Route path="/pesanan-saya" element={<PesananSaya />} />
            </Routes>
        </Router>
    );
}

export default App;