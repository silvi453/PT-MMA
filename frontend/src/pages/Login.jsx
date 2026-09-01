import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = "http://127.0.0.1:8000/api";

function Login() {
const navigate = useNavigate();

const [form, setForm] = useState({
email: "",
password: "",
});

const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);

// ========================================
// HANDLE INPUT
// ========================================

const handleChange = (e) => {
const { name, value } = e.target;

setForm((prev) => ({
  ...prev,
  [name]: value,
}));

};

// ========================================
// LOGIN
// ========================================

const handleSubmit = async (e) => {
e.preventDefault();

if (!form.email.trim()) {
  alert("Email wajib diisi.");
  return;
}

if (!form.password) {
  alert("Password wajib diisi.");
  return;
}

setLoading(true);

try {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },

    body: JSON.stringify({
      email: form.email,
      password: form.password,
    }),
  });

  const result = await response.json();

  console.log("Login response:", result);


  // ========================================
  // LOGIN GAGAL
  // ========================================

  if (!response.ok) {
    if (result.errors) {
      const messages = Object.values(result.errors)
        .flat()
        .join("\n");

      alert(messages);
    } else {
      alert(
        result.message ||
          "Email atau password salah."
      );
    }

    return;
  }


  // ========================================
  // CEK DATA USER
  // ========================================

  if (!result.token || !result.user) {
    console.error(
      "Response login tidak lengkap:",
      result
    );

    alert(
      "Login gagal. Data dari server tidak lengkap."
    );

    return;
  }


  // ========================================
  // SIMPAN TOKEN
  // ========================================

  localStorage.setItem(
    "token",
    result.token
  );

  localStorage.setItem(
    "user",
    JSON.stringify(result.user)
  );


  // ========================================
  // CEK ROLE
  // ========================================

  const userRole = result.user.role;


  // ========================================
  // ADMIN
  // ========================================

  if (userRole === "admin") {
    alert(
      `Selamat datang, ${result.user.name}!`
    );

    navigate("/admin/dashboard");
    return;
  }


  // ========================================
  // USER BIASA
  // ========================================

  alert(
    `Selamat datang, ${result.user.name}!`
  );

  navigate("/");

} catch (error) {
  console.error(
    "Login error:",
    error
  );

  alert(
    "Tidak dapat terhubung ke server Laravel.\n\nPastikan php artisan serve sedang berjalan."
  );

} finally {
  setLoading(false);
}

};

return ( <div className="login-page">

  {/* =====================================
      LEFT SIDE
  ===================================== */}

  <div className="login-left">

    <div className="login-brand">

      <div className="login-logo">
        PT
      </div>

      <div>
        <strong>
          PT-MMA
        </strong>

        <span>
          Mitra Meditama Abadi
        </span>
      </div>

    </div>


    <div className="login-welcome">

      <span>
        SELAMAT DATANG KEMBALI
      </span>

      <h1>
        Masuk ke
        <br />
        PT-MMA
      </h1>

      <p>
        Login untuk mengakses
        informasi dan layanan
        PT-MMA dengan lebih mudah.
      </p>

    </div>

  </div>


  {/* =====================================
      RIGHT SIDE
  ===================================== */}

  <div className="login-right">

    <div className="login-card">

      <div className="login-heading">

        <h2>
          Login
        </h2>

        <p>
          Masukkan email dan password
          untuk melanjutkan.
        </p>

      </div>


      <form onSubmit={handleSubmit}>

        {/* EMAIL */}

        <div className="login-group">

          <label htmlFor="login-email">
            Email
          </label>

          <input
            id="login-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Masukkan email"
            autoComplete="email"
            required
          />

        </div>


        {/* PASSWORD */}

        <div className="login-group">

          <label htmlFor="login-password">
            Password
          </label>

          <div className="login-password-wrapper">

            <input
              id="login-password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword
                ? "Sembunyikan"
                : "Lihat"}
            </button>

          </div>

        </div>


        {/* SUBMIT */}

        <button
          type="submit"
          className="login-submit"
          disabled={loading}
        >
          {loading
            ? "Memproses..."
            : "Login"}
        </button>

      </form>


      {/* REGISTER */}

      <div className="login-register">

        <span>
          Belum memiliki akun?
        </span>

        <Link to="/register">
          Daftar sekarang
        </Link>

      </div>


      {/* BACK */}

      <div className="login-back">

        <Link to="/">
          ← Kembali ke website
        </Link>

      </div>

    </div>

  </div>

</div>

);
}

export default Login;
