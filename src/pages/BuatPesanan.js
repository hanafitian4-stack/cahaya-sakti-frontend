import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const BuatPesanan = () => {
    const { motorId } = useParams();
    const navigate = useNavigate();
    const [motor, setMotor] = useState(null);
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        nomor_wa: '',
        alamat: '',
        catatan: ''
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        const getMotorDetail = async () => {
            try {
                // Pastikan rute GET /api/motors/{id} sudah ada di Laravel
                const response = await axios.get(`http://127.0.0.1:8000/api/motors/${motorId}`);
                setMotor(response.data);
            } catch (error) {
                console.error("Gagal ambil detail motor:", error);
            }
        };
        getMotorDetail();
    }, [motorId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = {
                motor_id: motorId,
                nama_lengkap: formData.nama_lengkap,
                nomor_wa: formData.nomor_wa,
                alamat: formData.alamat,
                catatan: formData.catatan
            };

            const response = await axios.post('http://127.0.0.1:8000/api/pesanan', payload, config);
            alert(response.data.message);
            navigate('/pesanan-saya');
        } catch (error) {
            const pesan = error.response?.data?.message || "Cek koneksi/validasi";
            alert("Gagal simpan: " + pesan);
        }
    };

    return (
        <div style={pageWrapper}>
            {/* AREA FORM */}
            <div style={contentContainer}>
                <div style={leftSection}>
                    <h2 style={titleStyle}>Konfirmasi Pemesanan</h2>
                    <p style={subtitleStyle}>Silakan lengkapi data diri Anda untuk melanjutkan proses pembelian unit motor.</p>
                    
                    {motor && (
                        <div style={motorPreviewCard}>
                            <img src={motor.gambar} alt={motor.nama_model} style={motorImg} />
                            <div style={motorInfo}>
                                <h3 style={{margin: 0}}>{motor.nama_model}</h3>
                                <p style={priceTag}>Rp {Number(motor.harga).toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div style={formSection}>
                    <form onSubmit={handleSubmit} style={formStyle}>
                        <div style={inputGroup}>
                            <label style={labelStyle}>Nama Lengkap</label>
                            <input style={inputStyle} type="text" placeholder="Masukkan nama sesuai KTP" onChange={e => setFormData({...formData, nama_lengkap: e.target.value})} required />
                        </div>

                        <div style={inputGroup}>
                            <label style={labelStyle}>Nomor WhatsApp</label>
                            <input style={inputStyle} type="number" placeholder="Contoh: 08123456789" onChange={e => setFormData({...formData, nomor_wa: e.target.value})} required />
                        </div>

                        <div style={inputGroup}>
                            <label style={labelStyle}>Alamat Pengiriman</label>
                            <textarea style={{...inputStyle, minHeight: '80px'}} placeholder="Alamat lengkap rumah Anda" onChange={e => setFormData({...formData, alamat: e.target.value})} required />
                        </div>

                        <div style={inputGroup}>
                            <label style={labelStyle}>Catatan Tambahan (Opsional)</label>
                            <textarea style={{...inputStyle, minHeight: '60px'}} placeholder="Warna motor atau waktu pengiriman" onChange={e => setFormData({...formData, catatan: e.target.value})} />
                        </div>
                        
                        <div style={buttonGroup}>
                            <button type="submit" style={btnPrimary}>KONFIRMASI SEKARANG</button>
                            <button type="button" onClick={() => navigate('/beranda')} style={btnSecondary}>KEMBALI</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- STYLES ---
const pageWrapper = { minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: '80px', paddingBottom: '40px' };
const contentContainer = { display: 'flex', flexWrap: 'wrap', gap: '30px', maxWidth: '1000px', margin: '0 auto', padding: '0 20px' };
const leftSection = { flex: '1', minWidth: '300px' };
const formSection = { flex: '1.2', minWidth: '350px', backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' };

const titleStyle = { fontSize: '28px', color: '#2d3436', marginBottom: '10px', fontWeight: '800' };
const subtitleStyle = { color: '#636e72', marginBottom: '30px', lineHeight: '1.6' };

const motorPreviewCard = { display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #eee' };
const motorImg = { width: '100px', height: '100px', objectFit: 'contain', borderRadius: '10px' };
const motorInfo = { display: 'flex', flexDirection: 'column' };
const priceTag = { color: '#e74c3c', fontWeight: 'bold', fontSize: '18px', marginTop: '5px' };

const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '14px', fontWeight: '600', color: '#2d3436' };
const inputStyle = { padding: '12px 15px', borderRadius: '10px', border: '1px solid #dfe6e9', fontSize: '15px', outline: 'none', transition: 'border 0.3s' };

const buttonGroup = { marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' };
const btnPrimary = { padding: '15px', backgroundColor: '#2d3436', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' };
const btnSecondary = { padding: '12px', backgroundColor: 'transparent', color: '#636e72', border: 'none', fontWeight: '600', cursor: 'pointer' };

export default BuatPesanan;