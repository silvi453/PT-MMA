import { useEffect, useState } from "react";
import SectionTitle from "../components/SectionTitle";

const API_URL = "http://192.168.1.17:8000";

function Kontak() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ========================================
  // AMBIL USER YANG SEDANG LOGIN
  // ========================================

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        return;
      }

      const user = JSON.parse(savedUser);

      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    } catch (error) {
      console.error(
        "Gagal membaca data user:",
        error
      );
    }
  }, []);

  // ========================================
  // HANDLE INPUT
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Hilangkan error ketika user mulai mengetik
    if (error) {
      setError("");
    }

    // Hilangkan success ketika user mulai mengetik
    if (success) {
      setSuccess("");
    }
  };

  // ========================================
  // KIRIM PESAN
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ========================================
    // CEK LOGIN TERLEBIH DAHULU
    // ========================================

    const token = localStorage.getItem("token");

    if (!token) {
      setSuccess("");
      setError(
        "Silakan login terlebih dahulu untuk mengirim pesan."
      );
      return;
    }

    // ========================================
    // MULAI PROSES KIRIM
    // ========================================

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(
        `${API_URL}/api/contacts`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      // ========================================
      // CEK RESPONSE
      // ========================================

      if (!response.ok) {
        // Kalau token sudah tidak valid
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          window.dispatchEvent(
            new Event("authChanged")
          );

          throw new Error(
            "Sesi login Anda telah berakhir. Silakan login kembali."
          );
        }

        // Error validasi Laravel
        if (result.errors) {
          const firstError =
            Object.values(result.errors)[0]?.[0];

          throw new Error(
            firstError ||
              "Data yang dikirim tidak valid."
          );
        }

        throw new Error(
          result.message ||
            "Gagal mengirim pesan."
        );
      }

      // ========================================
      // BERHASIL
      // ========================================

      setSuccess(
        "Pesan berhasil dikirim. Terima kasih telah menghubungi kami."
      );

      // Kosongkan hanya nomor telepon dan pesan
      setFormData((prev) => ({
        ...prev,
        phone: "",
        message: "",
      }));

    } catch (error) {
      console.error(
        "Gagal mengirim pesan:",
        error
      );

      setError(
        error.message ||
          "Terjadi kesalahan saat mengirim pesan."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section">

      <div className="container">

        <SectionTitle title="HUBUNGI KAMI" />

        <div className="contact-page">

          {/* INFORMASI KONTAK */}

          <div className="contact-info">

            <h2>
              Kami Siap Membantu
            </h2>

            <p>
              Jangan ragu untuk menghubungi
              kami jika Anda membutuhkan
              informasi produk atau layanan.
            </p>

            <div className="contact-item">

              <strong>📍 Alamat</strong>

              <span>
                Jl. Simpang Danau Limboto Timur 2,
                Blok A5 - 132, Sawojajar,
                Kec. Kedungkandang, Kota Malang,
                Jawa Timur
              </span>

            </div>

            <div className="contact-item">

              <strong>☎ Telepon</strong>

              <span>
                (0341) 727299
              </span>

            </div>

            <div className="contact-item">

              <strong>✉ Email</strong>

              <span>
                adm.mitrameditamaabadi@gmail.com
              </span>

            </div>

          </div>

          {/* FORM */}

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <input
              type="text"
              name="name"
              placeholder="Nama Lengkap"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Nomor Telepon"
              value={formData.phone}
              onChange={handleChange}
            />

            <textarea
              name="message"
              rows="6"
              placeholder="Pesan Anda"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            {/* SUCCESS */}

            {success && (
              <div className="contact-success">
                {success}
              </div>
            )}

            {/* ERROR */}

            {error && (
              <div className="contact-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? "Mengirim..."
                : "Kirim Pesan →"}
            </button>

          </form>

        </div>

      </div>

    </section>
  );
}

export default Kontak;
