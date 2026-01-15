import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const StokBarang = () => {
  const [motors, setMotors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ CRA ENV + fallback aman
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || window.location.origin;

  // Mengambil data stok dari API Admin
  const fetchStok = useCallback(async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.get(
        `${API_BASE_URL}/api/admin/stok-penjualan`,
        config
      );

      setMotors(res.data || []);
    } catch (error) {
      console.error("Gagal mengambil data stok:", error);

      if (error.response?.status === 401) {
        alert("Sesi habis, silakan login kembali.");
        navigate("/login");
      } else {
        alert("Gagal mengambil data stok. Cek koneksi server / konfigurasi API.");
      }
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, token, navigate]);

  useEffect(() => {
    fetchStok();
  }, [fetchStok]);

  // Fungsi Tambah Stok dengan Validasi URL Admin
  const handleTambahStok = async (id, namaModel) => {
    const jumlah = prompt(
      `Masukkan jumlah stok tambahan untuk ${namaModel}:`,
      "1"
    );

    if (jumlah === null) return;

    const parsedJumlah = parseInt(jumlah, 10);

    if (Number.isNaN(parsedJumlah) || parsedJumlah <= 0) {
      alert("Harap masukkan angka yang valid (minimal 1).");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await axios.put(
        `${API_BASE_URL}/api/admin/motors/${id}/tambah-stok`,
        { tambah_stok: parsedJumlah },
        config
      );

      alert(res.data?.message || "Stok berhasil diperbarui!");
      fetchStok();
    } catch (error) {
      console.error("Error update stok:", error);
      alert(error.response?.data?.message || "Gagal memperbarui stok. Cek koneksi backend.");
    }
  };

  return (
    <div style={pageContainer}>
      <div style={contentWrapper}>
        {/* Header Section Glass */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={headerSection}>
          <button onClick={() => navigate("/beranda")} style={btnBack}>
            ← Back
          </button>
          <div>
            <h2 style={titleText}>Manajemen Stok</h2>
            <p style={subtitleText}>Cahaya Sakti Motor • Admin Panel</p>
          </div>
          <button onClick={fetchStok} style={btnRefresh} disabled={loading}>
            {loading ? "SINKRONISASI..." : "🔄 REFRESH DATA"}
          </button>
        </motion.div>

        {/* Table Glass Container */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={tableContainer}>
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr style={headerRowStyle}>
                  <th style={thStyle}>UNIT MODEL</th>
                  <th style={thStyle}>STATUS INVENTARIS</th>
                  <th style={thStyle}>UNIT TERJUAL</th>
                  <th style={thStyle}>KONTROL STOK</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {motors.length > 0 ? (
                    motors.map((motor, index) => (
                      <motion.tr
                        key={motor.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        style={rowStyle}
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                      >
                        <td style={tdStyle}>
                          <div style={motorName}>{motor.nama_model}</div>
                          <div style={motorType}>{motor.tipe}</div>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <span style={stokBadge(motor.stok)}>{motor.stok} UNIT</span>
                            {motor.stok === 0 && <span style={badgeHabis}>KOSONG</span>}
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <span style={terjualText}>{motor.total_terjual || 0} Terjual</span>
                        </td>
                        <td style={tdStyle}>
                          <button onClick={() => handleTambahStok(motor.id, motor.nama_model)} style={btnTambah}>
                            + ISI STOK
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={emptyText}>
                        {loading ? "Menghubungkan ke server..." : "Belum ada data unit motor."}
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// --- STYLING ---
const pageContainer = {
  minHeight: "100vh",
  backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.7)), url('/pesanan.png')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
  padding: "40px 5%",
  fontFamily: "'Inter', sans-serif",
  color: "#fff",
};

const contentWrapper = { maxWidth: "1100px", margin: "0 auto" };

const headerSection = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  marginBottom: "30px",
  padding: "25px",
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  backdropFilter: "blur(15px)",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

const btnBack = {
  background: "none",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  color: "#fff",
  padding: "10px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "600",
};

const titleText = { fontSize: "26px", fontWeight: "800", margin: 0, letterSpacing: "-0.5px" };
const subtitleText = { fontSize: "11px", color: "#f97316", fontWeight: "700", textTransform: "uppercase", marginTop: "4px" };
const btnRefresh = { marginLeft: "auto", background: "#f97316", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: "800", cursor: "pointer", fontSize: "11px", transition: "0.2s" };

const tableContainer = {
  backgroundColor: "rgba(255, 255, 255, 0.02)",
  backdropFilter: "blur(20px)",
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
  overflow: "hidden",
};

const tableStyle = { width: "100%", borderCollapse: "collapse", color: "#fff" };
const thStyle = { padding: "25px 20px", textAlign: "left", fontSize: "10px", fontWeight: "900", color: "#94a3b8", letterSpacing: "1.5px", textTransform: "uppercase" };
const tdStyle = { padding: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.03)" };

const motorName = { fontSize: "17px", fontWeight: "700", color: "#fff" };
const motorType = { fontSize: "12px", color: "#64748b", marginTop: "2px" };
const terjualText = { fontWeight: "800", color: "#10b981", fontSize: "15px" };

const stokBadge = (stok) => ({
  padding: "6px 14px",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: "900",
  backgroundColor: stok === 0 ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 255, 255, 0.05)",
  color: stok === 0 ? "#ef4444" : "#fff",
  border: `1px solid ${stok === 0 ? "#ef4444" : "rgba(255, 255, 255, 0.15)"}`,
  display: "inline-block",
});

const badgeHabis = { marginLeft: "12px", fontSize: "10px", color: "#ef4444", fontWeight: "900", letterSpacing: "1px" };

const btnTambah = {
  padding: "10px 20px",
  backgroundColor: "transparent",
  color: "#f97316",
  border: "1px solid #f97316",
  borderRadius: "10px",
  fontWeight: "800",
  cursor: "pointer",
  fontSize: "11px",
  transition: "0.3s",
  textTransform: "uppercase",
};

const emptyText = { padding: "60px", textAlign: "center", color: "#64748b", fontSize: "14px", fontWeight: "500" };
const rowStyle = { transition: "background-color 0.2s ease" };
const headerRowStyle = { borderBottom: "1px solid rgba(255, 255, 255, 0.1)", backgroundColor: "rgba(255,255,255,0.01)" };

export default StokBarang;