import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Beranda = () => {
    const [motors, setMotors] = useState([]);
    const [showMenu, setShowMenu] = useState(false);

    // Simulasi data jika API belum siap, atau ambil dari Laravel
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/motors');
                setMotors(response.data);
            } catch (error) {
                // Data dummy jika database Laravel kamu masih kosong
                setMotors([
                    { id: 1, nama: 'Honda Vario 160', harga: 27350000, tipe: 'Matic', gambar: 'https://cdn.astrapay.com/image/product/vario160.png', deskripsi: 'Mesin 160cc eSP+, Idling Stop System, dan Full Digital Panel Meter.' },
                    { id: 2, nama: 'Honda PCX 160', harga: 32670000, tipe: 'Matic Luxury', gambar: 'https://www.astra-honda.com/images/product/pcx-160/color/01-majestic-matte-red.png', deskripsi: 'Kemewahan berkendara dengan fitur Honda Selectable Torque Control (HSTC).' },
                    { id: 3, nama: 'Honda Beat Deluxe', harga: 18900000, tipe: 'Matic', gambar: 'https://www.astra-honda.com/images/product/beat/color/deluxe-black.png', deskripsi: 'Irit bahan bakar, lincah, dan kini dilengkapi Power Charger.' },
                    { id: 4, nama: 'Honda CBR150R', harga: 37780000, tipe: 'Sport', gambar: 'https://www.astra-honda.com/images/product/cbr150r/color/victory-red-black.png', deskripsi: 'Sensasi balap sesungguhnya dengan Inverted Front Suspension.' },
                ]);
            }
        };
        fetchData();
    }, []);

    return (
        <div style={{ backgroundColor: '#f4f4f4', minHeight: '100vh', fontFamily: 'Segoe UI, Roboto' }}>
            {/* Header / Navbar */}
            <nav style={{ 
                backgroundColor: '#ffffff', padding: '15px 5%', display: 'flex', 
                justifyContent: 'space-between', alignItems: 'center', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 1000 
            }}>
                <h2 style={{ color: '#e74c3c', margin: 0, fontWeight: 'bold' }}>CAHAYA SAKTI MOTOR</h2>
                
                <div style={{ position: 'relative' }}>
                    <button 
                        onClick={() => setShowMenu(!showMenu)}
                        style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#333' }}
                    >
                        ⋮
                    </button>

                    {showMenu && (
                        <div style={{ 
                            position: 'absolute', right: 0, top: '40px', backgroundColor: 'white', 
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)', borderRadius: '8px', width: '200px', overflow: 'hidden'
                        }}>
                            <div style={menuItemStyle}>Profil Saya</div>
                            <div style={menuItemStyle}>Keranjang Belanja</div>
                            <div style={menuItemStyle}>Cek Pesanan</div>
                            <div 
                                style={{ ...menuItemStyle, borderTop: '1px solid #eee', color: 'red' }}
                                onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                            >
                                Logout
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Banner Penawaran */}
            <div style={{ 
                background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://www.astra-honda.com/images/banner/home-banner.jpg")',
                height: '300px', backgroundSize: 'cover', backgroundPosition: 'center',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '3rem', margin: 0 }}>PROMO AKHIR TAHUN</h1>
                <p style={{ fontSize: '1.2rem' }}>Dapatkan DP Ringan & Cicilan Rendah hanya di Cahaya Sakti</p>
            </div>

            {/* Katalog Produk */}
            <div style={{ padding: '40px 5%' }}>
                <h3 style={{ borderLeft: '5px solid #e74c3c', paddingLeft: '15px', marginBottom: '30px' }}>KATALOG HONDA TERBARU</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                    {motors.map((item) => (
                        <div key={item.id} style={cardStyle}>
                            <div style={{ height: '200px', overflow: 'hidden', padding: '10px' }}>
                                <img src={item.gambar} alt={item.nama} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <div style={{ padding: '20px' }}>
                                <span style={{ fontSize: '12px', color: '#e74c3c', fontWeight: 'bold', textTransform: 'uppercase' }}>{item.tipe}</span>
                                <h4 style={{ margin: '5px 0', fontSize: '1.2rem' }}>{item.nama}</h4>
                                <p style={{ fontSize: '13px', color: '#666', height: '40px', overflow: 'hidden' }}>{item.deskripsi}</p>
                                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#2c3e50', margin: '15px 0' }}>
                                    Rp {item.harga.toLocaleString('id-ID')}
                                </div>
                                <button style={buttonStyle}>Detail Produk</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// CSS-in-JS Styles
const menuItemStyle = {
    padding: '12px 20px', cursor: 'pointer', fontSize: '14px', borderBottom: '1px solid #f9f9f9', transition: '0.3s'
};

const cardStyle = {
    backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease'
};

const buttonStyle = {
    width: '100%', padding: '12px', backgroundColor: '#e74c3c', color: 'white', 
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
};

export default Beranda;
