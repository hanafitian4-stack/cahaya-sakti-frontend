import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// --- THEME CONSTANTS ---
const theme = {
  glassHeader: "rgba(15, 23, 42, 0.6)",
  outline: "rgba(255, 255, 255, 0.15)",
  primary: "#f97316",
  success: "#22c55e",
  danger: "#ef4444",
  textMain: "#ffffff",
  textSub: "#94a3b8",
};

function PesananMasuk() {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  // ✅ CRA ENV + fallback aman
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || window.location.origin;

  const fetchPesanan = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPesanan(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Fetch pesanan error:", err);

      // kalau token hilang/expired sering 401
      if (err.response?.status === 401) {
        setError("Sesi admin habis / tidak valid. Silakan login ulang sebagai Admin.");
      } else {
        setError("Gagal mengambil data pesanan. Cek koneksi server / konfigurasi API.");
      }
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, token]);

  useEffect(() => {
    fetchPesanan();
  }, [fetchPesanan]);

  const handleUpdateStatus = async (id, statusBaru) => {
    if (!window.confirm(`Konfirmasi ubah status ke ${statusBaru.toUpperCase()}?`)) return;

    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/orders/${id}/status`,
        { status: statusBaru },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Status diperbarui!");
      fetchPesanan();
    } catch (err) {
      console.error("Update status error:", err);
      alert(err.response?.data?.message || "Gagal memperbarui status");
    }
  };

  if (loading)
    return (
      <div style={loadingOverlay}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={spinner}
        />
        <p style={{ marginTop: "20px", color: "#fff" }}>Sinkronisasi Data...</p>
      </div>
    );

  return (
    <div style={pageContainer}>
      <div style={contentWrapper}>
        {/* Header Section dengan Blur */}
        <div style={headerSection}>
          <button onClick={() => window.history.back()} style={btnBack}>
            ←
          </button>
          <div>
            <h2 style={titleText}>Management Pesanan</h2>
            <p style={subtitleText}>Panel Kontrol Admin • Cahaya Sakti Motor</p>
          </div>
          <div style={orderCountBadge}>{pesanan.length} Total</div>
        </div>

        {error && <div style={errorBanner}>{error}</div>}

        {/* Grid List Balon Transparan */}
        <div style={gridContainer}>
          <AnimatePresence>
            {pesanan.length === 0 ? (
              <div style={emptyState}>Belum ada pesanan masuk.</div>
            ) : (
              pesanan.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={orderCard}
                >
                  <div style={cardHeader}>
                    <div style={statusPill(item.status)}>
                      {(item.status || "pending").toUpperCase()}
                    </div>
                    <span style={{ color: theme.textSub, fontSize: "11px", fontWeight: "bold" }}>
                      #INV-{item.id}
                    </span>
                  </div>

                  <div style={cardBody}>
                    <div style={infoBox}>
                      <label style={labelStyle}>PELANGGAN</label>
                      <div style={customerName}>{item.nama_lengkap}</div>
                      <div style={customerContact}>📱 {item.nomor_wa}</div>
                      <div style={customerAddress}>📍 {item.alamat}</div>
                    </div>

                    <div style={unitBox}>
                      <label style={labelStyle}>UNIT MOTOR</label>
                      <div style={motorName}>{item.motor?.nama_model || "N/A"}</div>
                      <div style={colorBadge}>Warna: {item.warna}</div>
                    </div>
                  </div>

                  <div style={cardFooter}>
                    {item.status === "pending" || item.status === "diproses" ? (
                      <div style={actionGroup}>
                        <button onClick={() => handleUpdateStatus(item.id, "diterima")} style={btnApprove}>
                          TERIMA
                        </button>
                        <button onClick={() => handleUpdateStatus(item.id, "ditolak")} style={btnReject}>
                          TOLAK
                        </button>
                      </div>
                    ) : (
                      <div style={statusFinal(item.status)}>
                        {item.status === "diterima" ? "✅ DISETUJUI" : "❌ DITOLAK"}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- STYLES ---
const pageContainer = {
  minHeight: "100vh",
  backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.4)), url('/pesanan.png')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
  padding: "40px 20px",
  fontFamily: "'Inter', sans-serif",
  color: "#fff",
};

const contentWrapper = { maxWidth: "1200px", margin: "0 auto" };

const headerSection = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  marginBottom: "40px",
  padding: "20px",
  backgroundColor: theme.glassHeader,
  backdropFilter: "blur(10px)",
  borderRadius: "15px",
  border: `1px solid ${theme.outline}`,
};

const btnBack = {
  width: "40px",
  height: "40px",
  background: "none",
  border: `1px solid ${theme.outline}`,
  color: "#fff",
  borderRadius: "10px",
  cursor: "pointer",
};

const titleText = { fontSize: "26px", fontWeight: "900", margin: 0 };
const subtitleText = { fontSize: "12px", color: theme.primary, fontWeight: "700", textTransform: "uppercase" };
const orderCountBadge = {
  marginLeft: "auto",
  border: `1px solid ${theme.primary}`,
  color: theme.primary,
  padding: "5px 15px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold",
};

const gridContainer = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" };

const orderCard = {
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  backdropFilter: "blur(8px)",
  borderRadius: "24px",
  padding: "25px",
  border: `1px solid ${theme.outline}`,
  display: "flex",
  flexDirection: "column",
};

const cardHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" };

const statusPill = (status) => ({
  padding: "4px 12px",
  borderRadius: "8px",
  fontSize: "10px",
  fontWeight: "800",
  color: "#fff",
  backgroundColor: status === "pending" ? theme.primary : status === "diterima" ? theme.success : theme.danger,
});

const cardBody = { display: "flex", flexDirection: "column", gap: "20px" };
const infoBox = { borderLeft: `2px solid ${theme.primary}`, paddingLeft: "15px" };
const unitBox = { backgroundColor: "rgba(0, 0, 0, 0.2)", padding: "15px", borderRadius: "15px", border: `1px solid ${theme.outline}` };

const labelStyle = { fontSize: "9px", fontWeight: "800", color: theme.textSub, letterSpacing: "1px", marginBottom: "5px" };
const customerName = { fontSize: "18px", fontWeight: "700" };
const customerContact = { fontSize: "13px", color: theme.textSub };
const customerAddress = { fontSize: "12px", color: theme.textSub, marginTop: "4px" };
const motorName = { fontSize: "16px", fontWeight: "800", color: theme.primary };
const colorBadge = { fontSize: "11px", color: "#fff", marginTop: "3px" };

const cardFooter = { marginTop: "25px", paddingTop: "15px", borderTop: `1px solid ${theme.outline}` };
const actionGroup = { display: "flex", gap: "10px" };

const btnApprove = { flex: 2, padding: "12px", backgroundColor: theme.primary, color: "#fff", border: "none", borderRadius: "10px", fontWeight: "800", cursor: "pointer", fontSize: "11px" };
const btnReject = { flex: 1, padding: "12px", background: "none", color: "#fff", border: `1px solid ${theme.outline}`, borderRadius: "10px", cursor: "pointer", fontSize: "11px" };

const statusFinal = (status) => ({
  textAlign: "center",
  fontSize: "11px",
  fontWeight: "800",
  color: status === "diterima" ? theme.success : theme.danger,
  padding: "10px",
  border: `1px solid ${theme.outline}`,
  borderRadius: "10px",
});

const loadingOverlay = { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a" };
const spinner = { width: "40px", height: "40px", border: `4px solid ${theme.outline}`, borderTopColor: theme.primary, borderRadius: "50%" };
const errorBanner = { backgroundColor: "rgba(239, 68, 68, 0.1)", color: theme.danger, padding: "15px", borderRadius: "12px", marginBottom: "20px", textAlign: "center" };
const emptyState = { gridColumn: "1/-1", textAlign: "center", padding: "100px", color: theme.textSub };

export default PesananMasuk;