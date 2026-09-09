import { useState } from "react";
import SectionTitle from "../components/SectionTitle";

const API_URL = "http://127.0.0.1:8000";

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/contacts`,
        {
          method: "POST",

          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
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

      setSuccess(
        "Pesan berhasil dikirim. Terima kasih telah menghubungi kami."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

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


            {success && (
              <div className="contact-success">
                {success}
              </div>
            )}


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