import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Beranda = () => {
    const [motors, setMotors] = useState([]);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        // Ambil data dari Database MySQL lewat Laravel
        axios.get('http://127.0.0.1:8000/api/motors')
            .then(res => setMotors(res.data))
            .catch(err => console.log("Gagal ambil data", err));
    }, []);

    return (
        <div style={{ backgroundColor: '#f4f4f4', minHeight: '100vh', fontFamily: 'Segoe UI' }}>
            {/* Navbar Tetap Sama */}
            <nav style={navStyle}>
                <h2 style={{ color: '#e74c3c', margin: 0 }}>CAHAYA SAKTI MOTOR</h2>
                <div style={{ position: 'relative' }}>
                    <button onClick={() => setShowMenu(!showMenu)} style={btnMenu}>⋮</button>
                    {showMenu && (
                        <div style={dropdownStyle}>
                            <div style={menuItem}>Profil Saya</div>
                            <div style={menuItem}>Keranjang</div>
                            <div style={menuItem} onClick={() => { localStorage.clear(); window.location.href='/'; }}>Logout</div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Banner Tetap Sama */}
            <div style={bannerStyle}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>BERSINAR BERSAMA CAHAYA SAKTI MOTOR</h1>
                <p>Jl. Mawar Merah - KERA SAKTI - Madiun - Jawa Timur</p>
            </div>

            {/* Katalog Produk (Data dari Database) */}
            <div style={{ padding: '40px 5%' }}>
                <h3 style={{ borderLeft: '5px solid red', paddingLeft: '15px' }}>KATALOG HONDA TERBARU</h3>
                <div style={gridStyle}>
                    {motors.map((item) => (
                        <div key={item.id} style={cardStyle}>
                            <div style={{ padding: '10px' }}>
                                <img src={item.gambar} alt={item.nama_model} style={{ width: '100%' }} />
                            </div>
                            <div style={{ padding: '20px' }}>
                                <span style={{ color: 'red', fontSize: '12px' }}>{item.tipe}</span>
                                <h4 style={{ margin: '5px 0' }}>{item.nama_model}</h4>
                                <p style={{ fontSize: '12px', color: '#666' }}>{item.deskripsi}</p>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '15px 0' }}>
                                    Rp {item.harga.toLocaleString('id-ID')}
                                </div>
                                <button style={btnBuy}>Detail Produk</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- STYLE TETAP SAMA ---
const navStyle = { backgroundColor: '#fff', padding: '15px 5%', display: 'flex', justifyContent: 'space-between', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };
const btnMenu = { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' };
const dropdownStyle = { position: 'absolute', right: 0, top: '40px', backgroundColor: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', borderRadius: '8px', width: '150px', zIndex: 100 };
const menuItem = { padding: '10px 20px', cursor: 'pointer', fontSize: '14px', borderBottom: '1px solid #eee' };
const bannerStyle = { background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=2070&auto=format&fit=crop")', height: '250px', backgroundSize: 'cover', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px', marginTop: '20px' };
const cardStyle = { backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' };
const btnBuy = { width: '100%', padding: '10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default Beranda;