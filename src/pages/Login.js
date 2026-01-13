import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        localStorage.clear();

        const url = isRegister 
            ? 'http://127.0.0.1:8000/api/register' 
            : 'http://127.0.0.1:8000/api/login';

        const payload = isRegister 
            ? { name, email, password, role: 'user' } 
            : { email, password };

        try {
            const response = await axios.post(url, payload);

            if (isRegister) {
                alert("Akun berhasil dibuat! Silakan login.");
                setIsRegister(false);
                setName('');
            } else {
                const token = response.data.token || response.data.access_token;
                localStorage.setItem('token', token);
                
                if (response.data.user) {
                    localStorage.setItem('role', response.data.user.role);
                    localStorage.setItem('userName', response.data.user.name);
                    alert(`Selamat Datang, ${response.data.user.name}!`);
                    window.location.href = '/beranda';
                }
            }
        } catch (error) {
            const pesanError = error.response?.data?.message || "Koneksi ke server gagal!";
            alert("Gagal: " + pesanError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={logoWrapper}>
                    <h1 style={logoStyle}>CAHAYA SAKTI</h1>
                    <p style={subtitleStyle}>DEALER RESMI SEPEDA MOTOR HONDA</p>
                </div>
                
                <h3 style={titleStyle}>
                    {isRegister ? 'BUAT AKUN BARU' : 'SILAHKAN LOGIN'}
                </h3>

                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <div style={inputGroup}>
                            <label style={labelStyle}>Nama Lengkap</label>
                            <input 
                                type="text" 
                                required 
                                placeholder="Masukkan nama lengkap"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                    )}

                    <div style={inputGroup}>
                        <label style={labelStyle}>Email</label>
                        <input 
                            type="email" 
                            required 
                            placeholder="contoh@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div style={inputGroup}>
                        <label style={labelStyle}>Password</label>
                        <input 
                            type="password" 
                            required 
                            placeholder="Masukkan password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <button type="submit" style={loading ? btnDisabled : btnSubmit} disabled={loading}>
                        {loading ? 'MEMPROSES...' : (isRegister ? 'DAFTAR SEKARANG' : 'MASUK KE SISTEM')}
                    </button>
                </form>

                <p style={footerTextStyle}>
                    {isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'} 
                    <span 
                        onClick={() => setIsRegister(!isRegister)} 
                        style={toggleLinkStyle}
                    >
                        {isRegister ? ' Login di sini' : ' Daftar di sini'}
                    </span>
                </p>
            </div>
        </div>
    );
};

// --- STYLING (Dark Theme UI) ---

const containerStyle = { 
    height: '100vh', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.85)), url('login.png')`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: "'Poppins', sans-serif" 
};

const cardStyle = { 
    backgroundColor: 'rgba(26, 32, 44, 0.9)', // Abu-abu gelap transparan
    padding: '40px', 
    borderRadius: '24px', 
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', 
    width: '90%', 
    maxWidth: '400px', 
    textAlign: 'center',
    backdropFilter: 'blur(10px)', 
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff'
};

const logoWrapper = { marginBottom: '25px' };
const logoStyle = { color: '#e53e3e', letterSpacing: '2px', fontSize: '1.8rem', fontWeight: '900', margin: 0 };
const subtitleStyle = { color: '#a0aec0', fontSize: '11px', marginTop: '5px', letterSpacing: '2px', fontWeight: 'bold' };
const titleStyle = { marginBottom: '25px', fontSize: '16px', fontWeight: '600', color: '#edf2f7', letterSpacing: '0.5px' };

const inputGroup = { marginBottom: '18px', textAlign: 'left' };
const labelStyle = { fontSize: '12px', fontWeight: '500', color: '#cbd5e0', marginBottom: '8px', display: 'block', marginLeft: '2px' };

const inputStyle = { 
    width: '100%', 
    padding: '14px', 
    borderRadius: '12px', 
    border: '1px solid #4a5568', 
    backgroundColor: '#2d3748', 
    boxSizing: 'border-box', 
    fontSize: '14px', 
    color: '#fff',
    outline: 'none',
    transition: '0.3s'
};

const btnSubmit = { 
    width: '100%', 
    padding: '15px', 
    background: '#e53e3e', // Merah Khas Honda
    color: 'white', 
    border: 'none', 
    borderRadius: '12px', 
    cursor: 'pointer', 
    fontWeight: '900', 
    fontSize: '14px', 
    marginTop: '10px', 
    boxShadow: '0 10px 15px -3px rgba(229, 62, 62, 0.4)',
    transition: '0.2s',
    letterSpacing: '1px'
};

const btnDisabled = { ...btnSubmit, opacity: 0.5, cursor: 'not-allowed' };
const footerTextStyle = { marginTop: '25px', fontSize: '13px', color: '#a0aec0' };
const toggleLinkStyle = { color: '#f56565', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px' };

export default Login;