import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        
        // --- PERBAIKAN 1: Bersihkan sisa login lama ---
        localStorage.clear();

        const url = isRegister 
            ? 'http://127.0.0.1:8000/api/register' 
            : 'http://127.0.0.1:8000/api/login';

        const payload = isRegister 
            ? { name, email, password, role: 'user' } // Default role saat daftar
            : { email, password };

        try {
            const response = await axios.post(url, payload);

            if (isRegister) {
                alert("Akun berhasil dibuat! Silakan login.");
                setIsRegister(false);
                setName('');
            } else {
                // --- PERBAIKAN 2: Pastikan struktur data sesuai response Laravel ---
                // Simpan token (Cek apakah backend mengirim 'token' atau 'access_token')
                const token = response.data.token || response.data.access_token;
                localStorage.setItem('token', token);
                
                // Simpan data user
                if (response.data.user) {
                    localStorage.setItem('role', response.data.user.role);
                    localStorage.setItem('userName', response.data.user.name);
                    alert(`Selamat Datang, ${response.data.user.name}!`);
                    window.location.href = '/beranda';
                }
            }

        } catch (error) {
            console.error("Detail Error:", error.response);
            // --- PERBAIKAN 3: Pesan error lebih spesifik agar tidak menebak-nebak ---
            const pesanError = error.response?.data?.message || "Koneksi ke server gagal (Cek CORS)!";
            alert("Gagal: " + pesanError);
        }
    };

    // ... (Styling tetap sama seperti kode Anda) ...
    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h1 style={logoStyle}>CAHAYA SAKTI MOTOR</h1>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                    Dealer Resmi Motor Honda Terpercaya
                </p>
                
                <h3 style={{ marginBottom: '20px', color: '#333', fontWeight: 'bold' }}>
                    {isRegister ? 'BUAT AKUN BARU' : 'SILAHKAN LOGIN'}
                </h3>

                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <div style={inputGroup}>
                            <label style={labelStyle}>Nama Lengkap:</label>
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
                        <label style={labelStyle}>Email:</label>
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
                        <label style={labelStyle}>Password:</label>
                        <input 
                            type="password" 
                            required 
                            placeholder="Masukkan password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <button type="submit" style={btnSubmit}>
                        {isRegister ? 'DAFTAR SEKARANG' : 'MASUK KE SISTEM'}
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

// ... (Gunakan styling yang sudah Anda buat tadi) ...
const containerStyle = { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" };
const cardStyle = { backgroundColor: 'white', padding: '40px', borderRadius: '25px', boxShadow: '0 15px 35px rgba(0,0,0,0.3)', width: '100%', maxWidth: '400px', textAlign: 'center' };
const logoStyle = { color: '#e74c3c', letterSpacing: '2px', fontSize: '1.8rem', fontWeight: 'bold', margin: 0 };
const inputGroup = { marginBottom: '15px', textAlign: 'left' };
const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#555', marginLeft: '5px' };
const inputStyle = { width: '100%', padding: '12px', marginTop: '5px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '14px', outline: 'none' };
const btnSubmit = { width: '100%', padding: '12px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '15px', boxShadow: '0 4px 15px rgba(231, 76, 60, 0.4)' };
const footerTextStyle = { marginTop: '25px', fontSize: '14px', color: '#666' };
const toggleLinkStyle = { color: '#e74c3c', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px', textDecoration: 'none' };

export default Login;