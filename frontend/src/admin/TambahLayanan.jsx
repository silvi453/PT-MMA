import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import AdminModal from "../components/AdminModal";

function TambahLayanan() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    serviceType: "",
    estimatedTime: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==============================
  // MODAL
  // ==============================

  const [modal, setModal] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

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
  // HANDLE IMAGE
  // ==============================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ==============================
  // SUBMIT
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ==============================
    // VALIDASI NAMA
    // ==============================

    if (!formData.name.trim()) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Data Belum Lengkap",
        message: "Nama layanan wajib diisi.",
      });

      return;
    }

    // ==============================
    // VALIDASI DESKRIPSI
    // ==============================

    if (!formData.description.trim()) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Data Belum Lengkap",
        message: "Deskripsi layanan wajib diisi.",
      });

      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      /*
       * BACKEND SAAT INI HANYA MENERIMA:
       * name
       * description
       *
       * Field serviceType, estimatedTime, dan image
       * tetap digunakan di FE untuk tampilan.
       */

      const payload = new FormData();

      payload.append("name", formData.name);
      payload.append("description", formData.description);

      const response = await fetch(
        "http://127.0.0.1:8000/api/services",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },

          body: payload,
        }
      );

      const data = await response.json();

      console.log(
        "Response tambah layanan:",
        data
      );

      if (!response.ok) {
        if (data.errors) {
          const errors = Object.values(data.errors)
            .flat()
            .join("\n");

          throw new Error(errors);
        }

        throw new Error(
          data.message ||
            "Gagal menambahkan layanan"
        );
      }

      // ==============================
      // BERHASIL
      // ==============================

      setModal({
        isOpen: true,
        type: "success",
        title: "Berhasil!",
        message: "Layanan berhasil ditambahkan.",
      });

    } catch (error) {
      console.error(
        "Error submit layanan:",
        error
      );

      // ==============================
      // ERROR
      // ==============================

      setModal({
        isOpen: true,
        type: "error",
        title: "Gagal!",
        message:
          error.message ||
          "Terjadi kesalahan saat menyimpan layanan.",
      });

    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // TUTUP MODAL
  // ==============================

  const closeModal = () => {
    setModal({
      isOpen: false,
      type: "success",
      title: "",
      message: "",
    });
  };

  // ==============================
  // KONFIRMASI MODAL
  // ==============================

  const handleModalConfirm = () => {
    if (modal.type === "success") {
      setModal({
        isOpen: false,
        type: "success",
        title: "",
        message: "",
      });

      navigate("/admin/services");
    } else {
      closeModal();
    }
  };

  // ==============================
  // FORM
  // ==============================

  return (
    <div className="admin-form-container">

      {/* HEADER */}

      <div className="admin-form-header">

        <h2>
          Tambah Layanan Baru
        </h2>

        <p>
          Lengkapi informasi untuk menambahkan jenis
          layanan baru PT MMA.
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
              placeholder="Contoh: Kalibrasi & Maintenance Alat Laboratorium"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>


          {/* JENIS LAYANAN */}

          <div className="admin-form-group">

            <label>
              Jenis Layanan *
            </label>

            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
            >

              <option value="">
                -- Pilih Jenis --
              </option>

              <option value="Pemeliharaan (Maintenance)">
                Pemeliharaan (Maintenance)
              </option>

              <option value="Kalibrasi Alat">
                Kalibrasi Alat
              </option>

              <option value="Konsultasi & Instalasi">
                Konsultasi & Instalasi
              </option>

              <option value="Perbaikan (Repair)">
                Perbaikan (Repair)
              </option>

            </select>

          </div>


          {/* ESTIMASI */}

          <div className="admin-form-group">

            <label>
              Estimasi Pengerjaan
            </label>

            <input
              type="text"
              name="estimatedTime"
              placeholder="Contoh: 1 - 3 Hari Kerja"
              value={formData.estimatedTime}
              onChange={handleChange}
            />

          </div>


          {/* GAMBAR */}

          <div className="admin-form-group full-width">

            <label>
              Gambar / Ikon Banner Layanan
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

          </div>


          {/* PREVIEW */}

          {preview && (

            <div className="admin-form-group full-width image-preview-container">

              <label>
                Preview Gambar:
              </label>

              <img
                src={preview}
                alt="Preview Layanan"
                className="image-preview"
              />

            </div>

          )}


          {/* DESKRIPSI */}

          <div className="admin-form-group full-width">

            <label>
              Deskripsi & Cakupan Layanan *
            </label>

            <textarea
              name="description"
              rows="5"
              placeholder="Jelaskan detail cakupan perbaikan atau prosedur layanan..."
              value={formData.description}
              onChange={handleChange}
              required
            />

          </div>

        </div>


        {/* BUTTON */}

        <div className="admin-form-actions">

          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Batal
          </button>


          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >

            {loading
              ? "Menyimpan..."
              : "Simpan Layanan"}

          </button>

        </div>

      </form>


      {/* ==============================
          CUSTOM MODAL
      ============================== */}

      <AdminModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={handleModalConfirm}
        onCancel={closeModal}
      />

    </div>
  );
}

export default TambahLayanan;