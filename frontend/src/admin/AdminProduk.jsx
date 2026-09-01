import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminProduk.css";
import AdminModal from "../components/AdminModal";

const API_URL = "http://127.0.0.1:8000";

function AdminProduk() {
  const navigate = useNavigate();

  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] =
    useState(null);

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
    if (!image) {
      return null;
    }

    // ==================================
    // GAMBAR BARU HASIL UPLOAD LARAVEL
    // contoh:
    // products/abc123.png
    // ==================================

    if (image.startsWith("products/")) {
      return `${API_URL}/storage/${image}`;
    }

    // ==================================
    // GAMBAR LAMA FRONTEND
    // contoh:
    // /images/alkes1.png
    // ==================================

    if (image.startsWith("/images/")) {
      return image;
    }

    // ==================================
    // GAMBAR LAMA YANG CUMA NAMA FILE
    // contoh:
    // alkes1.png
    // ==================================

    return `/images/${image}`;
  };

  // ==============================
  // AMBIL DATA PRODUK
  // ==============================

  const fetchProduk = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/products`,
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

      const dataProduk =
        Array.isArray(result.data)
          ? result.data
          : Array.isArray(result)
          ? result
          : [];

      setProduk(dataProduk);

    } catch (error) {
      console.error(
        "Error mengambil produk:",
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

  useEffect(() => {
    fetchProduk();
  }, []);

  // ==============================
  // TAMBAH PRODUK
  // ==============================

  const handleTambahProduk = () => {
    navigate("/admin/tambahproduk");
  };

  // ==============================
  // EDIT PRODUK
  // ==============================

  const handleEdit = (id) => {
    if (!id) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Gagal!",
        message:
          "ID produk tidak ditemukan.",
      });

      return;
    }

    navigate(
      `/admin/editproduk/${id}`
    );
  };

  // ==============================
  // HAPUS
  // ==============================

  const handleDelete = (id) => {
    if (!id) return;

    setDeleteId(id);

    setModal({
      isOpen: true,
      type: "confirm",
      title: "Hapus Produk?",
      message:
        "Apakah Anda yakin ingin menghapus produk ini?",
    });
  };

  // ==============================
  // KONFIRMASI DELETE
  // ==============================

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/products/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Gagal menghapus produk."
        );
      }

      setDeleteId(null);

      await fetchProduk();

      setModal({
        isOpen: true,
        type: "success",
        title: "Berhasil!",
        message:
          "Produk berhasil dihapus.",
      });

    } catch (error) {
      console.error(
        "Error hapus produk:",
        error
      );

      setDeleteId(null);

      setModal({
        isOpen: true,
        type: "error",
        title: "Gagal!",
        message:
          error.message ||
          "Gagal menghapus produk.",
      });
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

    setDeleteId(null);
  };

  const handleModalConfirm = () => {
    if (modal.type === "confirm") {
      confirmDelete();
      return;
    }

    closeModal();
  };

  // ==============================
  // STATISTIK
  // ==============================

  const totalKategori =
    new Set(
      produk
        .map((item) => item.category)
        .filter(Boolean)
    ).size;

  // ==============================
  // RENDER
  // ==============================

  return (
    <div className="admin-produk-page">

      {/* HEADER */}

      <div className="admin-produk-header">

        <div>

          <span className="admin-section-label">
            MANAJEMEN PRODUK
          </span>

          <h1>
            Produk
          </h1>

          <p>
            Kelola produk alat kesehatan PT Mitra
            Meditama Abadi.
          </p>

        </div>


        <button
          type="button"
          className="admin-produk-add"
          onClick={handleTambahProduk}
        >

          <span>
            +
          </span>

          Tambah Produk

        </button>

      </div>


      {/* GARIS MERAH */}

      <div className="admin-red-line"></div>


      {/* ==============================
          STATISTIK
      ============================== */}

      <div className="admin-produk-statistik">

        {/* TOTAL PRODUK */}

        <div className="admin-produk-stat">

          <div className="admin-stat-icon">
            📦
          </div>

          <div>

            <span>
              Total Produk
            </span>

            <strong>
              {produk.length}
            </strong>

          </div>

        </div>


        {/* KATEGORI */}

        <div className="admin-produk-stat">

          <div className="admin-stat-icon">
            🏥
          </div>

          <div>

            <span>
              Kategori Produk
            </span>

            <strong>
              {totalKategori}
            </strong>

          </div>

        </div>


        {/* AKTIF */}

        <div className="admin-produk-stat">

          <div className="admin-stat-icon">
            ✓
          </div>

          <div>

            <span>
              Produk Aktif
            </span>

            <strong>
              {produk.length}
            </strong>

          </div>

        </div>

      </div>


      {/* ==============================
          DAFTAR PRODUK
      ============================== */}

      <section className="admin-produk-section">

        <div className="admin-produk-section-title">

          <h2>
            DAFTAR PRODUK
          </h2>

          <span></span>

          <p>
            Produk yang tersedia pada website PT MMA
          </p>

        </div>


        {/* LOADING */}

        {loading && (

          <div className="admin-produk-loading">
            Memuat data produk...
          </div>

        )}


        {/* KOSONG */}

        {!loading &&
          produk.length === 0 && (

            <div className="admin-produk-empty">

              <div className="admin-empty-symbol">
                📦
              </div>

              <h3>
                Belum Ada Produk
              </h3>

              <p>
                Belum ada produk yang ditambahkan
                ke dalam database.
              </p>

              <button
                type="button"
                className="admin-produk-add"
                onClick={handleTambahProduk}
              >
                <span>+</span>
                Tambah Produk
              </button>

            </div>

          )}


        {/* ==============================
            GRID PRODUK
        ============================== */}

        {!loading &&
          produk.length > 0 && (

            <div className="admin-produk-grid">

              {produk.map((item) => {

                const imageUrl =
                  getImageUrl(item.image);

                return (

                  <div
                    className="admin-produk-card"
                    key={item.id}
                  >

                    {/* ==========================
                        GAMBAR
                    ========================== */}

                    <div className="admin-produk-image">

                      {imageUrl ? (

                        <img
                          src={imageUrl}
                          alt={item.name || "Produk"}

                          onError={(e) => {

                            e.currentTarget.style.display =
                              "none";

                            const placeholder =
                              e.currentTarget
                                .nextElementSibling;

                            if (placeholder) {
                              placeholder.style.display =
                                "flex";
                            }

                          }}
                        />

                      ) : null}


                      <div
                        className="admin-produk-placeholder"
                        style={{
                          display:
                            imageUrl
                              ? "none"
                              : "flex",
                        }}
                      >
                        🏥
                      </div>

                    </div>


                    {/* ==========================
                        INFORMASI
                    ========================== */}

                    <div className="admin-produk-info">

                      <span className="admin-produk-category">

                        {item.category ||
                          "Alat Kesehatan"}

                      </span>


                      <h3>
                        {item.name ||
                          "Nama Produk"}
                      </h3>


                      <p>
                        {item.description ||
                          "Belum ada deskripsi produk."}
                      </p>


                      {/* HARGA */}

                      <div className="admin-produk-price">

                        {item.price !== null &&
                        item.price !== undefined &&
                        item.price !== ""
                          ? `Rp ${Number(
                              item.price
                            ).toLocaleString(
                              "id-ID"
                            )}`
                          : "Harga belum tersedia"}

                      </div>


                      {/* DETAIL */}

                      <div className="admin-produk-detail">

                        Lihat Detail

                        <span>
                          →
                        </span>

                      </div>

                    </div>


                    {/* ==========================
                        ACTION
                    ========================== */}

                    <div className="admin-produk-actions">

                      <button
                        type="button"
                        className="admin-produk-edit"
                        onClick={() =>
                          handleEdit(item.id)
                        }
                      >
                        ✏ Edit
                      </button>


                      <button
                        type="button"
                        className="admin-produk-delete"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                      >
                        🗑 Hapus
                      </button>

                    </div>

                  </div>

                );

              })}

            </div>

          )}

      </section>


      {/* ==============================
          MODAL
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

export default AdminProduk;

