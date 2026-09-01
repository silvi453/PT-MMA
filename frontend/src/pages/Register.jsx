import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const API_URL =
"http://127.0.0.1:8000/api";

function Register() {
const navigate = useNavigate();

const [form, setForm] = useState({
name: "",
email: "",
password: "",
password_confirmation: "",
});

const [loading, setLoading] =
useState(false);

const [showPassword, setShowPassword] =
useState(false);

const [showConfirmPassword, setShowConfirmPassword] =
useState(false);

// ========================================
// HANDLE INPUT
// ========================================

const handleChange = (e) => {
const {
name,
value,
} = e.target;

setForm((prev) => ({
  ...prev,
  [name]: value,
}));

};

// ========================================
// REGISTER
// ========================================

const handleSubmit = async (e) => {
e.preventDefault();

if (!form.name.trim()) {
  alert("Nama wajib diisi.");
  return;
}

if (!form.email.trim()) {
  alert("Email wajib diisi.");
  return;
}

if (form.password.length < 6) {
  alert(
    "Password minimal 6 karakter."
  );
  return;
}

if (
  form.password !==
  form.password_confirmation
) {
  alert(
    "Konfirmasi password tidak cocok."
  );
  return;
}

setLoading(true);

try {
  const response =
    await fetch(
      `${API_URL}/register`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Accept:
            "application/json",
        },

        body: JSON.stringify(form),
      }
    );

  const result =
    await response.json();

  if (!response.ok) {
    console.error(
      "Register response:",
      result
    );

    if (result.errors) {
      const messages =
        Object.values(
          result.errors
        )
          .flat()
          .join("\n");

      alert(messages);
    } else {
      alert(
        result.message ||
          "Registrasi gagal."
      );
    }

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
    JSON.stringify(
      result.user
    )
  );


  alert(
    "Registrasi berhasil! Selamat datang 👋"
  );

  // Ke halaman utama
  navigate("/");

} catch (error) {
  console.error(
    "Register error:",
    error
  );

  alert(
    "Tidak dapat terhubung ke server Laravel."
  );

} finally {
  setLoading(false);
}

};

return ( <div className="register-page">

  {/* ==================================
      LEFT
  ================================== */}

  <div className="register-left">

    <div className="register-brand">

      <div className="register-logo">
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


    <div className="register-welcome">

      <span>
        SELAMAT DATANG
      </span>

      <h1>
        Bergabung dengan
        <br />
        PT-MMA
      </h1>

      <p>
        Buat akun untuk mendapatkan
        pengalaman terbaik dalam
        mengakses informasi dan
        layanan PT-MMA.
      </p>

    </div>

  </div>


  {/* ==================================
      RIGHT
  ================================== */}

  <div className="register-right">

    <div className="register-card">

      <div className="register-heading">

        <h2>
          Buat Akun
        </h2>

        <p>
          Silakan lengkapi data
          berikut untuk mendaftar.
        </p>

      </div>


      <form
        onSubmit={handleSubmit}
      >

        {/* NAME */}

        <div className="register-group">

          <label htmlFor="name">
            Nama Lengkap
          </label>

          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            onChange={
              handleChange
            }
            placeholder="Masukkan nama lengkap"
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
            value={form.email}
            onChange={
              handleChange
            }
            placeholder="Masukkan email"
            autoComplete="email"
            required
          />

        </div>


        {/* PASSWORD */}

        <div className="register-group">

          <label htmlFor="password">
            Password
          </label>

          <div className="password-wrapper">

            <input
              id="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              value={
                form.password
              }
              onChange={
                handleChange
              }
              placeholder="Minimal 6 karakter"
              autoComplete="new-password"
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


        {/* CONFIRM PASSWORD */}

        <div className="register-group">

          <label htmlFor="password_confirmation">
            Konfirmasi Password
          </label>

          <div className="password-wrapper">

            <input
              id="password_confirmation"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="password_confirmation"
              value={
                form.password_confirmation
              }
              onChange={
                handleChange
              }
              placeholder="Ulangi password"
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              {showConfirmPassword
                ? "Sembunyikan"
                : "Lihat"}
            </button>

          </div>

        </div>


        {/* SUBMIT */}

        <button
          type="submit"
          className="register-submit"
          disabled={loading}
        >
          {loading
            ? "Mendaftarkan..."
            : "Daftar"}
        </button>

      </form>


      {/* LOGIN */}

      <div className="register-login">

        <span>
          Sudah memiliki akun?
        </span>

        <Link to="/login">
          Login di sini
        </Link>

      </div>

    </div>

  </div>

</div>

);
}

export default Register;
