import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const API_URL = "http://192.168.1.17:8000/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    // Cek password
    if (
      formData.password !==
      formData.password_confirmation
    ) {
      setError(
        "Password dan konfirmasi password tidak sama."
      );

      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/register`,
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
              "Data pendaftaran tidak valid."
          );
        }

        throw new Error(
          result.message ||
            "Pendaftaran gagal."
        );
      }

      // Simpan data user
      localStorage.setItem(
        "token",
        result.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(result.user)
      );

      // Beritahu Navbar bahwa user sudah login
      window.dispatchEvent(
        new Event("authChanged")
      );

      setSuccess(
        "Pendaftaran berhasil! Mengalihkan..."
      );

      // Tunggu sebentar supaya pesan terlihat
      setTimeout(() => {
        navigate("/");
      }, 500);

    } catch (error) {
      console.error(
        "Register error:",
        error
      );

      setError(
        error.message ||
          "Terjadi kesalahan saat mendaftar."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">

      <div className="register-card">

        {/* =========================
            LOGO PERUSAHAAN
        ========================== */}

        <div className="register-brand">

          <div className="register-logo">
            <img
              src="/images/logo.png"
              alt="Logo PT Mitra Meditama Abadi"
            />
          </div>

          <strong>
            PT MITRA MEDITAMA ABADI
          </strong>

          <span>
            Solusi Kesehatan, Hidup Lebih Sehat
          </span>

        </div>

        {/* =========================
            HEADING
        ========================== */}

        <div className="register-heading">

          <h2>Daftar Akun</h2>

          <p>
            Buat akun untuk dapat menghubungi
            PT Mitra Meditama Abadi
          </p>

        </div>

        {/* =========================
            ERROR
        ========================== */}

        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        {/* =========================
            SUCCESS
        ========================== */}

        {success && (
          <div className="register-success">
            {success}
          </div>
        )}

        {/* =========================
            FORM
        ========================== */}

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >

          {/* NAMA */}

          <div className="register-group">

            <label htmlFor="name">
              Nama Lengkap
            </label>

            <input
              id="name"
              type="text"
              name="name"
              placeholder="Masukkan nama lengkap"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />

          </div>

          {/* EMAIL */}

          <div className="register-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Masukkan email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="register-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Minimal 8 karakter"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />

          </div>

          {/* KONFIRMASI PASSWORD */}

          <div className="register-group">

            <label htmlFor="password_confirmation">
              Konfirmasi Password
            </label>

            <input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              placeholder="Masukkan ulang password"
              value={
                formData.password_confirmation
              }
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />

          </div>

          {/* REGISTER BUTTON */}

          <button
            type="submit"
            className="register-submit"
            disabled={loading}
          >
            {loading
              ? "Mendaftarkan..."
              : "Daftar →"}
          </button>

        </form>

        {/* =========================
            LOGIN
        ========================== */}

        <div className="register-login">

          <span>
            Sudah punya akun?
          </span>

          <Link
            to="/login"
            className="register-login-button"
          >
            Login sekarang →
          </Link>

        </div>

        {/* =========================
            BACK
        ========================== */}

        <div className="register-back">

          <Link to="/">
            ← Kembali ke Beranda
          </Link>

        </div>

      </div>

    </main>
  );
}

export default Register;

