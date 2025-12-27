import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
// Library untuk PDF
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BuatPesanan = () => {
    const { motorId } = useParams();
    const navigate = useNavigate();
    const [motor, setMotor] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const strukRef = useRef(); // Referensi untuk menangkap gambar struk

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
            
            // Simpan data hasil respons untuk ditampilkan di struk
            setOrderData(response.data.data || response.data); 
            setIsSuccess(true); // Tampilkan modal struk
        } catch (error) {
            const pesan = error.response?.data?.message || "Cek koneksi/validasi";
            alert("Gagal simpan: " + pesan);
        }
    };

    // Fungsi Simpan PDF
    const downloadPDF = () => {
        const element = strukRef.current;
        html2canvas(element, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
            pdf.save(`Struk_CSM_${orderData.id || 'Order'}.pdf`);
        });
    };

    return (
        <div style={pageWrapper}>
            <div style={contentContainer}>
                <div style={leftSection}>
                    <h2 style={titleStyle}>Konfirmasi Pemesanan</h2>
                    <p style={subtitleStyle}>Silakan lengkapi data diri Anda untuk melanjutkan proses pembelian unit motor.</p>
                    
                    {motor && (
                        <div style={motorPreviewCard}>
                            <img src={motor.gambar} alt={motor.nama_model} style={motorImg} />
                            <div style={motorInfo}>
                                <h3 style={{margin: 0, color: '#2d3436'}}>{motor.nama_model}</h3>
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
                            <input style={inputStyle} type="number" placeholder="08..." onChange={e => setFormData({...formData, nomor_wa: e.target.value})} required />
                        </div>
                        <div style={inputGroup}>
                            <label style={labelStyle}>Alamat Pengiriman</label>
                            <textarea style={{...inputStyle, minHeight: '80px'}} placeholder="Alamat lengkap" onChange={e => setFormData({...formData, alamat: e.target.value})} required />
                        </div>
                        <div style={inputGroup}>
                            <label style={labelStyle}>Catatan Tambahan (Opsional)</label>
                            <textarea style={{...inputStyle, minHeight: '60px'}} placeholder="Warna atau waktu pengiriman" onChange={e => setFormData({...formData, catatan: e.target.value})} />
                        </div>
                        <div style={buttonGroup}>
                            <button type="submit" style={btnPrimary}>KONFIRMASI SEKARANG</button>
                            <button type="button" onClick={() => navigate('/beranda')} style={btnSecondary}>BATAL</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* MODAL STRUK (Hanya muncul jika isSuccess = true) */}
            {isSuccess && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <div ref={strukRef} style={strukContainer}>
                            <div style={{textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '10px'}}>
                                <h2 style={{margin: 0}}>CAHAYA SAKTI MOTOR</h2>
                                <p style={{fontSize: '12px', margin: '5px 0'}}>Bukti Pemesanan Unit Motor Resmi</p>
                            </div>
                            <div style={{margin: '20px 0', fontSize: '14px', lineHeight: '2'}}>
                                <p><strong>ID Pesanan:</strong> #{orderData?.id}</p>
                                <p><strong>Tanggal:</strong> {new Date().toLocaleDateString('id-ID')}</p>
                                <hr />
                                <p><strong>Nama Pembeli:</strong> {formData.nama_lengkap}</p>
                                <p><strong>WhatsApp:</strong> {formData.nomor_wa}</p>
                                <p><strong>Unit Motor:</strong> {motor?.nama_model}</p>
                                <p><strong>Total Harga:</strong> Rp {Number(motor?.harga).toLocaleString('id-ID')}</p>
                                <p><strong>Alamat:</strong> {formData.alamat}</p>
                            </div>
                            <div style={{textAlign: 'center', marginTop: '20px', borderTop: '1px dashed #ccc', paddingTop: '10px'}}>
                                <p style={{fontSize: '11px'}}>Silakan bawa bukti ini ke dealer untuk proses verifikasi lanjut.</p>
                            </div>
                        </div>
                        <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                            <button onClick={downloadPDF} style={btnDownload}>SIMPAN PDF</button>
                            <button onClick={() => navigate('/pesanan-saya')} style={btnFinish}>SELESAI</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- TAMBAHAN STYLES ---
const modalOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContent = { backgroundColor: 'white', padding: '30px', borderRadius: '20px', maxWidth: '450px', width: '90%' };
const strukContainer = { backgroundColor: 'white', padding: '30px', color: '#000', fontFamily: 'Courier New, monospace' }; // Font struk
const btnDownload = { flex: 1, padding: '14px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };
const btnFinish = { flex: 1, padding: '14px', backgroundColor: '#2d3436', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };

// --- STYLES LAMA TETAP SAMA ---
const pageWrapper = { minHeight: '100vh', backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/beground.png')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', paddingTop: '100px', paddingBottom: '40px', display: 'flex', alignItems: 'center' };
const contentContainer = { display: 'flex', flexWrap: 'wrap', gap: '40px', maxWidth: '1100px', margin: '0 auto', padding: '0 20px', alignItems: 'flex-start' };
const leftSection = { flex: '1', minWidth: '300px', color: '#ffffff' };
const formSection = { flex: '1.2', minWidth: '350px', backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid #eee' };
const titleStyle = { fontSize: '32px', color: '#ffffff', marginBottom: '15px', fontWeight: '850' };
const subtitleStyle = { color: '#ffffff', marginBottom: '35px', lineHeight: '1.7', fontSize: '16px', opacity: '0.9' };
const motorPreviewCard = { display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
const motorImg = { width: '120px', height: '120px', objectFit: 'contain' };
const motorInfo = { display: 'flex', flexDirection: 'column' };
const priceTag = { color: '#e74c3c', fontWeight: 'bold', fontSize: '20px', marginTop: '5px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '25px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '10px' };
const labelStyle = { fontSize: '15px', fontWeight: '700', color: '#2d3436' };
const inputStyle = { padding: '14px 18px', borderRadius: '12px', border: '1px solid #dfe6e9', backgroundColor: '#f9f9f9', fontSize: '15px', outline: 'none' };
const buttonGroup = { marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '12px' };
const btnPrimary = { padding: '16px', backgroundColor: '#2d3436', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' };
const btnSecondary = { padding: '12px', backgroundColor: 'transparent', color: '#636e72', border: 'none', fontWeight: '600', cursor: 'pointer' };

export default BuatPesanan;