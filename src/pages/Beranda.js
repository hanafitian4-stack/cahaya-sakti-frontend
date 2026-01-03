import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// --- THEME CONSTANTS ---
const theme = {
    bg: '#0f172a', 
    card: '#1e293b', 
    primary: '#f97316', 
    success: '#22c55e', 
    textMain: '#f8fafc', 
    textSub: '#94a3b8', 
    border: '#334155', 
    danger: '#ef4444' 
};

function Beranda() {
    const navigate = useNavigate();
    const [motors, setMotors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedMotor, setSelectedMotor] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    
    const [formData, setFormData] = useState({
        nama_model: '', tipe: '', harga: '', deskripsi: '', gambar: '', stok: 0 
    });

    const userRole = localStorage.getItem('role');
    const userName = localStorage.getItem('userName');
    const token = localStorage.getItem('token');

    const fetchMotors = async () => {
        setLoading(true);
        try {
            // Rute GET untuk katalog tetap rute publik
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

    const handlePesanMotor = (motorId) => {
        if (!token) {
            alert("Silakan login terlebih dahulu untuk memesan.");
            navigate('/');
            return;
        }
        setShowDetail(false);
        navigate(`/buat-pesanan/${motorId}`);
    };

    const openDetailModal = (motor) => {
        setSelectedMotor(motor);
        setShowDetail(true);
    };

    const openAddModal = () => {
        setIsEditing(false);
        setFormData({ nama_model: '', tipe: '', harga: '', deskripsi: '', gambar: '', stok: 0 });
        setShowForm(true);
    };

    const openEditModal = (motor) => {
        setIsEditing(true);
        setEditId(motor.id);
        setFormData({ ...motor });
        setShowForm(true);
    };

    // --- PERBAIKAN FUNGSI SIMPAN ---
    const handleSimpanMotor = async (e) => {
        e.preventDefault();
        const dataToSubmit = { ...formData, stok: parseInt(formData.stok) };
        
        try {
            const config = { 
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json' 
                } 
            };

            if (isEditing) {
                // PERBAIKAN: Tambahkan /admin/ dan gunakan Method Spoofing (_method: 'PUT')
                await axios.post(`http://127.0.0.1:8000/api/admin/motors/${editId}`, {
                    ...dataToSubmit,
                    _method: 'PUT' 
                }, config);
            } else {
                // PERBAIKAN: Tambahkan /admin/ untuk rute tambah data
                await axios.post('http://127.0.0.1:8000/api/admin/motors', dataToSubmit, config);
            }

            setShowForm(false);
            fetchMotors();
            alert("Data berhasil disimpan!");
        } catch (err) { 
            console.error("Error Detail:", err.response);
            alert(err.response?.data?.message || "Gagal menyimpan data. Pastikan Anda login sebagai Admin."); 
        }
    };

    // --- PERBAIKAN FUNGSI HAPUS ---
    const handleHapusMotor = async (id) => {
        if (window.confirm("Hapus motor ini secara permanen?")) {
            try {
                const config = { 
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    } 
                };
                // PERBAIKAN: Tambahkan /admin/ pada URL Delete
                await axios.delete(`http://127.0.0.1:8000/api/admin/motors/${id}`, config);
                alert("Data berhasil dihapus!");
                fetchMotors();
            } catch (err) {
                console.error("Error Detail:", err.response);
                alert(err.response?.data?.message || "Gagal menghapus data.");
            }
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    // --- SISANYA TETAP SAMA (UI & STYLES) ---
    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            style={{ backgroundColor: theme.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: theme.textMain }}
        >
            <nav style={styles.nav}>
                <motion.h2 
                    whileHover={{ scale: 1.02 }}
                    style={{ color: theme.primary, margin: 0, cursor: 'pointer', fontWeight: '800', letterSpacing: '1px' }}
                    onClick={() => navigate('/beranda')}
                >
                    CAHAYA SAKTI MOTOR
                </motion.h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ fontSize: '14px', color: theme.textSub }}>
                        Halo, <b style={{color: theme.textMain}}>{userName || 'User'}</b> 
                        <span style={{marginLeft: '8px', fontSize: '11px', padding: '2px 8px', backgroundColor: theme.border, borderRadius: '4px'}}>{userRole}</span>
                    </span>
                    <div style={{ position: 'relative' }}>
                        <button onClick={() => setShowMenu(!showMenu)} style={styles.btnMenu}>⋮</button>
                        <AnimatePresence>
                            {showMenu && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={styles.dropdown}>
                                    {userRole === 'admin' ? (
                                        <>
                                            <div style={styles.menuItem} onClick={() => navigate('/pesanan-masuk')}>Pesanan Masuk</div>
                                            <div style={styles.menuItem} onClick={() => navigate('/stok-barang')}>Stok Barang</div>
                                        </>
                                    ) : (
                                        <div style={styles.menuItem} onClick={() => navigate('/pesanan-saya')}>Pesanan Saya</div>
                                    )}
                                    <div style={{...styles.menuItem, color: theme.danger, borderTop: `1px solid ${theme.border}`}} onClick={handleLogout}>Logout</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </nav>

            <div style={styles.banner}>
                <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ fontSize: '48px', fontWeight: '900', marginBottom: '10px' }}>
                    TEMUKAN MOTOR IMPIANMU
                </motion.h1>
                <p style={{ color: '#cbd5e1' }}>Dealer Resmi Honda Terpercaya di Boyolali</p>
            </div>

            <div style={{ padding: '60px 8%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h3 style={{ borderLeft: `5px solid ${theme.primary}`, paddingLeft: '15px', margin: 0, fontSize: '24px' }}>KATALOG TERBARU</h3>
                    {userRole === 'admin' && (
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openAddModal} style={styles.btnAdmin}>
                            + TAMBAH MOTOR
                        </motion.button>
                    )}
                </div>

                {loading ? <p style={{textAlign: 'center', color: theme.textSub}}>Memuat data motor...</p> : (
                    <div style={styles.grid}>
                        {motors.map((item, index) => (
                            <motion.div 
                                key={item.id} 
                                style={styles.card}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -10, borderColor: theme.primary }}
                            >
                                <div style={styles.imgContainer}>
                                    <img src={item.gambar} alt={item.nama_model} style={styles.img} />
                                </div>
                                <div style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={styles.badgeTipe}>{item.tipe}</span>
                                        <span style={{ color: theme.textSub, fontSize: '12px' }}>Stok: {item.stok}</span>
                                    </div>
                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{item.nama_model}</h4>
                                    <h3 style={{ color: theme.success, margin: '0 0 20px 0' }}>Rp {Number(item.harga).toLocaleString('id-ID')}</h3>

                                    {userRole === 'admin' ? (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => openEditModal(item)} style={{ ...styles.btnSmall, backgroundColor: '#334155' }}>Edit</button>
                                            <button onClick={() => handleHapusMotor(item.id)} style={{ ...styles.btnSmall, backgroundColor: '#450a0a', color: '#f87171' }}>Hapus</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => openDetailModal(item)} style={styles.btnPrimary}>Detail Produk</button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {(showForm || (showDetail && selectedMotor)) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.modalOverlay} onClick={() => {setShowForm(false); setShowDetail(false)}}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            style={{ ...styles.modalContent, width: showDetail ? '800px' : '450px' }} 
                            onClick={e => e.stopPropagation()}
                        >
                            {showForm ? (
                                <>
                                    <h3 style={{marginTop: 0, marginBottom: '25px'}}>{isEditing ? "Edit Unit Motor" : "Tambah Unit Baru"}</h3>
                                    <form onSubmit={handleSimpanMotor}>
                                        <label style={styles.label}>Nama Model</label>
                                        <input style={styles.input} value={formData.nama_model} onChange={e => setFormData({ ...formData, nama_model: e.target.value })} required placeholder="Contoh: Vario 160" />
                                        <label style={styles.label}>Tipe</label>
                                        <input style={styles.input} value={formData.tipe} onChange={e => setFormData({ ...formData, tipe: e.target.value })} required placeholder="Contoh: Matic" />
                                        <div style={{ display: 'flex', gap: '15px' }}>
                                            <div style={{ flex: 1 }}><label style={styles.label}>Harga</label><input style={styles.input} type="number" value={formData.harga} onChange={e => setFormData({ ...formData, harga: e.target.value })} required /></div>
                                            <div style={{ flex: 1 }}><label style={styles.label}>Stok</label><input style={styles.input} type="number" value={formData.stok} onChange={e => setFormData({ ...formData, stok: e.target.value })} required /></div>
                                        </div>
                                        <label style={styles.label}>URL Gambar</label>
                                        <input style={styles.input} value={formData.gambar} onChange={e => setFormData({ ...formData, gambar: e.target.value })} required />
                                        <label style={styles.label}>Deskripsi</label>
                                        <textarea style={{...styles.input, height: '100px'}} value={formData.deskripsi} onChange={e => setFormData({ ...formData, deskripsi: e.target.value })} required />
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                            <button type="submit" style={{ ...styles.btnPrimary, flex: 1 }}>Simpan Data</button>
                                            <button type="button" onClick={() => setShowForm(false)} style={{ ...styles.btnSmall, flex: 1, backgroundColor: 'transparent', border: `1px solid ${theme.border}` }}>Batal</button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                                    <div style={{ flex: '1', minWidth: '300px' }}>
                                        <img src={selectedMotor.gambar} style={{ width: '100%', borderRadius: '12px', backgroundColor: '#fff', padding: '10px' }} alt="motor" />
                                    </div>
                                    <div style={{ flex: '1.2' }}>
                                        <span style={styles.badgeTipe}>{selectedMotor.tipe}</span>
                                        <h2 style={{ margin: '15px 0 10px 0' }}>{selectedMotor.nama_model}</h2>
                                        <h3 style={{ color: theme.success }}>Rp {Number(selectedMotor.harga).toLocaleString('id-ID')}</h3>
                                        <p style={{ color: theme.textSub, lineHeight: '1.8', margin: '20px 0' }}>{selectedMotor.deskripsi}</p>
                                        <p style={{ fontSize: '14px' }}><b>Ketersediaan:</b> {selectedMotor.stok} Unit Ready</p>
                                        <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                                            <button onClick={() => handlePesanMotor(selectedMotor.id)} style={{ ...styles.btnPrimary, flex: 2 }}>Pesan Sekarang</button>
                                            <button onClick={() => setShowDetail(false)} style={{ ...styles.btnSmall, flex: 1, backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>Kembali</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

const styles = {
    nav: { backgroundColor: theme.card, padding: '15px 8%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', position: 'sticky', top: 0, zIndex: 99, borderBottom: `1px solid ${theme.border}` },
    btnMenu: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: theme.textMain, padding: '0 10px' },
    dropdown: { position: 'absolute', right: '0', top: '45px', backgroundColor: theme.card, boxShadow: '0 10px 25px rgba(0,0,0,0.5)', borderRadius: '8px', zIndex: 100, overflow: 'hidden', minWidth: '180px', border: `1px solid ${theme.border}` },
    menuItem: { padding: '12px 20px', cursor: 'pointer', fontSize: '14px', transition: '0.2s', color: theme.textMain, ':hover': { backgroundColor: theme.bg } },
    banner: { background: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url("beranda1.png")`, height: '450px', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' },
    card: { backgroundColor: theme.card, borderRadius: '16px', overflow: 'hidden', border: `1px solid ${theme.border}`, transition: '0.3s' },
    imgContainer: { backgroundColor: '#fff', padding: '20px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    img: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
    badgeTipe: { color: theme.primary, fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' },
    btnPrimary: { width: '100%', padding: '14px', backgroundColor: theme.primary, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', transition: '0.2s' },
    btnAdmin: { backgroundColor: theme.primary, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    btnSmall: { padding: '10px', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' },
    modalContent: { backgroundColor: theme.card, padding: '40px', borderRadius: '24px', border: `1px solid ${theme.border}`, maxHeight: '90vh', overflowY: 'auto' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.textMain, boxSizing: 'border-box', outline: 'none' },
    label: { display: 'block', fontSize: '13px', marginBottom: '8px', fontWeight: '600', color: theme.textSub }
};

export default Beranda;