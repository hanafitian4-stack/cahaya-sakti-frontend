import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PesananSaya = () => {
    const [pesanan, setPesanan] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }

        const fetchPesanan = async () => {
            try {
                const config = { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json' 
                    } 
                };
                // Memanggil API pesanan (memastikan Laravel mengembalikan data warna)
                const response = await axios.get('http://127.0.0.1:8000/api/pesanan', config);
                setPesanan(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Gagal mengambil data pesanan:", error);
                setLoading(false);
            }
        };
        fetchPesanan();
    }, [token, navigate]);

    // FUNGSI STATUS DINAMIS (Disesuaikan dengan logika Admin)
    const getStatusStyle = (status) => {
        const base = { padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' };
        
        switch (status) {
            case 'pending':
                return { ...base, backgroundColor: '#fff3cd', color: '#856404' };
            case 'diterima': // Status sukses dari Admin
                return { ...base, backgroundColor: '#d4edda', color: '#155724' };
            case 'ditolak': // Status penolakan dari Admin
                return { ...base, backgroundColor: '#f8d7da', color: '#721c24' };
            default:
                return { ...base, backgroundColor: '#eee', color: '#333' };
        }
    };

    return (
        <div style={pageWrapper}>
            <div style={contentContainer}>
                <div style={headerSection}>
                    <h2 style={titleStyle}>Pesanan Saya</h2>
                    <p style={subtitleStyle}>Pantau status unit motor dan pilihan warna yang Anda pesan.</p>
                </div>

                <div style={tableCard}>
                    {loading ? (
                        <p style={{textAlign: 'center', color: '#636e72'}}>Memuat data transaksi...</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={tableStyle}>
                                <thead>
                                    <tr style={headerRow}>
                                        <th style={thStyle}>UNIT MOTOR & WARNA</th>
                                        <th style={thStyle}>PEMESAN</th>
                                        <th style={thStyle}>STATUS</th>
                                        <th style={thStyle}>TANGGAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pesanan.length > 0 ? pesanan.map((item) => (
                                        <tr key={item.id} style={rowStyle}>
                                            <td style={tdStyle}>
                                                <div style={{fontWeight: 'bold', color: '#2d3436'}}>
                                                    {item.motor?.nama_model || 'Unit Tidak Diketahui'}
                                                </div>
                                                {/* MENAMPILKAN WARNA DI SINI */}
                                                <div style={{fontSize: '12px', color: '#e67e22', fontWeight: '600'}}>
                                                    Pilihan Warna: {item.warna || '-'}
                                                </div>
                                                <div style={{fontSize: '11px', color: '#95a5a6'}}>ID: #{item.id}</div>
                                            </td>
                                            <td style={tdStyle}>{item.nama_lengkap}</td>
                                            <td style={tdStyle}>
                                                <span style={getStatusStyle(item.status)}>
                                                    {item.status || 'PROSES'}
                                                </span>
                                            </td>
                                            <td style={tdStyle}>
                                                {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" style={{padding: '40px', textAlign: 'center', color: '#636e72'}}>
                                                Belum ada riwayat transaksi ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                    
                    <div style={{marginTop: '30px', textAlign: 'center'}}>
                        <button onClick={() => navigate('/beranda')} style={btnBack}>KEMBALI KE BERANDA</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- STYLES ---
const pageWrapper = { minHeight: '100vh', backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/beranda1.png')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', paddingTop: '80px', paddingBottom: '40px' };
const contentContainer = { maxWidth: '1000px', margin: '0 auto', padding: '0 20px' };
const headerSection = { marginBottom: '30px' };
const titleStyle = { fontSize: '32px', color: '#ffffff', fontWeight: '850', marginBottom: '10px' };
const subtitleStyle = { fontSize: '16px', color: '#ffffff', opacity: '0.9' };
const tableCard = { backgroundColor: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)', border: '1px solid #eee' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const headerRow = { borderBottom: '2px solid #f1f1f1' };
const thStyle = { padding: '15px', textAlign: 'left', color: '#2d3436', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' };
const rowStyle = { borderBottom: '1px solid #f9f9f9', transition: '0.3s' };
const tdStyle = { padding: '20px 15px', color: '#2d3436', fontSize: '14px', verticalAlign: 'middle' };
const btnBack = { padding: '14px 30px', backgroundColor: '#2d3436', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' };

export default PesananSaya;