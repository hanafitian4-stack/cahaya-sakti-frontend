import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

const DetailPesananUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const componentRef = useRef();
    const [detail, setDetail] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/pesanan/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDetail(response.data);
            } catch (err) {
                console.error(err);
                alert("Data tidak ditemukan");
            }
        };
        fetchDetail();
    }, [id, token]);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Invoice_CSM_${id}`,
    });

    if (!detail) return <p style={{textAlign:'center', marginTop:'100px'}}>Memuat rincian...</p>;

    return (
        <div style={pageWrapper}>
            <div style={container}>
                <div style={actionButtons}>
                    <button onClick={() => navigate(-1)} style={btnSecondary}>← Kembali</button>
                    <button onClick={handlePrint} style={btnPrimary}>🖨️ Cetak / Simpan PDF</button>
                </div>

                <div ref={componentRef} style={invoicePaper}>
                    <div style={header}>
                        <h1 style={{color: '#e74c3c', margin: 0}}>CAHAYA SAKTI MOTOR</h1>
                        <p style={{margin: 0, fontSize: '12px'}}>Dealer Resmi Sepeda Motor Honda</p>
                    </div>
                    
                    <div style={divider}></div>

                    <h3 style={{textAlign: 'center', marginBottom: '30px'}}>BUKTI PEMESANAN UNIT</h3>

                    <div style={infoGrid}>
                        <div>
                            <p style={label}>ID TRANSAKSI</p>
                            <p style={val}>#CSM-{detail.id}</p>
                        </div>
                        <div style={{textAlign: 'right'}}>
                            <p style={label}>TANGGAL PESAN</p>
                            <p style={val}>{new Date(detail.created_at).toLocaleDateString('id-ID')}</p>
                        </div>
                    </div>

                    <div style={section}>
                        <h4 style={sectionTitle}>RINCIAN PEMESAN</h4>
                        <p style={val}>{detail.nama_lengkap}</p>
                        <p style={subVal}>{detail.nomor_wa}</p>
                        <p style={subVal}>{detail.alamat}</p>
                    </div>

                    <div style={section}>
                        <h4 style={sectionTitle}>RINCIAN UNIT</h4>
                        <div style={motorBox}>
                            <h3 style={{margin: '0 0 5px 0', color: '#2c3e50'}}>{detail.motor?.nama_model}</h3>
                            <p style={{margin: 0}}>Warna: <strong>{detail.warna}</strong></p>
                            <p style={{margin: '10px 0 0 0'}}>Status: 
                                <span style={{marginLeft: '10px', color: '#e67e22', fontWeight: 'bold'}}>
                                    {detail.status.toUpperCase()}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div style={footer}>
                        <p style={{fontSize: '11px', color: '#7f8c8d'}}>*Bukti ini sah sebagai tanda pemesanan unit di Cahaya Sakti Motor.</p>
                        <p style={{fontSize: '11px', color: '#7f8c8d'}}>Dicetak pada: {new Date().toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- STYLES DETAIL ---
const pageWrapper = { minHeight: '100vh', backgroundImage: `url('/beranda1.png')`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '50px 20px' };
const container = { maxWidth: '800px', margin: '0 auto' };
const actionButtons = { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' };
const btnPrimary = { padding: '12px 25px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };
const btnSecondary = { padding: '12px 25px', backgroundColor: '#fff', color: '#333', border: '1px solid #ddd', borderRadius: '10px', cursor: 'pointer' };
const invoicePaper = { backgroundColor: 'white', padding: '50px', borderRadius: '2px', boxShadow: '0 0 20px rgba(0,0,0,0.2)' };
const header = { textAlign: 'center', marginBottom: '20px' };
const divider = { height: '3px', backgroundColor: '#e74c3c', marginBottom: '20px' };
const infoGrid = { display: 'flex', justifyContent: 'space-between', marginBottom: '40px' };
const section = { marginBottom: '30px' };
const sectionTitle = { fontSize: '12px', color: '#95a5a6', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px' };
const label = { fontSize: '11px', color: '#95a5a6', margin: 0 };
const val = { fontSize: '16px', fontWeight: 'bold', margin: '5px 0' };
const subVal = { fontSize: '14px', color: '#555', margin: '2px 0' };
const motorBox = { padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', border: '1px solid #eee' };
const footer = { marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '20px', textAlign: 'center' };

export default DetailPesananUser;