import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { motion } from "framer-motion";

const DetailPesananUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const componentRef = useRef(null);

  const [detail, setDetail] = useState(null);
  const token = localStorage.getItem("token");

  // ✅ CRA ENV yang konsisten
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || window.location.origin;

  // Nomor WA admin/dealer
  const adminPhone = "6283175391181"; // ganti sesuai WA dealer

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/pesanan/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        setDetail(response.data);
      } catch (err) {
        console.error("Error fetching detail:", err);

        if (err.response?.status === 401) {
          alert("Sesi kamu habis. Silakan login lagi.");
          navigate("/");
        } else {
          alert("Data tidak ditemukan atau terjadi masalah koneksi.");
        }
      }
    };

    if (id && token) fetchDetail();
  }, [id, token, API_BASE_URL, navigate]);

  // Cetak PDF
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Invoice_CSM_${id}`,
  });

  // Bayar via WA
  const handleBayarWA = () => {
    if (!detail) return;

    const message =
      `Halo Admin Cahaya Sakti Motor,\n\nSaya ingin konfirmasi pembayaran untuk:\n` +
      `*ID Transaksi:* #CSM-${detail.id}\n` +
      `*Unit:* ${detail.motor?.nama_model}\n` +
      `*Warna:* ${detail.warna}\n` +
      `*Total Harga:* Rp ${Number(detail.motor?.harga).toLocaleString("id-ID")}\n\n` +
      `Mohon instruksi selanjutnya untuk proses pengiriman/pengambilan unit. Terima kasih.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${adminPhone}?text=${encodedMessage}`, "_blank");
  };

  if (!detail)
    return (
      <p style={{ textAlign: "center", marginTop: "100px", color: "white" }}>
        Memuat rincian...
      </p>
    );

  return (
    <div style={pageWrapper}>
      <div style={container}>
        {/* Header Tombol Akses Cepat */}
        <div style={actionButtons}>
          <button onClick={() => navigate(-1)} style={btnSecondary}>
            ← Kembali
          </button>
          <button onClick={handlePrint} style={btnPrimary}>
            🖨️ Simpan PDF / Cetak
          </button>
        </div>

        {/* Area Invoice yang akan di-print */}
        <div ref={componentRef} style={invoicePaper}>
          <div style={header}>
            <h1 style={{ color: "#e74c3c", margin: 0, fontWeight: "900" }}>
              CAHAYA SAKTI MOTOR
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                letterSpacing: "2px",
              }}
            >
              DEALER RESMI SEPEDA MOTOR HONDA
            </p>
            <p
              style={{
                margin: "5px 0 0 0",
                fontSize: "10px",
                color: "#7f8c8d",
              }}
            >
              Jl. Raya Utama Boyolali, Jawa Tengah
            </p>
          </div>

          <div style={divider}></div>

          <h3
            style={{
              textAlign: "center",
              marginBottom: "30px",
              color: "#2c3e50",
            }}
          >
            BUKTI PEMESANAN UNIT
          </h3>

          <div style={infoGrid}>
            <div>
              <p style={label}>ID TRANSAKSI</p>
              <p style={val}>#CSM-{detail.id}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={label}>TANGGAL PESAN</p>
              <p style={val}>
                {detail.created_at
                  ? new Date(detail.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "-"}
              </p>
            </div>
          </div>

          <div style={section}>
            <h4 style={sectionTitle}>RINCIAN PEMESAN</h4>
            <p style={val}>
              {detail.nama_lengkap ? detail.nama_lengkap.toUpperCase() : "-"}
            </p>
            <p style={subVal}>WhatsApp: {detail.nomor_wa || "-"}</p>
            <p style={subVal}>Alamat: {detail.alamat || "-"}</p>
          </div>

          <div style={section}>
            <h4 style={sectionTitle}>RINCIAN UNIT</h4>
            <div style={motorBox}>
              <h3 style={{ margin: "0 0 5px 0", color: "#e74c3c" }}>
                {detail.motor?.nama_model || "Unit tidak ditemukan"}
              </h3>
              <p style={{ margin: 0, fontSize: "14px" }}>
                Warna Pilihan: <strong>{detail.warna || "-"}</strong>
              </p>

              <p style={{ margin: "10px 0 0 0", fontSize: "14px" }}>
                Status Pesanan:
                <span
                  style={{
                    marginLeft: "10px",
                    color:
                      detail.status === "lunas" ? "#27ae60" : "#e67e22",
                    fontWeight: "bold",
                  }}
                >
                  {(detail.status || "PROSES").toUpperCase()}
                </span>
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: "30px",
              textAlign: "right",
              borderTop: "2px solid #eee",
              paddingTop: "20px",
            }}
          >
            <p style={{ margin: 0, color: "#7f8c8d" }}>Total Pembayaran:</p>
            <h2 style={{ margin: 0, color: "#2c3e50" }}>
              Rp {Number(detail.motor?.harga || 0).toLocaleString("id-ID")}
            </h2>
          </div>

          <div style={footer}>
            <p style={{ fontSize: "11px", color: "#7f8c8d" }}>
              *Harap simpan invoice ini sebagai bukti pemesanan yang sah.
            </p>
            <p style={{ fontSize: "11px", color: "#7f8c8d" }}>
              Dicetak otomatis oleh Sistem CSM pada:{" "}
              {new Date().toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Tombol Bayar di Luar Invoice */}
        {detail.status !== "lunas" && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ marginTop: "30px", textAlign: "center" }}
          >
            <p style={{ color: "white", marginBottom: "15px", fontSize: "14px" }}>
              Sudah melakukan transfer? Klik tombol di bawah:
            </p>
            <button onClick={handleBayarWA} style={btnWhatsapp}>
              <span style={{ fontSize: "20px" }}>📱</span> Konfirmasi Pembayaran via WhatsApp
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// --- STYLES ---
const pageWrapper = {
  minHeight: "100vh",
  backgroundColor: "#1a202c",
  padding: "50px 20px",
};
const container = { maxWidth: "800px", margin: "0 auto" };
const actionButtons = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "20px",
};
const btnPrimary = {
  padding: "12px 25px",
  backgroundColor: "#27ae60",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};
const btnSecondary = {
  padding: "12px 25px",
  backgroundColor: "#4a5568",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
};
const btnWhatsapp = {
  width: "100%",
  padding: "18px",
  backgroundColor: "#25D366",
  color: "white",
  border: "none",
  borderRadius: "15px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  boxShadow: "0 4px 15px rgba(37, 211, 102, 0.3)",
};
const invoicePaper = {
  backgroundColor: "white",
  padding: "50px",
  borderRadius: "8px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
  color: "#333",
};
const header = { textAlign: "center", marginBottom: "20px" };
const divider = { height: "4px", backgroundColor: "#e74c3c", marginBottom: "20px" };
const infoGrid = { display: "flex", justifyContent: "space-between", marginBottom: "40px" };
const section = { marginBottom: "30px" };
const sectionTitle = {
  fontSize: "12px",
  color: "#95a5a6",
  borderBottom: "1px solid #eee",
  paddingBottom: "5px",
  marginBottom: "10px",
  fontWeight: "bold",
};
const label = { fontSize: "11px", color: "#95a5a6", margin: 0 };
const val = { fontSize: "16px", fontWeight: "bold", margin: "5px 0" };
const subVal = { fontSize: "14px", color: "#555", margin: "2px 0" };
const motorBox = { padding: "20px", backgroundColor: "#fdf2f2", borderRadius: "10px", border: "1px solid #fee2e2" };
const footer = { marginTop: "50px", borderTop: "1px solid #eee", paddingTop: "20px", textAlign: "center" };

export default DetailPesananUser;