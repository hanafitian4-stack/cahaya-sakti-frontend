import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion'; // Import Framer Motion

function PesananMasuk() {
    const [pesanan, setPesanan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    const fetchPesanan = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/admin/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPesanan(response.data);
            setError(null);
        } catch (err) {
            setError("Gagal mengambil data pesanan. Pastikan Anda login sebagai Admin.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPesanan();
    }, []);

    const handleUpdateStatus = async (id, statusBaru) => {
        const confirmMsg = `Konfirmasi ubah status ke ${statusBaru}?`;
        if (!window.confirm(confirmMsg)) return;

        try {
            const response = await axios.put(
                `http://localhost:8000/api/admin/orders/${id}/status`,
                { status: statusBaru },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(response.data.message);
            fetchPesanan();
        } catch (err) {
            alert(err.response?.data?.message || "Gagal memperbarui status");
        }
    };

    if (loading) return <div style={loadingStyle}>Sedang memproses data...</div>;

    return (
        // motion.div memberikan animasi masuk (Fade In & Slide Up)
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={pageContainer}
        >
            <div style={overlay}>
                {/* Header Area */}
                <div style={headerSection}>
                    <button onClick={() => window.history.back()} style={btnBack}>
                        ← Kembali
                    </button>
                    <h2 style={titleText}>📥 Manajemen Pesanan Masuk</h2>
                    <p style={subtitleText}>Panel Kontrol Dealer Cahaya Sakti Motor</p>
                </div>

                {error && <div style={errorBanner}>{error}</div>}

                {/* List Section */}
                <div style={gridContainer}>
                    {pesanan.length === 0 ? (
                        <div style={emptyState}>Belum ada pesanan yang masuk saat ini.</div>
                    ) : (
                        pesanan.map((item, index) => (
                            <motion.div 
                                key={item.id} 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }} // Animasi muncul satu per satu
                                style={orderCard}
                            >
                                <div style={cardHeader}>
                                    <span style={getStatusStyle(item.status)}>{item.status.toUpperCase()}</span>
                                    <small style={{color: '#888'}}>INV-#{item.id}</small>
                                </div>

                                <div style={cardBody}>
                                    <div style={infoGroup}>
                                        <label style={labelTitle}>INFO PEMBELI</label>
                                        <div style={mainInfo}>{item.nama_lengkap}</div>
                                        <div style={subInfo}>WA: {item.nomor_wa}</div>
                                        <div style={subInfo}>Alamat: {item.alamat}</div>
                                    </div>

                                    <div style={infoGroupRed}>
                                        <label style={labelTitle}>UNIT DIPESAN</label>
                                        <div style={motorInfo}>{item.motor?.nama_model || "Motor Tidak Ditemukan"}</div>
                                        <div style={badgeWarna}>Varian Warna: {item.warna}</div>
                                    </div>
                                </div>

                                <div style={cardFooter}>
                                    {item.status === 'pending' || item.status === 'diproses' ? (
                                        <div style={actionGroup}>
                                            <button 
                                                onClick={() => handleUpdateStatus(item.id, 'diterima')}
                                                style={btnTerima}
                                            >
                                                Terima & Potong Stok
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateStatus(item.id, 'ditolak')}
                                                style={btnTolak}
                                            >
                                                Tolak
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={finishedState}>
                                            {item.status === 'diterima' ? '✅ Pesanan Berhasil Disetujui' : '❌ Pesanan Dibatalkan'}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// Pastikan kode ini berada di luar fungsi utama atau di bagian bawah file
// Ganti nama dari pageWrapper menjadi pageContainer
const pageContainer = { 
    minHeight: '100vh', 
    backgroundImage: `url('pesanan.png')`, // Pastikan file ada di folder public
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    fontFamily: "'Poppins', sans-serif"
};

// Pastikan variabel overlay juga benar
const overlay = {
    minHeight: '100vh',
    backgroundColor: 'rgba(244, 247, 246, 0.58)', 
    padding: '40px 20px',
    backdropFilter: 'blur(5px)' 
};

const headerSection = { marginBottom: '40px', textAlign: 'center', position: 'relative' };
const btnBack = { position: 'absolute', left: '10px', top: '0', padding: '10px 18px', backgroundColor: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', color: '#333' };
const titleText = { fontSize: '28px', fontWeight: '800', color: '#2c3e50', margin: '0', letterSpacing: '1px' };
const subtitleText = { color: '#e74c3c', fontSize: '14px', fontWeight: '600', marginTop: '5px', textTransform: 'uppercase' };

const gridContainer = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto' };
const orderCard = { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '20px', padding: '25px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.3)' };

const cardHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const cardBody = { display: 'flex', flexDirection: 'column', gap: '20px' };
const infoGroup = { borderLeft: '4px solid #3498db', paddingLeft: '15px' };
const infoGroupRed = { borderLeft: '4px solid #e74c3c', paddingLeft: '15px' };

const labelTitle = { fontSize: '11px', fontWeight: 'bold', color: '#95a5a6', letterSpacing: '1px', marginBottom: '5px', display: 'block' };
const mainInfo = { fontSize: '17px', fontWeight: '700', color: '#2c3e50' };
const subInfo = { fontSize: '13px', color: '#7f8c8d', marginTop: '2px' };
const motorInfo = { fontSize: '18px', fontWeight: '800', color: '#e74c3c' };
const badgeWarna = { display: 'inline-block', padding: '4px 10px', backgroundColor: '#fff', borderRadius: '8px', fontSize: '12px', color: '#555', marginTop: '8px', border: '1px solid #eee', fontWeight: '600' };

const cardFooter = { marginTop: '25px' };
const actionGroup = { display: 'flex', gap: '12px' };
const btnTerima = { flex: 2, padding: '14px', backgroundColor: '#27ae60', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 5px 15px rgba(39, 174, 96, 0.3)' };
const btnTolak = { flex: 1, padding: '14px', backgroundColor: '#fff', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const finishedState = { textAlign: 'center', padding: '12px', backgroundColor: '#eee', borderRadius: '10px', color: '#777', fontSize: '13px', fontWeight: '600' };

const loadingStyle = { textAlign: 'center', padding: '100px', fontSize: '20px', fontWeight: 'bold', color: '#2c3e50' };
const errorBanner = { maxWidth: '600px', margin: '0 auto 20px', padding: '15px', backgroundColor: '#fdeaea', color: '#e74c3c', borderRadius: '12px', textAlign: 'center', fontWeight: '600' };
const emptyState = { gridColumn: '1/-1', textAlign: 'center', padding: '100px', color: '#95a5a6', fontSize: '18px' };

const getStatusStyle = (status) => ({
    padding: '6px 15px',
    borderRadius: '30px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: status === 'pending' ? '#f39c12' : status === 'diterima' ? '#2ecc71' : '#e74c3c',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
});

export default PesananMasuk;