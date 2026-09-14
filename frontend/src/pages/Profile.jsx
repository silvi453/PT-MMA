import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const API_URL = "http://192.168.1.17:8000/api";
const STORAGE_URL = "http://192.168.1.17:8000/storage";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  // =========================
  // AMBIL DATA PROFILE
  // =========================
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal mengambil data profil."
        );
      }

      const userData =
        data?.data ||
        data?.user ||
        data;

      if (!userData || typeof userData !== "object") {
        throw new Error("Data pengguna tidak ditemukan.");
      }

      setUser(userData);

      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        password: "",
        password_confirmation: "",
      });

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );
    } catch (error) {
      console.error("Gagal mengambil profil:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INPUT FORM
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // BUKA EDIT PROFILE
  // =========================
  const handleEdit = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      password_confirmation: "",
    });

    setIsEditing(true);
  };

  // =========================
  // BATAL EDIT
  // =========================
  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      password_confirmation: "",
    });

    setIsEditing(false);
  };

  // =========================
  // SIMPAN PROFILE
  // =========================
  const handleSave = async (e) => {
    e.preventDefault();

    if (
      formData.password &&
      formData.password !==
        formData.password_confirmation
    ) {
      alert("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const body = {
        name: formData.name,
        email: formData.email,
      };

      // Password hanya dikirim kalau diisi
      if (formData.password) {
        body.password = formData.password;
        body.password_confirmation =
          formData.password_confirmation;
      }

      const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal memperbarui profil."
        );
      }

      const updatedUser =
        data?.data ||
        data?.user ||
        data;

      setUser(updatedUser);

      setFormData({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        password: "",
        password_confirmation: "",
      });

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setIsEditing(false);

      alert("Profil berhasil diperbarui!");
    } catch (error) {
      console.error(
        "Gagal memperbarui profil:",
        error
      );

      alert(
        error.message ||
          "Gagal memperbarui profil."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // UPLOAD FOTO PROFIL
  // =========================
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Foto harus berformat JPG, JPEG, PNG, atau WEBP."
      );
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran foto maksimal 2 MB.");
      e.target.value = "";
      return;
    }

    try {
      setUploadingPhoto(true);

      const token = localStorage.getItem("token");

      const form = new FormData();

      form.append(
        "name",
        user?.name || formData.name || ""
      );

      form.append(
        "email",
        user?.email || formData.email || ""
      );

      form.append("_method", "PUT");
      form.append("profile_photo", file);

      const response = await fetch(
        `${API_URL}/profile`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Gagal mengupload foto profil."
        );
      }

      const updatedUser =
        data?.data ||
        data?.user ||
        data;

      setUser(updatedUser);

      setFormData((prev) => ({
        ...prev,
        name: updatedUser.name || prev.name,
        email: updatedUser.email || prev.email,
      }));

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      alert("Foto profil berhasil diperbarui!");
    } catch (error) {
      console.error(
        "Gagal upload foto:",
        error
      );

      alert(
        error.message ||
          "Gagal mengupload foto profil."
      );
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  // =========================
  // FOTO PROFIL
  // =========================
  const getProfilePhoto = () => {
    if (!user?.profile_photo) {
      return null;
    }

    return `${STORAGE_URL}/${user.profile_photo}`;
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    const confirmLogout = window.confirm(
      "Apakah kamu yakin ingin logout?"
    );

    if (!confirmLogout) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="profile-spinner"></div>
          <p>Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* =========================
          HERO
      ========================= */}
      <section className="profile-hero">
        <div className="profile-container">
          <div className="profile-hero-content">
            <span className="profile-eyebrow">
              Akun Saya
            </span>

            <h1>Profil Saya</h1>

            <p>
              Kelola informasi akun dan data pribadi
              Anda.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          CONTENT
      ========================= */}
      <section className="profile-section">
        <div className="profile-container">

          {/* =========================
              PROFILE CARD
          ========================= */}
          <div className="profile-user-card">

            {/* FOTO */}
            <div
              className="profile-avatar-wrapper"
              style={{
                position: "relative",
              }}
            >
              {getProfilePhoto() ? (
                <img
                  src={getProfilePhoto()}
                  alt="Foto Profil"
                  className="profile-avatar"
                  style={{
                    objectFit: "cover",
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <div className="profile-avatar">
                  {user?.name
                    ? user.name
                        .charAt(0)
                        .toUpperCase()
                    : "U"}
                </div>
              )}

              {/* BUTTON FOTO */}
              <label
                htmlFor="profile-photo"
                className="profile-photo-button"
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "#d71920",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: uploadingPhoto
                    ? "not-allowed"
                    : "pointer",
                  border: "3px solid #fff",
                  fontSize: "17px",
                  opacity: uploadingPhoto
                    ? 0.6
                    : 1,
                }}
                title="Ganti foto profil"
              >
                {uploadingPhoto
                  ? "..."
                  : "📷"}
              </label>

              <input
                id="profile-photo"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handlePhotoChange}
                disabled={uploadingPhoto}
                style={{ display: "none" }}
              />
            </div>

            {/* NAMA */}
            <h2>
              {user?.name || "Pengguna"}
            </h2>

            {/* EMAIL */}
            <p className="profile-user-email">
              {user?.email ||
                "Email belum tersedia"}
            </p>

            {/* ROLE */}
            <div className="profile-user-role">
              <span className="profile-role-dot"></span>

              {user?.role === "admin"
                ? "Administrator"
                : "Pengguna"}
            </div>

            <div className="profile-user-divider"></div>

            {/* DATA PROFILE */}
            <div className="profile-information">

              <div className="profile-information-item">
                <span className="profile-information-icon">
                  👤
                </span>

                <div>
                  <strong>Nama Pengguna</strong>

                  <p>
                    {user?.name ||
                      "Belum tersedia"}
                  </p>
                </div>
              </div>

              <div className="profile-information-item">
                <span className="profile-information-icon">
                  ✉
                </span>

                <div>
                  <strong>Email</strong>

                  <p>
                    {user?.email ||
                      "Belum tersedia"}
                  </p>
                </div>
              </div>

              <div className="profile-information-item">
                <span className="profile-information-icon">
                  ✓
                </span>

                <div>
                  <strong>Role</strong>

                  <p>
                    {user?.role === "admin"
                      ? "Administrator"
                      : "Pengguna"}
                  </p>
                </div>
              </div>
            </div>

            {/* EDIT BUTTON */}
            {!isEditing && (
              <button
                type="button"
                className="profile-edit-button"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* =========================
              EDIT PROFILE
          ========================= */}
          {isEditing && (
            <div className="profile-detail-card">

              <div className="profile-detail-header">
                <div>
                  <span className="profile-detail-label">
                    PENGATURAN AKUN
                  </span>

                  <h2>Edit Profile</h2>
                </div>
              </div>

              <form
                className="profile-form"
                onSubmit={handleSave}
              >

                {/* NAMA */}
                <div className="profile-form-group">
                  <label htmlFor="name">
                    Nama Pengguna
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama pengguna"
                    required
                  />
                </div>

                {/* EMAIL */}
                <div className="profile-form-group">
                  <label htmlFor="email">
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Masukkan email"
                    required
                  />
                </div>

                {/* PASSWORD */}
                <div className="profile-form-group">
                  <label htmlFor="password">
                    Password Baru
                  </label>

                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Kosongkan jika tidak ingin mengganti"
                  />
                </div>

                {/* KONFIRMASI PASSWORD */}
                <div className="profile-form-group">
                  <label htmlFor="password_confirmation">
                    Konfirmasi Password
                  </label>

                  <input
                    id="password_confirmation"
                    type="password"
                    name="password_confirmation"
                    value={
                      formData.password_confirmation
                    }
                    onChange={handleChange}
                    placeholder="Ulangi password baru"
                  />
                </div>

                {/* BUTTON */}
                <div className="profile-form-actions">

                  <button
                    type="button"
                    className="profile-cancel-button"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="profile-save-button"
                    disabled={saving}
                  >
                    {saving
                      ? "Menyimpan..."
                      : "Simpan"}
                  </button>

                </div>
              </form>
            </div>
          )}

          {/* =========================
              LOGOUT
          ========================= */}
          <div className="profile-logout-card">
            <div className="profile-logout-content">

              <div className="profile-logout-icon">
                ↪
              </div>

              <div>
                <h3>Keluar dari Akun</h3>

                <p>
                  Anda akan keluar dari akun ini pada
                  perangkat ini.
                </p>
              </div>

            </div>

            <button
              type="button"
              className="profile-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}

export default Profile;

