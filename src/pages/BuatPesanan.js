import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';

// --- THEME CONSTANTS ---
const theme = {
    bg: '#0f172a',
    card: '#1e293b',
    primary: '#f97316',
    textMain: '#f8fafc',
    textSub: '#94a3b8',
    border: '#334155',
    inputBg: '#0f172a'
};

const BuatPesanan = () => {
    const { motorId } = useParams();
    const navigate = useNavigate();
    const [motor, setMotor] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const strukRef = useRef();

    const [formData, setFormData] = useState({
        nama_lengkap: '', nomor_wa: '', alamat: '', warna: '', catatan: ''
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        const getMotorDetail = async () => {
            try {
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
                ...formData
            };

            const response = await axios.post('http://127.0.0.1:8000/api/pesanan', payload, config);
            setOrderData(response.data.data || response.data); 
            setIsSuccess(true);
        } catch (error) {
            alert("Gagal simpan: " + (error.response?.data?.message || "Cek koneksi"));
        }
    };

    const downloadPDF = () => {
        const element = strukRef.current;
        html2canvas(element, { scale: 3 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
            pdf.save(`Struk_CSM_${orderData.id}.pdf`);
        });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={pageWrapper}>
            <div style={contentContainer}>
                {/* Bagian Kiri: Preview Unit */}
                <div style={leftSection}>
                    <motion.h2 initial={{ x: -20 }} animate={{ x: 0 }} style={titleStyle}>Konfirmasi Pemesanan</motion.h2>
                    <p style={subtitleStyle}>Lengkapi data diri Anda untuk proses pemesanan unit baru di Cahaya Sakti Motor.</p>
                    
                    {motor && (
                        <motion.div whileHover={{ scale: 1.02 }} style={motorPreviewCard}>
                            <div style={imgBox}>
                                <img src={motor.gambar} alt={motor.nama_model} style={motorImg} />
                            </div>
                            <div style={motorInfo}>
                                <span style={badgeTipe}>{motor.tipe}</span>
                                <h3 style={{margin: '5px 0', color: theme.textMain, fontSize: '22px'}}>{motor.nama_model}</h3>
                                <p style={priceTag}>Rp {Number(motor.harga).toLocaleString('id-ID')}</p>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Bagian Kanan: Form */}
                <div style={formSection}>
                    <form onSubmit={handleSubmit} style={formStyle}>
                        <div style={inputGroup}>
                            <label style={labelStyle}>Nama Lengkap (Sesuai KTP)</label>
                            <input style={inputStyle} type="text" placeholder="Contoh: Budi Setiawan" onChange={e => setFormData({...formData, nama_lengkap: e.target.value})} required />
                        </div>
                        
                        <div style={{display: 'flex', gap: '20px'}}>
                            <div style={{...inputGroup, flex: 1}}>
                                <label style={labelStyle}>Nomor WhatsApp</label>
                                <input style={inputStyle} type="number" placeholder="0812..." onChange={e => setFormData({...formData, nomor_wa: e.target.value})} required />
                            </div>
                            <div style={{...inputGroup, flex: 1}}>
                                <label style={labelStyle}>Pilih Warna</label>
                                <select style={inputStyle} value={formData.warna} onChange={e => setFormData({...formData, warna: e.target.value})} required>
                                    <option value="" style={{backgroundColor: theme.card}}>-- Pilih --</option>
                                    <option value="Hitam Metalik" style={{backgroundColor: theme.card}}>Hitam Metalik</option>
                                    <option value="Merah Nyala" style={{backgroundColor: theme.card}}>Merah Nyala</option>
                                    <option value="Putih Mutiara" style={{backgroundColor: theme.card}}>Putih Mutiara</option>
                                    <option value="Biru Sporty" style={{backgroundColor: theme.card}}>Biru Sporty</option>
                                </select>
                            </div>
                        </div>

                        <div style={inputGroup}>
                            <label style={labelStyle}>Alamat Pengiriman</label>
                            <textarea style={{...inputStyle, minHeight: '80px'}} placeholder="Alamat lengkap tujuan pengiriman" onChange={e => setFormData({...formData, alamat: e.target.value})} required />
                        </div>

                        <div style={inputGroup}>
                            <label style={labelStyle}>Catatan (Opsional)</label>
                            <textarea style={{...inputStyle, minHeight: '60px'}} placeholder="Tambahkan catatan jika ada..." onChange={e => setFormData({...formData, catatan: e.target.value})} />
                        </div>

                        <div style={buttonGroup}>
                            <button type="submit" style={btnPrimary}>KONFIRMASI PESANAN SEKARANG</button>
                            <button type="button" onClick={() => navigate('/beranda')} style={btnSecondary}>Kembali ke Katalog</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* MODAL STRUK (STAY WHITE FOR PRINTING) */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={modalOverlay}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} style={modalContent}>
                            <div ref={strukRef} style={strukContainer}>
                                <div style={{textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '15px'}}>
                                    <h2 style={{margin: 0, fontWeight: '900'}}>CAHAYA SAKTI MOTOR</h2>
                                    <p style={{fontSize: '11px', margin: '5px 0', textTransform: 'uppercase', letterSpacing: '1px'}}>Bukti Pemesanan Unit Resmi</p>
                                </div>
                                <div style={{margin: '25px 0', fontSize: '13px', lineHeight: '1.8', color: '#000'}}>
                                    <div style={{display:'flex', justifyContent:'space-between'}}><p>ID PESANAN</p><p><strong>#{orderData?.id}</strong></p></div>
                                    <div style={{display:'flex', justifyContent:'space-between'}}><p>TANGGAL</p><p>{new Date().toLocaleDateString('id-ID')}</p></div>
                                    <div style={{height: '1px', backgroundColor: '#eee', margin: '15px 0'}}></div>
                                    <p>NAMA: <strong>{formData.nama_lengkap}</strong></p>
                                    <p>WA: <strong>{formData.nomor_wa}</strong></p>
                                    <p>UNIT: <strong>{motor?.nama_model}</strong></p>
                                    <p>WARNA: <strong>{formData.warna}</strong></p>
                                    <p>TOTAL: <strong>Rp {Number(motor?.harga).toLocaleString('id-ID')}</strong></p>
                                    <p>ALAMAT: {formData.alamat}</p>
                                </div>
                                <div style={{textAlign: 'center', marginTop: '20px', borderTop: '1px dashed #000', paddingTop: '15px'}}>
                                    <p style={{fontSize: '10px', color: '#666'}}>*Harap simpan struk ini sebagai bukti validasi saat serah terima unit.</p>
                                </div>
                            </div>
                            <div style={{display: 'flex', gap: '15px', marginTop: '25px'}}>
                                <button onClick={downloadPDF} style={btnDownload}>💾 SIMPAN PDF</button>
                                <button onClick={() => navigate('/pesanan-saya')} style={btnFinish}>SELESAI</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- MODERN STYLES ---
const pageWrapper = { 
    minHeight: '100vh', 
    backgroundColor: theme.bg,
    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url('/beranda1.png')`, 
    backgroundSize: 'cover', 
    backgroundPosition: 'center', 
    backgroundAttachment: 'fixed',
    padding: '80px 20px',
    display: 'flex',
    alignItems: 'center',
    fontFamily: "'Inter', sans-serif"
};

const contentContainer = { display: 'flex', flexWrap: 'wrap', gap: '60px', maxWidth: '1200px', margin: '0 auto', width: '100%' };
const leftSection = { flex: '1', minWidth: '350px' };
const formSection = { 
    flex: '1.4', 
    minWidth: '400px', 
    backgroundColor: 'rgba(30, 41, 59, 0.7)', 
    padding: '45px', 
    borderRadius: '28px', 
    backdropFilter: 'blur(10px)',
    border: `1px solid ${theme.border}`,
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
};

const titleStyle = { fontSize: '42px', color: theme.textMain, marginBottom: '20px', fontWeight: '900', lineHeight: '1.2' };
const subtitleStyle = { color: theme.textSub, marginBottom: '40px', fontSize: '17px', lineHeight: '1.6' };

const motorPreviewCard = { display: 'flex', alignItems: 'center', gap: '25px', backgroundColor: theme.card, padding: '25px', borderRadius: '24px', border: `1px solid ${theme.border}` };
const imgBox = { width: '140px', height: '140px', backgroundColor: '#fff', borderRadius: '16px', display: 'flex', alignItems: 'center', padding: '10px' };
const motorImg = { width: '100%', height: '100%', objectFit: 'contain' };
const motorInfo = { flex: 1 };
const badgeTipe = { fontSize: '10px', color: theme.primary, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' };
const priceTag = { color: '#22c55e', fontWeight: '800', fontSize: '24px', margin: '5px 0' };

const formStyle = { display: 'flex', flexDirection: 'column', gap: '25px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '13px', fontWeight: '700', color: theme.textSub, textTransform: 'uppercase', letterSpacing: '0.5px' };
const inputStyle = { 
    padding: '16px 20px', 
    borderRadius: '14px', 
    border: `1px solid ${theme.border}`, 
    backgroundColor: theme.inputBg, 
    color: theme.textMain, 
    fontSize: '15px', 
    outline: 'none',
    transition: '0.2s focus',
    ':focus': { borderColor: theme.primary }
};

const buttonGroup = { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' };
const btnPrimary = { padding: '18px', backgroundColor: theme.primary, color: 'white', border: 'none', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', fontSize: '16px', boxShadow: `0 10px 15px -3px rgba(249, 115, 22, 0.3)` };
const btnSecondary = { padding: '12px', backgroundColor: 'transparent', color: theme.textSub, border: 'none', fontWeight: '600', cursor: 'pointer' };

const modalOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' };
const modalContent = { backgroundColor: 'white', padding: '40px', borderRadius: '32px', maxWidth: '480px', width: '90%' };
const strukContainer = { backgroundColor: 'white', padding: '10px', color: '#000', fontFamily: 'monospace' };
const btnDownload = { flex: 1, padding: '16px', backgroundColor: theme.primary, color: 'white', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '800' };
const btnFinish = { flex: 1, padding: '16px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: '800' };

export default BuatPesanan;