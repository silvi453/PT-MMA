import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login admin gagal");
      }

      // Simpan token admin
      localStorage.setItem("token", data.token);

      // Simpan data admin
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login admin berhasil!");

      // Masuk dashboard admin
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Admin login error:", error);

      alert(error.message || "Terjadi kesalahan saat login admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">

        <img src="/images/logo.png" alt="PT Mitra Meditama Abadi" className="auth-logo" />
        
        <h1>Admin Login</h1>

        <p>PT MITRA MEDITAMA ABADI</p>

        <form onSubmit={handleLogin}>

          <div className="admin-form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Masukkan email admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Masukkan password admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default AdminLogin;
