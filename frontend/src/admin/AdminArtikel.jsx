import { useEffect, useState } from "react";
import "./AdminArtikel.css";

const API_URL = "http://127.0.0.1:8000/api/articles";
const IMAGE_URL = "http://127.0.0.1:8000/storage/";

function AdminArtikel() {
const [articles, setArticles] = useState([]);

const [form, setForm] = useState({
title: "",
category: "",
summary: "",
content: "",
image: null,
});

const [editingId, setEditingId] = useState(null);
const [oldImage, setOldImage] = useState(null);
const [previewImage, setPreviewImage] = useState(null);

const [showForm, setShowForm] = useState(false);

const [loading, setLoading] = useState(false);
const [loadingData, setLoadingData] = useState(true);

// =========================
// GET ARTICLES
// =========================
useEffect(() => {
fetchArticles();
}, []);

const fetchArticles = async () => {
try {
setLoadingData(true);

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Gagal mengambil data artikel");
  }

  const result = await response.json();

  setArticles(result.data || []);
} catch (error) {
  console.error("Fetch artikel error:", error);
  alert("Gagal mengambil data artikel dari server.");
} finally {
  setLoadingData(false);
}


};

// =========================
// OPEN ADD FORM
// =========================
const handleAdd = () => {
resetForm();
setShowForm(true);


setTimeout(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, 100);


};

// =========================
// HANDLE INPUT
// =========================
const handleChange = (e) => {
const { name, value, files } = e.target;


if (name === "image") {
  const file = files?.[0] || null;

  setForm((prev) => ({
    ...prev,
    image: file,
  }));

  if (previewImage) {
    URL.revokeObjectURL(previewImage);
  }

  if (file) {
    setPreviewImage(URL.createObjectURL(file));
  } else {
    setPreviewImage(null);
  }

  return;
}

setForm((prev) => ({
  ...prev,
  [name]: value,
}));


};

// =========================
// RESET FORM
// =========================
const resetForm = () => {
if (previewImage) {
URL.revokeObjectURL(previewImage);
}


setForm({
  title: "",
  category: "",
  summary: "",
  content: "",
  image: null,
});

setEditingId(null);
setOldImage(null);
setPreviewImage(null);

const fileInput =
  document.getElementById("article-image");

if (fileInput) {
  fileInput.value = "";
}

};

// =========================
// CLOSE FORM
// =========================
const handleCancel = () => {
resetForm();
setShowForm(false);
};

// =========================
// SUBMIT
// =========================
const handleSubmit = async (e) => {
e.preventDefault();


if (!form.title.trim()) {
  alert("Judul artikel wajib diisi.");
  return;
}

setLoading(true);

try {
  const formData = new FormData();

  formData.append("title", form.title.trim());
  formData.append("category", form.category.trim());
  formData.append("summary", form.summary.trim());
  formData.append("content", form.content.trim());

  if (form.image) {
    formData.append("image", form.image);
  }

  let url = API_URL;

  if (editingId) {
    url = `${API_URL}/${editingId}`;

    formData.append("_method", "PUT");
  }

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("Response Laravel:", result);

    if (result.errors) {
      const messages = Object.values(result.errors)
        .flat()
        .join("\n");

      alert(messages);
    } else {
      alert(
        result.message ||
          "Gagal menyimpan artikel."
      );
    }

    return;
  }

  alert(
    editingId
      ? "Artikel berhasil diperbarui!"
      : "Artikel berhasil ditambahkan!"
  );

  resetForm();
  setShowForm(false);

  await fetchArticles();
} catch (error) {
  console.error("Submit artikel error:", error);

  alert(
    "Tidak dapat terhubung ke server Laravel.\n\nPastikan php artisan serve sedang berjalan."
  );
} finally {
  setLoading(false);
}


};

// =========================
// EDIT
// =========================
const handleEdit = (article) => {
setEditingId(article.id);


setForm({
  title: article.title || "",
  category: article.category || "",
  summary: article.summary || "",
  content: article.content || "",
  image: null,
});

setOldImage(article.image || null);

if (previewImage) {
  URL.revokeObjectURL(previewImage);
}

setPreviewImage(null);

setShowForm(true);

setTimeout(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, 100);


};

// =========================
// DELETE
// =========================
const handleDelete = async (id) => {
const confirmation = window.confirm(
"Yakin ingin menghapus artikel ini?"
);

if (!confirmation) {
  return;
}

try {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    alert(
      result.message ||
        "Gagal menghapus artikel."
    );

    return;
  }

  alert("Artikel berhasil dihapus!");

  if (editingId === id) {
    handleCancel();
  }

  await fetchArticles();
} catch (error) {
  console.error(
    "Delete artikel error:",
    error
  );

  alert(
    "Tidak dapat terhubung ke server."
  );
}


};

// =========================
// IMAGE URL
// =========================
const getImageUrl = (image) => {
if (!image) {
return null;
}

return `${IMAGE_URL}${image}`;

};

return ( <div className="admin-artikel">


  {/* ==================================
      HEADER
  ================================== */}

  <div className="artikel-page-header">
    <div>
      <span className="artikel-header-label">
        Admin Panel
      </span>

      <h1>Kelola Artikel</h1>

      <p>
        Kelola informasi dan artikel
        terbaru PT-MMA.
      </p>
    </div>

    <div className="artikel-total-box">
      <span>Total Artikel</span>
      <strong>{articles.length}</strong>
    </div>
  </div>


  {/* ==================================
      ADD BUTTON
  ================================== */}

  {!showForm && (
    <div className="artikel-toolbar">
      <div>
        <h2>Artikel</h2>

        <p>
          Daftar artikel yang tersedia
          di website.
        </p>
      </div>

      <button
        type="button"
        className="artikel-add-btn"
        onClick={handleAdd}
      >
        <span>＋</span>
        Tambah Artikel
      </button>
    </div>
  )}


  {/* ==================================
      FORM
  ================================== */}

  {showForm && (
    <div className="artikel-form-card">

      <div className="artikel-form-heading">

        <div>
          <h2>
            {editingId
              ? "Edit Artikel"
              : "Tambah Artikel"}
          </h2>

          <p>
            {editingId
              ? "Perbarui informasi artikel."
              : "Isi data artikel baru."}
          </p>
        </div>

        {editingId && (
          <span className="edit-badge">
            Mode Edit
          </span>
        )}

      </div>


      <form onSubmit={handleSubmit}>

        <div className="artikel-form-grid">

          {/* LEFT */}

          <div className="artikel-form-left">

            <div className="form-group">

              <label htmlFor="article-title">
                Judul Artikel
                <span className="required">
                  *
                </span>
              </label>

              <input
                id="article-title"
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Masukkan judul artikel"
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="article-category">
                Kategori
              </label>

              <input
                id="article-category"
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Contoh: Kesehatan"
              />

            </div>


            <div className="form-group">

              <label htmlFor="article-summary">
                Ringkasan Artikel
              </label>

              <textarea
                id="article-summary"
                name="summary"
                value={form.summary}
                onChange={handleChange}
                placeholder="Tuliskan ringkasan singkat..."
                rows="5"
              />

            </div>


            <div className="form-group">

              <label htmlFor="article-content">
                Isi Artikel
              </label>

              <textarea
                id="article-content"
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Tuliskan isi artikel..."
                rows="12"
              />

            </div>

          </div>


          {/* RIGHT */}

          <div className="artikel-form-right">

            <div className="form-group">

              <label htmlFor="article-image">
                Gambar Artikel
              </label>

              <input
                id="article-image"
                type="file"
                name="image"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleChange}
              />

              <small>
                JPG, JPEG, PNG, WEBP.
                Maksimal 5 MB.
              </small>

            </div>


            <div className="image-preview-box">

              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview artikel"
                />
              ) : editingId &&
                oldImage ? (
                <img
                  src={getImageUrl(
                    oldImage
                  )}
                  alt="Gambar artikel"
                />
              ) : (
                <div className="image-placeholder">
                  <span>🖼️</span>

                  <p>
                    Preview gambar
                  </p>
                </div>
              )}

            </div>


            {editingId &&
              oldImage &&
              !previewImage && (
                <p className="old-image-info">
                  Pilih gambar baru jika
                  ingin mengganti gambar lama.
                </p>
              )}


            {form.image && (
              <div className="selected-file">

                <span>
                  File dipilih:
                </span>

                <strong>
                  {form.image.name}
                </strong>

              </div>
            )}

          </div>

        </div>


        {/* FORM BUTTONS */}

        <div className="artikel-form-actions">

          <button
            type="submit"
            className="artikel-submit-btn"
            disabled={loading}
          >
            {loading
              ? "Menyimpan..."
              : editingId
              ? "Simpan Perubahan"
              : "Tambah Artikel"}
          </button>


          <button
            type="button"
            className="artikel-cancel-btn"
            onClick={handleCancel}
            disabled={loading}
          >
            Batal
          </button>

        </div>

      </form>

    </div>
  )}


  {/* ==================================
      ARTICLE LIST
  ================================== */}

  <div className="artikel-list-section">

    <div className="artikel-list-header">

      <div>
        <h2>Daftar Artikel</h2>

        <p>
          {articles.length} artikel
          tersedia
        </p>
      </div>


      <button
        type="button"
        className="artikel-refresh-btn"
        onClick={fetchArticles}
        disabled={loadingData}
      >
        {loadingData
          ? "Memuat..."
          : "↻ Refresh"}
      </button>

    </div>


    {/* LOADING */}

    {loadingData ? (
      <div className="artikel-state-box">

        <div className="artikel-loader" />

        <p>
          Memuat artikel...
        </p>

      </div>
    ) : articles.length === 0 ? (

      /* EMPTY */

      <div className="artikel-state-box">

        <div className="artikel-empty-icon">
          📰
        </div>

        <h3>
          Belum ada artikel
        </h3>

        <p>
          Klik tombol Tambah Artikel
          untuk membuat artikel baru.
        </p>

      </div>

    ) : (

      /* ARTICLES */

      <div className="artikel-grid">

        {articles.map((article) => (

          <div
            className="artikel-card"
            key={article.id}
          >

            {/* IMAGE */}

            <div className="artikel-card-image-wrap">

              {article.image ? (
                <img
                  src={getImageUrl(
                    article.image
                  )}
                  alt={article.title}
                  className="artikel-card-image"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <div className="artikel-no-image">

                  <span>🖼️</span>

                  <p>
                    Tidak ada gambar
                  </p>

                </div>
              )}


              {article.category && (
                <span className="artikel-card-category">
                  {article.category}
                </span>
              )}

            </div>


            {/* CONTENT */}

            <div className="artikel-card-body">

              <h3>
                {article.title}
              </h3>


              <p className="artikel-card-summary">
                {article.summary ||
                  "Tidak ada ringkasan artikel."}
              </p>


              {article.created_at && (
                <p className="artikel-card-date">

                  {new Date(
                    article.created_at
                  ).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}

                </p>
              )}


              {/* ACTION */}

              <div className="artikel-card-actions">

                <button
                  type="button"
                  className="artikel-edit-btn"
                  onClick={() =>
                    handleEdit(
                      article
                    )
                  }
                >
                  Edit
                </button>


                <button
                  type="button"
                  className="artikel-delete-btn"
                  onClick={() =>
                    handleDelete(
                      article.id
                    )
                  }
                >
                  Hapus
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    )}

  </div>

</div>

);
}

export default AdminArtikel;
