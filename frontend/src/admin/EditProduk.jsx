import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "./Admin.css";
import AdminModal from "../components/AdminModal";

const API_URL = "http://127.0.0.1:8000";

function EditProduk() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
  });

  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);

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
  // URL GAMBAR
  // ==============================

  const getImageUrl = (image) => {
    if (!image) return null;

    // Gambar upload Laravel baru
    if (image.startsWith("products/")) {
      return `${API_URL}/storage/${image}`;
    }

    // Gambar lama frontend
    if (image.startsWith("/images/")) {
      return image;
    }

    // Misalnya database cuma menyimpan alkes1.png
    return `/images/${image}`;
  };

  // ==============================
  // AMBIL PRODUK
  // ==============================

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        if (!id || id === "undefined") {
          throw new Error(
            "ID produk tidak ditemukan."
          );
        }

        const response = await fetch(
          `${API_URL}/api/products/${id}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Gagal mengambil data produk."
          );
        }

        const product = result.data;

        setFormData({
          name: product.name || "",
          category: product.category || "",
          price: product.price || "",
          description: product.description || "",
          image: product.image || "",
        });

      } catch (error) {
        console.error(
          "Gagal mengambil produk:",
          error
        );

        setModal({
          isOpen: true,
          type: "error",
          title: "Gagal!",
          message:
            error.message ||
            "Gagal mengambil data produk.",
        });

      } finally {
        setLoading(false);
      }
    };

    fetchProduk();
  }, [id]);

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
  // PILIH GAMBAR BARU
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
          "Gunakan gambar JPG, JPEG, PNG, atau WEBP.",
      });

      e.target.value = "";
      return;
    }

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

    setNewImage(file);

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(
      URL.createObjectURL(file)
    );
  };

  // ==============================
  // SIMPAN PERUBAHAN
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id || id === "undefined") {
      setModal({
        isOpen: true,
        type: "error",
        title: "Gagal!",
        message: "ID produk tidak ditemukan.",
      });

      return;
    }

    setSaving(true);

    try {
      const token =
        localStorage.getItem("token");

      const payload = new FormData();

      /*
       * Kita pakai POST + _method=PUT.
       * Ini lebih aman untuk upload file multipart
       * ke Laravel/PHP dibanding PUT langsung.
       */
      payload.append("_method", "PUT");

      payload.append("name", formData.name);
      payload.append(
        "category",
        formData.category
      );
      payload.append(
        "description",
        formData.description
      );

      if (formData.price !== "") {
        payload.append(
          "price",
          formData.price
        );
      }

      // Hanya kirim image jika memilih gambar baru
      if (newImage) {
        payload.append(
          "image",
          newImage
        );
      }

      const response = await fetch(
        `${API_URL}/api/products/${id}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        }
      );

      const result = await response.json();

      console.log(
        "Response edit produk:",
        result
      );

      if (!response.ok) {
        if (result.errors) {
          const errors = Object.values(
            result.errors
          )
            .flat()
            .join("\n");

          throw new Error(errors);
        }

        throw new Error(
          result.message ||
            "Gagal memperbarui produk."
        );
      }

      setModal({
        isOpen: true,
        type: "success",
        title: "Berhasil!",
        message: "Produk berhasil diperbarui.",
      });

    } catch (error) {
      console.error(
        "Error edit produk:",
        error
      );

      setModal({
        isOpen: true,
        type: "error",
        title: "Gagal!",
        message:
          error.message ||
          "Terjadi kesalahan saat memperbarui produk.",
      });

    } finally {
      setSaving(false);
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
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="admin-form-container">

        <div className="admin-form-header">

          <h2>
            Memuat Data Produk...
          </h2>

          <p>
            Tunggu sebentar, data produk sedang diambil.
          </p>

        </div>

      </div>
    );
  }

  // ==============================
  // FORM
  // ==============================

  return (
    <div className="admin-form-container">

      {/* HEADER */}

      <div className="admin-form-header">

        <h2>
          Edit Produk
        </h2>

        <p>
          Ubah informasi produk alat kesehatan
          PT Mitra Meditama Abadi.
        </p>

      </div>


      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="admin-product-form"
      >

        <div className="admin-form-grid">

          {/* NAMA */}

          <div className="admin-form-group full-width">

            <label>
              Nama Produk *
            </label>

            <input
              type="text"
              name="name"
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

              <option value="Alat Kesehatan">
                Alat Kesehatan
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
              value={formData.price}
              onChange={handleChange}
              min="0"
            />

          </div>


          {/* GAMBAR BARU */}

          <div className="admin-form-group full-width">

            <label>
              Ganti Gambar Produk
            </label>

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleImageChange}
            />

            <small>
              Kosongkan jika tidak ingin mengganti gambar.
            </small>

          </div>


          {/* PREVIEW */}

          <div className="admin-form-group full-width">

            <label>
              Preview Gambar
            </label>

            <div className="image-preview-container">

              <img
                src={
                  preview ||
                  getImageUrl(formData.image)
                }
                alt={formData.name}
                className="image-preview"
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />

            </div>

          </div>


          {/* DESKRIPSI */}

          <div className="admin-form-group full-width">

            <label>
              Deskripsi Produk
            </label>

            <textarea
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tuliskan deskripsi produk..."
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

export default EditProduk;

