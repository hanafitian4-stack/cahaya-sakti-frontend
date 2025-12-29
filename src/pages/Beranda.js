import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Beranda() {
    const navigate = useNavigate();
    const [motors, setMotors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // State untuk Detail Produk
    const [selectedMotor, setSelectedMotor] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    // Logic untuk CRUD Admin
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    
    // PERBAIKAN: Menambahkan 'stok' ke dalam state awal
    const [formData, setFormData] = useState({
        nama_model: '', 
        tipe: '', 
        harga: '', 
        deskripsi: '', 
        gambar: '',
        stok: 0 // Default stok 0
    });

    const userRole = localStorage.getItem('role');
    const userName = localStorage.getItem('userName');
    const token = localStorage.getItem('token');

    // 1. Ambil Data
    const fetchMotors = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/motors');
            setMotors(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMotors();
    }, []);

    // 2. Navigasi
    const handlePesanMotor = (motorId) => {
        if (!token) {
            alert("Silakan login terlebih dahulu untuk memesan.");
            navigate('/');
            return;
        }
        setShowDetail(false);
        navigate(`/buat-pesanan/${motorId}`);
    };

    // 3. Helper UI
    const openDetailModal = (motor) => {
        setSelectedMotor(motor);
        setShowDetail(true);
    };

    const openAddModal = () => {
        setIsEditing(false);
        // Reset form dengan stok 0
        setFormData({ nama_model: '', tipe: '', harga: '', deskripsi: '', gambar: '', stok: 0 });
        setShowForm(true);
    };

    const openEditModal = (motor) => {
        setIsEditing(true);
        setEditId(motor.id);
        // Memuat data motor termasuk stok yang ada di database
        setFormData({ ...motor });
        setShowForm(true);
    };

    const handleSimpanMotor = async (e) => {
        e.preventDefault();
        
        // Apa yang akan terjadi: Mengonversi stok ke Integer agar tidak error di Laravel
        const dataToSubmit = {
            ...formData,
            stok: parseInt(formData.stok)
        };

        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            if (isEditing) {
                await axios.put(`http://127.0.0.1:8000/api/motors/${editId}`, dataToSubmit, config);
            } else {
                await axios.post('http://127.0.0.1:8000/api/motors', dataToSubmit, config);
            }
            setShowForm(false);
            fetchMotors();
            alert("Data berhasil disimpan!");
        } catch (err) { 
            alert(err.response?.data?.message || "Gagal menyimpan data."); 
        }
    };

    const handleHapusMotor = async (id) => {
        if (window.confirm("Hapus motor ini?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/motors/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                fetchMotors();
            } catch (err) {
                alert("Gagal menghapus data.");
            }
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.8 }}
            style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'Segoe UI' }}
        >
            {/* NAVBAR */}
            <nav style={navStyle}>
                <motion.h2 
                    initial={{ x: -20 }} 
                    animate={{ x: 0 }} 
                    style={{ color: '#e74c3c', margin: 0, cursor: 'pointer', fontWeight: '800' }}
                    onClick={() => navigate('/beranda')}
                >
                    CAHAYA SAKTI MOTOR
                </motion.h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '14px' }}>Halo, <b>{userName || 'User'}</b> <span style={{color: '#95a5a6'}}>({userRole})</span></span>
                    <div style={{ position: 'relative' }}>
                        <motion.button 
                            whileTap={{ scale: 0.8 }}
                            onClick={() => setShowMenu(!showMenu)} 
                            style={btnMenu}
                        >
                            ⋮
                        </motion.button>
                        
                        <AnimatePresence>
                            {showMenu && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    style={dropdownStyle}
                                >
                                    {userRole === 'admin' ? (
                                        <>
                                            <div style={menuItem} onClick={() => navigate('/pesanan-masuk')}>📥 Pesanan Masuk</div>
                                            <div style={menuItem} onClick={() => navigate('/stok-barang')}>🏍️ Stok Barang</div>
                                        </>
                                    ) : (
                                        <div style={menuItem} onClick={() => navigate('/pesanan-saya')}>📦 Pesanan Saya</div>
                                    )}
                                    <div style={{...menuItem, color: '#e74c3c', borderTop: '1px solid #eee'}} onClick={handleLogout}>🚪 Logout</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </nav>

            {/* BANNER */}
            <motion.div 
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                style={bannerStyle}
            >
                <motion.h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '10px' }}>
                    TEMUKAN MOTOR IMPIANMU
                </motion.h1>
                <p>Jl. Waduk Cengkli, Ngesrep, Ngemplak, Boyolali, Jawa Tengah</p>
            </motion.div>

            {/* KATALOG */}
            <div style={{ padding: '40px 8%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h3 style={{ borderLeft: '5px solid #e74c3c', paddingLeft: '15px', margin: 0 }}>KATALOG HONDA TERBARU</h3>
                    {userRole === 'admin' && (
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={openAddModal} 
                            style={btnAdmin}
                        >
                            + TAMBAH DATA
                        </motion.button>
                    )}
                </div>

                {loading ? <p style={{textAlign: 'center'}}>Memuat data motor...</p> : (
                    <div style={gridStyle}>
                        {motors.map((item, index) => (
                            <motion.div 
                                key={item.id} 
                                style={cardStyle}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -10, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                            >
                                <img src={item.gambar} alt={item.nama_model} style={imgStyle} />
                                <div style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <small style={{ color: '#e74c3c', fontWeight: 'bold' }}>{item.tipe}</small>
                                        <small style={{ color: '#7f8c8d' }}>Stok: {item.stok}</small>
                                    </div>
                                    <h4 style={{ margin: '5px 0' }}>{item.nama_model}</h4>
                                    <h3 style={{ color: '#27ae60', margin: '10px 0' }}>Rp {Number(item.harga).toLocaleString('id-ID')}</h3>

                                    {userRole === 'admin' ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                                            <motion.button onClick={() => openEditModal(item)} style={{ ...btnBuy, backgroundColor: '#f39c12' }}>Ubah</motion.button>
                                            <motion.button onClick={() => handleHapusMotor(item.id)} style={{ ...btnBuy, backgroundColor: '#333' }}>Hapus</motion.button>
                                        </div>
                                    ) : (
                                        <motion.button 
                                            onClick={() => openDetailModal(item)} 
                                            style={{...btnBuy, marginTop: '10px'}}
                                        >
                                            Detail Produk
                                        </motion.button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL FORM ADMIN (TAMBAH/UBAH) */}
            <AnimatePresence>
                {showForm && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={modalOverlay}
                    >
                        <motion.div 
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            style={{ ...modalContent, maxHeight: '90vh', overflowY: 'auto' }}
                        >
                            <h3 style={{marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px'}}>
                                {isEditing ? "📝 Ubah Data Motor" : "➕ Tambah Motor Baru"}
                            </h3>
                            <form onSubmit={handleSimpanMotor}>
                                <label style={labelStyle}>Nama Model</label>
                                <input style={inputStyle} value={formData.nama_model} onChange={e => setFormData({ ...formData, nama_model: e.target.value })} required />
                                
                                <label style={labelStyle}>Tipe Motor</label>
                                <input style={inputStyle} value={formData.tipe} onChange={e => setFormData({ ...formData, tipe: e.target.value })} required />
                                
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>Harga (Rp)</label>
                                        <input style={inputStyle} type="number" value={formData.harga} onChange={e => setFormData({ ...formData, harga: e.target.value })} required />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>Stok Unit</label>
                                        <input 
                                            style={inputStyle} 
                                            type="number" 
                                            min="0"
                                            value={formData.stok} 
                                            onChange={e => setFormData({ ...formData, stok: e.target.value })} 
                                            required 
                                        />
                                    </div>
                                </div>

                                <label style={labelStyle}>URL Gambar</label>
                                <input style={inputStyle} value={formData.gambar} onChange={e => setFormData({ ...formData, gambar: e.target.value })} required />
                                
                                <label style={labelStyle}>Deskripsi</label>
                                <textarea style={{...inputStyle, height: '80px'}} value={formData.deskripsi} onChange={e => setFormData({ ...formData, deskripsi: e.target.value })} required />
                                
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <motion.button type="submit" style={{ ...btnAction, backgroundColor: '#27ae60', flex: 1 }}>SIMPAN</motion.button>
                                    <motion.button type="button" onClick={() => setShowForm(false)} style={{ ...btnAction, backgroundColor: '#95a5a6', flex: 1 }}>BATAL</motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MODAL DETAIL PRODUK (Untuk User) - Tetap sama seperti kode Anda sebelumnya */}
            <AnimatePresence>
                {showDetail && selectedMotor && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={modalOverlay}
                        onClick={() => setShowDetail(false)}
                    >
                        <motion.div 
                            style={{ ...modalContent, width: '850px', maxWidth: '95%' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', textAlign: 'left' }}>
                                <div style={{ flex: '1', minWidth: '300px' }}>
                                    <img src={selectedMotor.gambar} style={{ width: '100%', borderRadius: '15px' }} alt="motor" />
                                </div>
                                <div style={{ flex: '1.2', minWidth: '300px' }}>
                                    <small style={{ color: '#e74c3c', fontWeight: 'bold' }}>{selectedMotor.tipe}</small>
                                    <h2 style={{ margin: '10px 0' }}>{selectedMotor.nama_model}</h2>
                                    <h3 style={{ color: '#27ae60' }}>Rp {Number(selectedMotor.harga).toLocaleString('id-ID')}</h3>
                                    <p style={{ color: '#666', lineHeight: '1.6', margin: '20px 0' }}>{selectedMotor.deskripsi}</p>
                                    <p style={{ fontSize: '14px', color: '#2c3e50' }}><b>Sisa Stok:</b> {selectedMotor.stok} unit</p>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handlePesanMotor(selectedMotor.id)} style={{ ...btnBuy, flex: 2 }}>Pesan Sekarang</button>
                                        <button onClick={() => setShowDetail(false)} style={{ ...btnAction, backgroundColor: '#95a5a6', flex: 1 }}>Tutup</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// --- STYLES ---
const navStyle = { backgroundColor: '#fff', padding: '15px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 99 };
const btnMenu = { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', padding: '5px 10px' };
const dropdownStyle = { position: 'absolute', right: '0', top: '40px', backgroundColor: '#fff', boxShadow: '0 5px 20px rgba(0,0,0,0.1)', borderRadius: '12px', zIndex: 100, overflow: 'hidden', minWidth: '180px' };
const menuItem = { padding: '15px 20px', cursor: 'pointer', fontSize: '14px', transition: '0.3s', textAlign: 'left' };
const bannerStyle = { background: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("beranda1.png")', height: '400px', backgroundSize: 'cover', backgroundPosition: 'center', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' };
const cardStyle = { backgroundColor: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', cursor: 'default' };
const imgStyle = { width: '100%', height: '200px', objectFit: 'contain', padding: '10px', backgroundColor: '#fdfdfd' };
const btnBuy = { width: '100%', padding: '12px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const btnAdmin = { backgroundColor: '#27ae60', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContent = { backgroundColor: '#fff', padding: '30px', borderRadius: '20px', width: '450px' };
const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };
const labelStyle = { display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: '#34495e' };
const btnAction = { padding: '12px', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };

export default Beranda;