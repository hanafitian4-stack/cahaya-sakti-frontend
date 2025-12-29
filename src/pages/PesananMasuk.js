import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PesananMasuk() {
    const [pesanan, setPesanan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    // 1. Mengambil data pesanan
    // APA YANG TERJADI: Mengambil data dari endpoint admin yang baru.
    // RISIKO: Jika token expired, admin akan mendapat pesan error 401.
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
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPesanan();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 2. Fungsi Update Status & Potong Stok
    // APA YANG TERJADI: Mengirim request status ke Laravel. Jika 'diterima', Laravel akan otomatis memotong stok motor terkait.
    // RISIKO: Jika stok motor di database sudah 0, proses akan gagal dan muncul alert "Stok Habis".
    const handleUpdateStatus = async (id, statusBaru) => {
        const confirmMsg = `Apakah Anda yakin ingin mengubah status menjadi ${statusBaru}?`;
        if (!window.confirm(confirmMsg)) return;

        try {
            const response = await axios.put(
                `http://localhost:8000/api/admin/orders/${id}/status`,
                { status: statusBaru },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            alert(response.data.message);
            fetchPesanan(); // Refresh data untuk melihat perubahan status
        } catch (err) {
            // Menangkap pesan error dari Laravel (misal: pesan "Stok motor ini sudah habis")
            const pesanError = err.response?.data?.message || "Gagal memperbarui status";
            alert(pesanError);
        }
    };

    if (loading) return <div style={containerStyle}> Memuat data...</div>;
    if (error) return <div style={{...containerStyle, color: 'red'}}>{error}</div>;

    return (
        <div style={containerStyle}>
            <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
                📥 Manajemen Pesanan Masuk
            </h2>

            {pesanan.length === 0 ? (
                <p>Belum ada pesanan yang masuk saat ini.</p>
            ) : (
                <table style={tableStyle}>
                    <thead>
                        <tr style={headerStyle}>
                            <th style={cellStyle}>Data Pembeli</th>
                            <th style={cellStyle}>Motor & Warna</th>
                            <th style={cellStyle}>Status Saat Ini</th>
                            <th style={cellStyle}>Aksi Admin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pesanan.map((item) => (
                            <tr key={item.id} style={rowStyle}>
                                <td style={cellStyle}>
                                    <strong>{item.nama_lengkap}</strong><br />
                                    <small>{item.nomor_wa}</small><br />
                                    <span style={{fontSize: '11px', color: '#777'}}>{item.alamat}</span>
                                </td>
                                <td style={cellStyle}>
                                    {/* SESUAIKAN: menggunakan nama_model sesuai database */}
                                    {item.motor?.nama_model || "Motor Tidak Ditemukan"}<br />
                                    <span style={badgeWarna}>{item.warna}</span>
                                </td>
                                <td style={cellStyle}>
                                    <span style={getStatusStyle(item.status)}>
                                        {item.status.toUpperCase()}
                                    </span>
                                </td>
                                <td style={cellStyle}>
                                    {item.status === 'pending' || item.status === 'diproses' ? (
                                        <div style={{ display: 'flex', gap: '5px' }}>
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
                                        <span style={{ color: '#999', fontSize: '12px' }}>
                                            Transaksi {item.status === 'diterima' ? 'Selesai (Stok Berkurang)' : 'Dibatalkan'}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

// --- CSS TETAP SAMA SEPERTI MILIK ANDA ---
const containerStyle = { padding: '40px', fontFamily: 'Arial, sans-serif' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '10px' };
const headerStyle = { backgroundColor: '#2c3e50', color: 'white', textAlign: 'left' };
const cellStyle = { padding: '15px', borderBottom: '1px solid #ddd' };
const rowStyle = { backgroundColor: '#fff' };
const badgeWarna = { fontSize: '12px', color: '#555', backgroundColor: '#eee', padding: '2px 6px', borderRadius: '4px' };
const btnTerima = { backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };
const btnTolak = { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };

const getStatusStyle = (status) => ({
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: status === 'pending' ? '#f39c12' : status === 'diterima' ? '#2ecc71' : '#c0392b'
});

export default PesananMasuk;