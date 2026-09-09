import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminProfile.css";

const API_URL = "http://127.0.0.1:8000";

function AdminProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/admin", { replace: true });
      return;
    }

    fetchUser(token);
  }, [navigate]);

  const fetchUser = async (token) => {
    try {
      const response = await fetch(
        `${API_URL}/api/user`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data profil.");
      }

      const result = await response.json();

      const user = result.data;

      setForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
        password_confirmation: "",
      });

    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data profil.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/profile`,
        {
          method: "PUT",

          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password || null,
            password_confirmation:
              form.password_confirmation || null,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          const firstError =
            Object.values(result.errors)[0];

          throw new Error(
            Array.isArray(firstError)
              ? firstError[0]
              : "Data tidak valid."
          );
        }

        throw new Error(
          result.message ||
            "Gagal memperbarui profil."
        );
      }

      const oldUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const updatedUser = {
        ...oldUser,
        ...result.data,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setForm((prev) => ({
        ...prev,
        password: "",
        password_confirmation: "",
      }));

      setMessage(
        "Profil berhasil diperbarui."
      );

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Terjadi kesalahan."
      );

    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-profile-page">
        <div className="admin-profile-loading">
          Memuat profil...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-profile-page">

      <div className="admin-profile-container">

        {/* HEADER */}

        <div className="admin-profile-header">

          <button
            className="admin-back-button"
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            ← Kembali
          </button>

          <div>
            <h1>Profil Admin</h1>

            <p>
              Kelola informasi akun admin Anda.
            </p>
          </div>

        </div>

        <div className="admin-profile-card">

          <div className="admin-profile-avatar">
            👤
          </div>

          <div className="admin-profile-info">

            <h2>
              {form.name || "Admin"}
            </h2>

            <p>
              {form.email}
            </p>

          </div>

          {message && (
            <div className="admin-profile-success">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="admin-profile-error">
              ⚠ {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="admin-profile-form"
          >

            <div className="admin-form-group">

              <label>
                Nama
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Masukkan nama"
                required
              />

            </div>

            <div className="admin-form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Masukkan email"
                required
              />

            </div>

            <div className="admin-form-group">

              <label>
                Password Baru
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Kosongkan jika tidak ingin mengubah"
              />

              <small>
                Minimal 6 karakter.
              </small>

            </div>

            <div className="admin-form-group">

              <label>
                Konfirmasi Password Baru
              </label>

              <input
                type="password"
                name="password_confirmation"
                value={
                  form.password_confirmation
                }
                onChange={handleChange}
                placeholder="Ulangi password baru"
              />

            </div>

            <div className="admin-profile-actions">

              <button
                type="button"
                className="admin-profile-cancel"
                onClick={() =>
                  navigate("/admin/dashboard")
                }
              >
                Batal
              </button>

              <button
                type="submit"
                className="admin-profile-save"
                disabled={saving}
              >
                {saving
                  ? "Menyimpan..."
                  : "Simpan Perubahan"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default AdminProfile;