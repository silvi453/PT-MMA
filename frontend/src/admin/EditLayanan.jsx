import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Admin.css";

function EditLayanan() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // ==============================
  // AMBIL DATA LAYANAN
  // ==============================
  useEffect(() => {
    fetchLayanan();
  }, [id]);

  const fetchLayanan = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/services/${id}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();

      console.log("Response detail layanan:", result);

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal mengambil data layanan"
        );
      }

      const service = result.data;

      setFormData({
        name: service.name || "",
        description: service.description || "",
      });
    } catch (error) {
      console.error("Gagal mengambil layanan:", error);

      alert(
        error.message || "Gagal mengambil data layanan."
      );

      navigate("/admin/services");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // HANDLE INPUT
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // SIMPAN PERUBAHAN
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Nama layanan wajib diisi.");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://127.0.0.1:8000/api/services/${id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
          }),
        }
      );

      const result = await response.json();

      console.log("Response edit layanan:", result);

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal memperbarui layanan"
        );
      }

      alert("Layanan berhasil diperbarui!");

      navigate("/admin/services");
    } catch (error) {
      console.error("Error edit layanan:", error);

      alert(
        error.message ||
          "Terjadi kesalahan saat memperbarui layanan."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // LOADING
  // ==============================
  if (loading) {
    return (
      <div className="admin-form-container">
        <div className="admin-form-header">
          <h2>Memuat Data Layanan...</h2>

          <p>
            Tunggu sebentar, data layanan sedang diambil.
          </p>
        </div>
      </div>
    );
  }

  // ==============================
  // FORM EDIT
  // ==============================
  return (
    <div className="admin-form-container">

      {/* HEADER */}
      <div className="admin-form-header">
        <h2>Edit Layanan</h2>

        <p>
          Ubah informasi layanan PT Mitra Meditama Abadi.
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="admin-product-form"
      >

        <div className="admin-form-grid">

          {/* NAMA LAYANAN */}
          <div className="admin-form-group full-width">
            <label>
              Nama Layanan *
            </label>

            <input
              type="text"
              name="name"
              placeholder="Contoh: Konsultasi Alat Kesehatan"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* DESKRIPSI */}
          <div className="admin-form-group full-width">
            <label>
              Deskripsi Layanan
            </label>

            <textarea
              name="description"
              rows="6"
              placeholder="Tuliskan deskripsi layanan..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* BUTTON */}
        <div className="admin-form-actions">

          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate(-1)}
            disabled={saving}
          >
            Batal
          </button>

          <button
            type="submit"
            className="admin-login-button"
            disabled={saving}
          >
            {saving
              ? "Menyimpan..."
              : "Simpan Perubahan"}
          </button>

        </div>

      </form>
    </div>
  );
}

export default EditLayanan;