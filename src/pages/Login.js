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
        
        // Membersihkan sisa login lama
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
                    <p style={subtitleStyle}>Dealer Resmi Motor Honda</p>
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

// --- STYLING (Modern UI) ---

const containerStyle = { 
    height: '100vh', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    // Ganti URL ini dengan foto dealer atau motor Honda pilihan Anda
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('login.png')`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: "'Poppins', sans-serif" 
};

const cardStyle = { 
    backgroundColor: 'rgba(173, 172, 172, 0.95)', 
    padding: '40px', 
    borderRadius: '30px', 
    boxShadow: '0 25px 50px rgba(129, 127, 127, 0.5)', 
    width: '90%', 
    maxWidth: '420px', 
    textAlign: 'center',
    backdropFilter: 'blur(15px)', // Efek kaca
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#fff'
};

const logoWrapper = { marginBottom: '30px' };
const logoStyle = { color: '#ff4d4d', letterSpacing: '3px', fontSize: '2rem', fontWeight: '900', margin: 0, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' };
const subtitleStyle = { color: '#eee', fontSize: '13px', marginTop: '5px', letterSpacing: '1px' };
const titleStyle = { marginBottom: '25px', fontSize: '18px', fontWeight: '600', letterSpacing: '1px' };

const inputGroup = { marginBottom: '20px', textAlign: 'left' };
const labelStyle = { fontSize: '12px', fontWeight: '500', color: '#ddd', marginBottom: '8px', display: 'block', marginLeft: '5px' };

const inputStyle = { 
    width: '100%', 
    padding: '14px', 
    borderRadius: '12px', 
    border: 'none', 
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    boxSizing: 'border-box', 
    fontSize: '14px', 
    color: '#333',
    outline: 'none',
    transition: '0.3s'
};

const btnSubmit = { 
    width: '100%', 
    padding: '14px', 
    background: 'linear-gradient(45deg, #e74c3c, #c0392b)', 
    color: 'white', 
    border: 'none', 
    borderRadius: '12px', 
    cursor: 'pointer', 
    fontWeight: 'bold', 
    fontSize: '15px', 
    marginTop: '10px', 
    boxShadow: '0 10px 20px rgba(231, 76, 60, 0.3)',
    transition: '0.3s transform'
};

const btnDisabled = { ...btnSubmit, opacity: 0.7, cursor: 'not-allowed' };
const footerTextStyle = { marginTop: '25px', fontSize: '14px', color: '#eee' };
const toggleLinkStyle = { color: '#ff4d4d', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px' };

export default Login;