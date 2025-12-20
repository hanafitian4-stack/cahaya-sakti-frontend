import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault(); 
        
        try {
            // Pastikan URL mengarah ke IP 127.0.0.1 port 8000
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                email: email,
                password: password
            });

            // Simpan token yang dikirim Laravel ke memori browser
            localStorage.setItem('token', response.data.access_token);
            
            alert("Selamat! Login Berhasil.");
            
            // Pindah ke halaman beranda
            window.location.href = '/beranda';

        } catch (error) {
            console.error("Detail Error:", error.response);
            
            // Menampilkan pesan error spesifik dari Laravel jika ada
            const pesanError = error.response?.data?.message || "Koneksi ke server gagal!";
            alert("Login Gagal: " + pesanError);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial' }}>
            <h1 style={{ color: 'red', letterSpacing: '2px' }}>CAHAYA SAKTI MOTOR</h1>
            <div style={{ display: 'inline-block', border: '1px solid #ddd', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginBottom: '20px' }}>Silahkan Login</h3>
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                        <label>Email:</label><br/>
                        <input 
                            type="email" 
                            required 
                            placeholder="contoh@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '280px', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div style={{ marginBottom: '25px', textAlign: 'left' }}>
                        <label>Password:</label><br/>
                        <input 
                            type="password" 
                            required 
                            placeholder="Masukkan password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '280px', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '12px', background: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        MASUK KE SISTEM
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;