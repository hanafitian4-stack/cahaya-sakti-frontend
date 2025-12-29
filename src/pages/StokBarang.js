import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StokBarang = () => {
    const [motors, setMotors] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Menggunakan useCallback untuk membungkus fungsi fetch agar bisa dipanggil ulang tanpa warning
    const fetchStok = useCallback(async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get('http://127.0.0.1:8000/api/admin/stok-penjualan', config);
            setMotors(res.data);
        } catch (error) {
            console.error("Gagal mengambil data stok:", error);
            alert("Gagal memuat data. Pastikan koneksi backend aktif.");
        }
    }, [token]);

    useEffect(() => {
        fetchStok();
    }, [fetchStok]);

    // FUNGSI BARU: Menambah stok lewat prompt browser
    const handleTambahStok = async (id, namaModel) => {
        const jumlah = prompt(`Masukkan jumlah stok tambahan untuk ${namaModel}:`, "1");
        
        // Validasi input: tidak boleh batal, harus angka, dan minimal 1
        if (jumlah === null) return; // Jika klik batal
        if (isNaN(jumlah) || parseInt(jumlah) <= 0) {
            alert("Harap masukkan angka yang valid (minimal 1).");
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.put(`http://127.0.0.1:8000/api/admin/motors/${id}/tambah-stok`, 
                { tambah_stok: parseInt(jumlah) }, 
                config
            );

            alert(res.data.message);
            fetchStok(); // Refresh data tabel secara otomatis
        } catch (error) {
            alert(error.response?.data?.message || "Gagal memperbarui stok.");
        }
    };

    return (
        <div style={{ padding: '50px 8%', fontFamily: 'Segoe UI', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <button onClick={() => navigate('/beranda')} style={btnBack}>← Kembali ke Beranda</button>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}>
                <h2 style={{ margin: 0 }}>📊 Manajemen Stok & Penjualan</h2>
                <button onClick={fetchStok} style={btnRefresh}>🔄 Refresh Data</button>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={{ backgroundColor: '#2d3436', color: 'white' }}>
                            <th style={thStyle}>Model Motor</th>
                            <th style={thStyle}>Sisa Stok</th>
                            <th style={thStyle}>Unit Terjual</th>
                            <th style={thStyle}>Aksi Admin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {motors.length > 0 ? (
                            motors.map(motor => (
                                <tr key={motor.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={tdStyle}>
                                        <strong>{motor.nama_model}</strong><br/>
                                        <small style={{ color: '#636e72' }}>{motor.tipe}</small>
                                    </td>
                                    <td style={{ ...tdStyle, color: motor.stok === 0 ? '#d63031' : '#2d3436', fontWeight: 'bold' }}>
                                        {motor.stok} Unit
                                        {motor.stok === 0 && <span style={badgeHabis}>HABIS</span>}
                                    </td>
                                    <td style={{ ...tdStyle, color: '#00b894', fontWeight: 'bold' }}>
                                        {motor.total_terjual || 0} Unit
                                    </td>
                                    <td style={tdStyle}>
                                        <button 
                                            onClick={() => handleTambahStok(motor.id, motor.nama_model)}
                                            style={btnTambah}
                                        >
                                            + Tambah Stok
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Data motor tidak tersedia.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- STYLING ---
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { padding: '18px 15px', textAlign: 'left' };
const tdStyle = { padding: '18px 15px', textAlign: 'left' };
const btnBack = { padding: '10px 20px', backgroundColor: '#2d3436', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '10px' };
const btnRefresh = { padding: '8px 15px', backgroundColor: '#0984e3', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' };
const btnTambah = { padding: '8px 12px', backgroundColor: '#00b894', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };
const badgeHabis = { marginLeft: '10px', backgroundColor: '#fab1a0', color: '#d63031', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' };

export default StokBarang;