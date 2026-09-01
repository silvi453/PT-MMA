import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import AdminModal from "../components/AdminModal";

const API_URL = "http://127.0.0.1:8000";

function TambahProduk() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
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
  // HANDLE GAMBAR
  // ==============================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setModal({
        isOpen: true,
        type: "error",
        title: "File Tidak Valid!",
        message:
          "Gunakan gambar dengan format JPG, JPEG, PNG, atau WEBP.",
      });

      e.target.value = "";
      return;
    }

    // maksimal 2 MB
    if (file.size > 2 * 1024 * 1024) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Ukuran Terlalu Besar!",
        message: "Ukuran gambar maksimal 2 MB.",
      });

      e.target.value = "";
      return;
    }

    setImage(file);

    // Hapus preview lama kalau ada
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const previewUrl = URL.createObjectURL(file);

    setPreview(previewUrl);
  };

  // ==============================
  // SUBMIT
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Data Belum Lengkap!",
        message: "Nama produk wajib diisi.",
      });

      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // ==============================
      // FORM DATA
      // ==============================

      const payload = new FormData();

      payload.append("name", formData.name);
      payload.append("category", formData.category);
      payload.append("description", formData.description);

      if (formData.price !== "") {
        payload.append("price", formData.price);
      }

      if (image) {
        payload.append("image", image);
      }

      // ==============================
      // REQUEST
      // ==============================

      const response = await fetch(
        `${API_URL}/api/products`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        }
      );

      const data = await response.json();

      console.log("Response tambah produk:", data);

      if (!response.ok) {
        if (data.errors) {
          const errors = Object.values(data.errors)
            .flat()
            .join("\n");

          throw new Error(errors);
        }

        throw new Error(
          data.message || "Gagal menambahkan produk."
        );
      }

      // ==============================
      // BERHASIL
      // ==============================

      setModal({
        isOpen: true,
        type: "success",
        title: "Berhasil!",
        message: "Produk berhasil ditambahkan.",
      });
    } catch (error) {
      console.error(
        "Error menambahkan produk:",
        error
      );

      setModal({
        isOpen: true,
        type: "error",
        title: "Gagal!",
        message:
          error.message ||
          "Terjadi kesalahan saat menambahkan produk.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // MODAL
  // ==============================

  const closeModal = () => {
    setModal({
      isOpen: false,
      type: "success",
      title: "",
      message: "",
    });
  };

  const handleModalConfirm = () => {
    if (modal.type === "success") {
      closeModal();

      navigate("/admin/products");
      return;
    }

    closeModal();
  };

  // ==============================
  // RENDER
  // ==============================

  return (
    <div className="admin-form-container">

      {/* HEADER */}

      <div className="admin-form-header">

        <h2>
          Tambah Produk Baru
        </h2>

        <p>
          Lengkapi data produk alat kesehatan PT MMA.
        </p>

      </div>


      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="admin-product-form"
      >

        <div className="admin-form-grid">

          {/* NAMA PRODUK */}

          <div className="admin-form-group full-width">

            <label>
              Nama Produk *
            </label>

            <input
              type="text"
              name="name"
              placeholder="Contoh: Patient Monitor"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>


          {/* KATEGORI */}

          <div className="admin-form-group">

            <label>
              Kategori
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >

              <option value="">
                -- Pilih Kategori --
              </option>

              <option value="Alat Diagnostik">
                Alat Diagnostik
              </option>

              <option value="Alat Medis">
                Alat Medis
              </option>

              <option value="Peralatan Rumah Sakit">
                Peralatan Rumah Sakit
              </option>

              <option value="Perlengkapan Medis">
                Perlengkapan Medis
              </option>

              <option value="Lainnya">
                Lainnya
              </option>

            </select>

          </div>


          {/* HARGA */}

          <div className="admin-form-group">

            <label>
              Harga (Rp)
            </label>

            <input
              type="number"
              name="price"
              placeholder="Contoh: 15000000"
              value={formData.price}
              onChange={handleChange}
              min="0"
            />

          </div>


          {/* GAMBAR */}

          <div className="admin-form-group full-width">

            <label>
              Gambar Produk
            </label>

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleImageChange}
            />

            <small>
              Pilih gambar JPG, JPEG, PNG, atau WEBP.
              Maksimal 2 MB.
            </small>

          </div>


          {/* PREVIEW GAMBAR */}

          {preview && (

            <div className="admin-form-group full-width">

              <label>
                Preview Gambar
              </label>

              <div className="image-preview-container">

                <img
                  src={preview}
                  alt="Preview Produk"
                  className="image-preview"
                />

              </div>

            </div>

          )}


          {/* DESKRIPSI */}

          <div className="admin-form-group full-width">

            <label>
              Deskripsi Produk
            </label>

            <textarea
              name="description"
              rows="5"
              placeholder="Tuliskan deskripsi produk..."
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
              : "Simpan Produk"}

          </button>

        </div>

      </form>


      {/* MODAL */}

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

export default TambahProduk;

