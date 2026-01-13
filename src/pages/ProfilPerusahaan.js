import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- KONFIGURASI TEMA & GAMBAR ---
const theme = {
    // Kita gunakan warna RGBA untuk transparansi
    bgOverlayStart: 'rgba(15, 23, 42, 0.85)', // Warna gelap semi-transparan (atas)
    bgOverlayEnd: 'rgba(15, 23, 42, 0.95)',   // Warna gelap lebih pekat (bawah)
    cardBg: 'rgba(30, 41, 59, 0.7)',          // Warna kartu semi-transparan
    primary: '#f97316',
    success: '#22c55e',
    textMain: '#f8fafc',
    textSub: '#cbd5e1', // Warna teks diubah sedikit lebih terang agar kontras di atas foto
    borderTransparent: 'rgba(51, 65, 85, 0.5)', // Border semi-transparan
    instagram: '#e1306c',
    tiktok: '#ff0050',
    // GANTI URL INI dengan foto dealer Anda sendiri.
    // Bisa menggunakan foto dari folder public (misal: '/images/showroom-bg.jpg') atau URL eksternal.
    bgImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2070&auto=format&fit=crop' 
};

function ProfilPerusahaan() {
    const navigate = useNavigate();

    // --- DATA KONTAK ---
    const contactData = {
        whatsapp: "6283175391181", // Ganti dengan nomor asli (format 628...)
        instagram: "hanafitian_", // Ganti username IG
        tiktok: "@hanafitian_", // Ganti username TikTok
        // Ganti dengan link Google Maps Share lokasi Anda
        mapsUrl: "https://goo.gl/maps/hGkBGmkp6Prmf8oJ6" 
    };

    const handleSocialClick = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    // --- ANIMASI ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            style={styles.mainContainer}
        >
            {/* Navbar Semi-Transparan */}
            <nav style={styles.nav}>
                <h2 style={{ color: theme.primary, margin: 0, fontSize: '22px', fontWeight: '900', letterSpacing: '1px' }}>CAHAYA SAKTI MOTOR</h2>
                <button onClick={() => navigate('/beranda')} style={styles.btnBack}>Kembali Beranda</button>
            </nav>

            <div style={styles.contentContainer}>
                {/* Header Section */}
                <header style={styles.header}>
                    <motion.h1 variants={itemVariants} style={{ fontSize: '42px', fontWeight: '900', marginBottom: '20px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                        Tentang Kami
                    </motion.h1>
                    <motion.div variants={itemVariants} style={{width: '60px', height: '4px', backgroundColor: theme.primary, margin: '0 auto 20px auto', borderRadius: '2px'}} />
                    <motion.p variants={itemVariants} style={styles.headerText}>
                        Dealer Resmi Honda Cahaya Sakti Motor Boyolali hadir sebagai mitra transportasi terpercaya Anda. Kami berkomitmen menyediakan unit motor Honda terbaru dengan kualitas terbaik, dukungan suku cadang asli (HGP), dan layanan purna jual bengkel resmi (AHASS) yang profesional. Kepuasan Anda adalah prioritas kami.
                    </motion.p>
                </header>

                {/* Grid Kontak Interaktif (Glassmorphism Cards) */}
                <div style={styles.grid}>
                    {/* WhatsApp Card */}
                    <motion.div variants={itemVariants} whileHover={{ scale: 1.03, backgroundColor: 'rgba(30, 41, 59, 0.85)' }} style={styles.card} onClick={() => handleSocialClick(`https://wa.me/${contactData.whatsapp}`)}>
                        <div style={{...styles.iconCircle, background: `linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.05))`, color: theme.success}}>📞</div>
                        <h3 style={styles.cardTitle}>WhatsApp Admin</h3>
                        <p style={styles.cardText}>Konsultasi cepat mengenai harga, stok, dan promo.</p>
                        <div style={{...styles.ctaLink, color: theme.success}}>Chat Sekarang →</div>
                    </motion.div>

                    {/* Instagram Card */}
                    <motion.div variants={itemVariants} whileHover={{ scale: 1.03, backgroundColor: 'rgba(30, 41, 59, 0.85)' }} style={styles.card} onClick={() => handleSocialClick(`https://instagram.com/${contactData.instagram}`)}>
                        <div style={{...styles.iconCircle, background: `linear-gradient(135deg, rgba(225, 48, 108, 0.2), rgba(225, 48, 108, 0.05))`, color: theme.instagram}}>📸</div>
                        <h3 style={styles.cardTitle}>Instagram Resmi</h3>
                        <p style={styles.cardText}>Galeri foto unit terbaru dan info event menarik.</p>
                        <div style={{...styles.ctaLink, color: theme.instagram}}>Follow IG Kami →</div>
                    </motion.div>

                    {/* TikTok Card */}
                    <motion.div variants={itemVariants} whileHover={{ scale: 1.03, backgroundColor: 'rgba(30, 41, 59, 0.85)' }} style={styles.card} onClick={() => handleSocialClick(`https://www.tiktok.com/${contactData.tiktok}`)}>
                        <div style={{...styles.iconCircle, background: `linear-gradient(135deg, rgba(255, 0, 80, 0.2), rgba(255, 0, 80, 0.05))`, color: theme.tiktok}}>🎵</div>
                        <h3 style={styles.cardTitle}>TikTok Channel</h3>
                        <p style={styles.cardText}>Video review motor seru dan tips perawatan.</p>
                        <div style={{...styles.ctaLink, color: theme.tiktok}}>Tonton Video →</div>
                    </motion.div>

                    {/* Maps Card */}
                    <motion.div variants={itemVariants} whileHover={{ scale: 1.03, backgroundColor: 'rgba(30, 41, 59, 0.85)' }} style={styles.card} onClick={() => handleSocialClick(contactData.mapsUrl)}>
                        <div style={{...styles.iconCircle, background: `linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(249, 115, 22, 0.05))`, color: theme.primary}}>📍</div>
                        <h3 style={styles.cardTitle}>Kunjungi Dealer</h3>
                        <p style={styles.cardText}>Jl. Raya Utama Boyolali. Buka Senin - Sabtu (08.00 - 16.30).</p>
                        <div style={{...styles.ctaLink, color: theme.primary}}>Buka Google Maps →</div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

// --- STYLES LENGKAP ---
const styles = {
    mainContainer: {
        // KUNCI TAMPILAN: Layering Background Image dengan Gradient Overlay
        backgroundImage: `linear-gradient(to bottom, ${theme.bgOverlayStart}, ${theme.bgOverlayEnd}), url('${theme.bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed', // Efek parallax saat di-scroll
        minHeight: '100vh',
        color: theme.textMain,
        fontFamily: "'Inter', sans-serif"
    },
    nav: {
        padding: '20px 8%',
        borderBottom: `1px solid ${theme.borderTransparent}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        // GLASSMORPHISM NAVBAR
        backgroundColor: theme.cardBg, 
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)', // Dukungan untuk Safari
        position: 'sticky', top: 0, zIndex: 10,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    btnBack: {
        background: theme.primary,
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: '0.2s',
        boxShadow: '0 2px 4px rgba(249, 115, 22, 0.3)'
    },
    contentContainer: { padding: '60px 8%', maxWidth: '1200px', margin: '0 auto' },
    header: { textAlign: 'center', marginBottom: '70px' },
    headerText: { 
        color: theme.textSub, maxWidth: '800px', margin: '0 auto', lineHeight: '1.8', fontSize: '18px', fontWeight: '400',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)' // Sedikit bayangan agar teks terbaca jelas di atas foto
    },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' },
    card: {
        // GLASSMORPHISM CARDS
        backgroundColor: theme.cardBg,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '35px 25px',
        borderRadius: '24px',
        border: `1px solid ${theme.borderTransparent}`,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' // Shadow lembut
    },
    iconCircle: {
        width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 25px', fontSize: '28px',
        boxShadow: 'inset 0 0 10px rgba(255,255,255,0.05)'
    },
    cardTitle: { margin: '0 0 15px 0', fontSize: '20px', fontWeight: '700' },
    cardText: { color: theme.textSub, fontSize: '15px', marginBottom: '25px', lineHeight: '1.6', minHeight: '50px' },
    ctaLink: { fontWeight: '700', fontSize: '14px', letterSpacing: '0.5px' }
};

export default ProfilPerusahaan;