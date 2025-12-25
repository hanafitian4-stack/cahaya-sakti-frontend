import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

function Beranda() {
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
    const [formData, setFormData] = useState({
        nama_model: '', tipe: '', harga: '', deskripsi: '', gambar: ''
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

    // 2. Fungsi Pesan Motor
    const handlePesanMotor = async (motorId) => {
        if (!token) {
            alert("Silakan login terlebih dahulu untuk memesan.");
            return;
        }
        try {
            await axios.post('http://127.0.0.1:8000/api/orders',
                { motor_id: motorId },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            alert("Pesanan Berhasil! Admin akan segera menghubungi Anda.");
            setShowDetail(false);
        } catch (err) {
            alert("Gagal melakukan pemesanan. Pastikan backend orders sudah siap.");
        }
    };

    // 3. Helper UI
    const openDetailModal = (motor) => {
        setSelectedMotor(motor);
        setShowDetail(true);
    };

    const openAddModal = () => {
        setIsEditing(false);
        setFormData({ nama_model: '', tipe: '', harga: '', deskripsi: '', gambar: '' });
        setShowForm(true);
    };

    const openEditModal = (motor) => {
        setIsEditing(true);
        setEditId(motor.id);
        setFormData({ ...motor });
        setShowForm(true);
    };

    const handleSimpanMotor = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            if (isEditing) {
                await axios.put(`http://127.0.0.1:8000/api/motors/${editId}`, formData, config);
            } else {
                await axios.post('http://127.0.0.1:8000/api/motors', formData, config);
            }
            setShowForm(false);
            fetchMotors();
        } catch (err) { alert("Gagal menyimpan data."); }
    };

    const handleHapusMotor = async (id) => {
        if (window.confirm("Hapus motor ini?")) {
            await axios.delete(`http://127.0.0.1:8000/api/motors/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchMotors();
        }
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
                    style={{ color: '#e74c3c', margin: 0 }}
                >
                    CAHAYA SAKTI MOTOR
                </motion.h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span>Halo, <b>{userName || 'User'}</b></span>
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
                                <div style={menuItem} onClick={() => { localStorage.clear(); window.location.href = '/'; } }>Logout</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>

            {/* BANNER */}
            <motion.div 
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                style={bannerStyle}
            >
                <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    BERSINAR BERSAMA CAHAYA SAKTI MOTOR
                </motion.h1>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    Dapatkan DP Ringan & Cicilan Rendah
                </motion.p>
            </motion.div>

            {/* KATALOG */}
            <div style={{ padding: '40px 8%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                    <h3 style={{ borderLeft: '5px solid #e74c3c', paddingLeft: '15px' }}>KATALOG HONDA TERBARU</h3>
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

                {loading ? <p>Memuat...</p> : (
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
                                    <small style={{ color: '#e74c3c', fontWeight: 'bold' }}>{item.tipe}</small>
                                    <h4>{item.nama_model}</h4>
                                    <h3>Rp {Number(item.harga).toLocaleString('id-ID')}</h3>

                                    {userRole === 'admin' ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => openEditModal(item)} style={{ ...btnBuy, backgroundColor: '#f39c12' }}>Ubah</motion.button>
                                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleHapusMotor(item.id)} style={{ ...btnBuy, backgroundColor: '#333' }}>Hapus</motion.button>
                                        </div>
                                    ) : (
                                        <motion.button 
                                            whileHover={{ scale: 1.05, backgroundColor: '#c0392b' }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => openDetailModal(item)} 
                                            style={btnBuy}
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

            {/* MODAL DETAIL PRODUK */}
            <AnimatePresence>
                {showDetail && selectedMotor && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={modalOverlay}
                    >
                        <motion.div 
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            style={{ ...modalContent, width: '850px', maxWidth: '95%' }}
                        >
                            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', textAlign: 'left' }}>
                                <div style={{ flex: '1', minWidth: '300px' }}>
                                    <motion.img 
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        src={selectedMotor.gambar} 
                                        style={{ width: '100%', borderRadius: '15px' }} 
                                        alt="motor" 
                                    />
                                </div>
                                <div style={{ flex: '1.2', minWidth: '300px' }}>
                                    <small style={{ color: '#e74c3c', fontWeight: 'bold' }}>{selectedMotor.tipe}</small>
                                    <h2 style={{ margin: '10px 0' }}>{selectedMotor.nama_model}</h2>
                                    <h3 style={{ color: '#27ae60' }}>Rp {Number(selectedMotor.harga).toLocaleString('id-ID')}</h3>
                                    <p style={{ color: '#666', lineHeight: '1.6', margin: '20px 0' }}>{selectedMotor.deskripsi}</p>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handlePesanMotor(selectedMotor.id)} style={{ ...btnBuy, flex: 2 }}>Pesan Sekarang</motion.button>
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowDetail(false)} style={{ ...btnAction, backgroundColor: '#95a5a6', flex: 1 }}>Tutup</motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MODAL FORM ADMIN */}
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
                            style={modalContent}
                        >
                            <h3>{isEditing ? "Ubah Motor" : "Tambah Motor"}</h3>
                            <form onSubmit={handleSimpanMotor}>
                                <input style={inputStyle} value={formData.nama_model} placeholder="Nama Model" onChange={e => setFormData({ ...formData, nama_model: e.target.value })} required />
                                <input style={inputStyle} value={formData.tipe} placeholder="Tipe" onChange={e => setFormData({ ...formData, tipe: e.target.value })} required />
                                <input style={inputStyle} value={formData.harga} placeholder="Harga" type="number" onChange={e => setFormData({ ...formData, harga: e.target.value })} required />
                                <input style={inputStyle} value={formData.gambar} placeholder="URL Gambar" onChange={e => setFormData({ ...formData, gambar: e.target.value })} required />
                                <textarea style={inputStyle} value={formData.deskripsi} placeholder="Deskripsi" onChange={e => setFormData({ ...formData, deskripsi: e.target.value })} required />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" style={{ ...btnAction, backgroundColor: '#27ae60', flex: 1 }}>Simpan</motion.button>
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={() => setShowForm(false)} style={{ ...btnAction, backgroundColor: '#95a5a6', flex: 1 }}>Batal</motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// --- STYLES (Tetap Sama) ---
const navStyle = { backgroundColor: '#fff', padding: '15px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 99 };
const btnMenu = { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' };
const dropdownStyle = { position: 'absolute', right: '8%', top: '60px', backgroundColor: '#fff', boxShadow: '0 5px 20px rgba(0,0,0,0.1)', borderRadius: '8px', zIndex: 100 };
const menuItem = { padding: '12px 25px', cursor: 'pointer' };
const bannerStyle = { background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=2070")', height: '350px', backgroundSize: 'cover', backgroundPosition: 'center', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' };
const cardStyle = { backgroundColor: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', cursor: 'pointer' };
const imgStyle = { width: '100%', height: '180px', objectFit: 'contain', padding: '10px' };
const btnBuy = { width: '100%', padding: '12px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.3s' };
const btnAdmin = { backgroundColor: '#27ae60', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContent = { backgroundColor: '#fff', padding: '30px', borderRadius: '20px', width: '450px' };
const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };
const btnAction = { padding: '12px', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };

export default Beranda;