import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

// IP laptop yang terhubung ke Wi-Fi
const API_URL = "http://192.168.1.17:8000/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
    setError("");

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          const firstError = Object.values(result.errors)[0]?.[0];

          throw new Error(
            firstError || "Email atau password tidak valid."
          );
        }

        throw new Error(
          result.message || "Email atau password salah."
        );
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      // Memberitahu Navbar bahwa status login berubah
      window.dispatchEvent(new Event("authChanged"));

      navigate("/");
    } catch (error) {
      console.error("Login gagal:", error);

      setError(
        error.message || "Terjadi kesalahan saat login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">

        {/* =========================
            LOGO
        ========================== */}
        <div className="login-brand">
          <div className="login-logo">
            <img
              src="/images/logo.png"
              alt="Logo PT Mitra Meditama Abadi"
            />
          </div>

          <strong>PT MITRA MEDITAMA ABADI</strong>

          <span>
            Solusi Kesehatan, Hidup Lebih Sehat
          </span>
        </div>

        {/* =========================
            HEADING
        ========================== */}
        <div className="login-heading">
          <h2>Login</h2>

          <p>
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>

        {/* =========================
            ERROR
        ========================== */}
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {/* =========================
            FORM
        ========================== */}
        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div className="login-group">
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
          <div className="login-group">
            <label htmlFor="password">
              Password
            </label>

            <div className="login-password-wrapper">
              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Masukkan password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword
                  ? "SEMBUNYIKAN"
                  : "LIHAT"}
              </button>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? "Memproses..."
              : "Login →"}
          </button>

        </form>

        {/* =========================
            REGISTER
        ========================== */}
        <div className="login-register">
          <span>
            Belum punya akun?
          </span>

          <Link
            to="/register"
            className="login-register-button"
          >
            Daftar Akun →
          </Link>
        </div>

        {/* =========================
            BACK
        ========================== */}
        <div className="login-back">
          <Link to="/">
            ← Kembali ke Beranda
          </Link>
        </div>

      </div>
    </main>
  );
}

export default Login;

