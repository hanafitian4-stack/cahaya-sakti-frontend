import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const PesananSaya = () => {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ Domain saja (tanpa /api) + fallback aman
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || window.location.origin;

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchPesanan = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        };

        // ✅ benar: /api/pesanan hanya sekali
        const response = await axios.get(`${API_BASE_URL}/api/pesanan`, config);

        // normalize data
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];

        setPesanan(data);
      } catch (error) {
        console.error("Gagal mengambil data pesanan:", error);

        // 401 = token invalid
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPesanan();
  }, [token, navigate, API_BASE_URL]);

  const getStatusStyle = (status) => {
    const base = {
      padding: "6px 12px",
      borderRadius: "8px",
      fontSize: "11px",
      fontWeight: "bold",
      textTransform: "uppercase",
    };

    switch ((status || "").toLowerCase()) {
      case "pending":
        return { ...base, backgroundColor: "#f6ad55", color: "#fff" };
      case "diterima":
        return { ...base, backgroundColor: "#48bb78", color: "#fff" };
      case "lunas":
        return { ...base, backgroundColor: "#38b2ac", color: "#fff" };
      case "ditolak":
        return { ...base, backgroundColor: "#f56565", color: "#fff" };
      default:
        return { ...base, backgroundColor: "#4a5568", color: "#fff" };
    }
  };

  return (
    <div style={pageWrapper}>
      <div style={contentContainer}>
        <div style={headerSection}>
          <h2 style={titleStyle}>Pesanan Saya</h2>
          <p style={subtitleStyle}>
            Pantau status unit motor dan akses bukti transaksi Anda.
          </p>
        </div>

        <div style={tableCard}>
          {loading ? (
            <p style={{ textAlign: "center", color: "#a0aec0", padding: "20px" }}>
              Memuat data transaksi...
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={headerRow}>
                    <th style={thStyle}>UNIT MOTOR</th>
                    <th style={thStyle}>PEMESAN</th>
                    <th style={thStyle}>STATUS</th>
                    <th style={thStyle}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {pesanan.length > 0 ? (
                    pesanan.map((item) => (
                      <tr key={item.id} style={rowStyle}>
                        <td style={tdStyle}>
                          <div style={{ fontWeight: "bold", color: "#fff" }}>
                            {item.motor?.nama_model || "Unit Tidak Diketahui"}
                          </div>
                          <div style={{ fontSize: "11px", color: "#f6ad55" }}>
                            {item.warna || "-"}
                          </div>
                        </td>
                        <td style={tdStyle}>{item.nama_lengkap || "-"}</td>
                        <td style={tdStyle}>
                          <span style={getStatusStyle(item.status)}>
                            {item.status || "PROSES"}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <Link to={`/detail-pesanan/${item.id}`} style={btnDetail}>
                            Lihat Detail 📄
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        style={{
                          padding: "60px",
                          textAlign: "center",
                          color: "#718096",
                        }}
                      >
                        Belum ada riwayat transaksi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: "40px", textAlign: "center" }}>
            <button onClick={() => navigate("/beranda")} style={btnBack}>
              KEMBALI KE BERANDA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const pageWrapper = {
  minHeight: "100vh",
  backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('/beranda1.png')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
  paddingTop: "80px",
  paddingBottom: "40px",
};

const contentContainer = { maxWidth: "1000px", margin: "0 auto", padding: "0 20px" };
const headerSection = { marginBottom: "40px", textAlign: "left" };
const titleStyle = { fontSize: "36px", color: "#ffffff", fontWeight: "900", marginBottom: "10px", letterSpacing: "-1px" };
const subtitleStyle = { fontSize: "16px", color: "#a0aec0", fontWeight: "400" };
const tableCard = { backgroundColor: "#2d3748", padding: "30px", borderRadius: "20px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)", border: "1px solid #4a5568" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const headerRow = { borderBottom: "2px solid #4a5568" };
const thStyle = { padding: "15px", textAlign: "left", color: "#cbd5e0", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" };
const rowStyle = { borderBottom: "1px solid #4a5568" };
const tdStyle = { padding: "20px 15px", color: "#e2e8f0", fontSize: "14px", verticalAlign: "middle" };
const btnDetail = { padding: "8px 16px", backgroundColor: "#3182ce", color: "white", textDecoration: "none", borderRadius: "10px", fontSize: "12px", fontWeight: "bold", display: "inline-block" };
const btnBack = { padding: "14px 35px", backgroundColor: "transparent", color: "white", border: "2px solid #4a5568", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" };

export default PesananSaya;