import { useState } from "react";
import "./AdminArtikel.css";

const API_URL = "http://127.0.0.1:8000/api/articles";

function AdminArtikel() {
const [form, setForm] = useState({
title: "",
category: "",
summary: "",
content: "",
image: null,
});

const [loading, setLoading] = useState(false);

// =========================
// HANDLE INPUT
// =========================
const handleChange = (e) => {
const { name, value, files } = e.target;


if (name === "image") {
  setForm((prev) => ({
    ...prev,
    image: files && files.length > 0 ? files[0] : null,
  }));

  return;
}

setForm((prev) => ({
  ...prev,
  [name]: value,
}));

};

// =========================
// TAMBAH ARTIKEL
// =========================
const handleSubmit = async (e) => {
e.preventDefault();


// Cek judul
if (!form.title.trim()) {
  alert("Judul artikel wajib diisi!");
  return;
}

setLoading(true);

try {
  const formData = new FormData();

  // Data wajib
  formData.append("title", form.title.trim());

  // Data lainnya
  formData.append("category", form.category.trim());
  formData.append("summary", form.summary.trim());
  formData.append("content", form.content.trim());

  // Gambar
  if (form.image) {
    formData.append("image", form.image);
  }

  // DEBUG
  console.log("========== DATA YANG DIKIRIM ==========");
  console.log("title:", form.title);
  console.log("category:", form.category);
  console.log("summary:", form.summary);
  console.log("content:", form.content);
  console.log("image:", form.image);

  for (const [key, value] of formData.entries()) {
    console.log(key, ":", value);
  }

  console.log("=======================================");

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  console.log("Response Laravel:", result);

  // =========================
  // ERROR
  // =========================
  if (!response.ok) {
    if (result.errors) {
      const messages = Object.values(result.errors)
        .flat()
        .join("\n");

      alert(messages);
    } else {
      alert(
        result.message ||
          "Gagal menambahkan artikel."
      );
    }

    return;
  }

  // =========================
  // BERHASIL
  // =========================
  alert("Artikel berhasil ditambahkan!");

  // Kosongkan form
  setForm({
    title: "",
    category: "",
    summary: "",
    content: "",
    image: null,
  });

  // Reset input gambar
  const imageInput =
    document.getElementById("article-image");

  if (imageInput) {
    imageInput.value = "";
  }
} catch (error) {
  console.error("Error:", error);

  alert(
    "Tidak dapat terhubung ke server Laravel.\n\n" +
      "Pastikan backend sedang berjalan dengan:\n" +
      "php artisan serve"
  );
} finally {
  setLoading(false);
}


};

return ( <div className="admin-artikel">


  {/* =========================
      HEADER
  ========================= */}
  <div className="artikel-header">
    <h1>Tambah Artikel</h1>

    <p>
      Tambahkan artikel terbaru untuk
      website PT-MMA.
    </p>
  </div>

  {/* =========================
      FORM
  ========================= */}
  <div className="artikel-form-card">

    <h2>Form Artikel</h2>

    <form onSubmit={handleSubmit}>

      {/* JUDUL */}
      <div className="form-group">
        <label htmlFor="article-title">
          Judul Artikel
          <span>*</span>
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

      {/* KATEGORI */}
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

      {/* RINGKASAN */}
      <div className="form-group">
        <label htmlFor="article-summary">
          Ringkasan Artikel
        </label>

        <textarea
          id="article-summary"
          name="summary"
          value={form.summary}
          onChange={handleChange}
          placeholder="Masukkan ringkasan artikel"
          rows="4"
        />
      </div>

      {/* ISI ARTIKEL */}
      <div className="form-group">
        <label htmlFor="article-content">
          Isi Artikel
        </label>

        <textarea
          id="article-content"
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Masukkan isi artikel"
          rows="10"
        />
      </div>

      {/* GAMBAR */}
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
          Format JPG, JPEG, PNG, atau WEBP.
          Maksimal 5 MB.
        </small>

        {/* Nama file */}
        {form.image && (
          <p className="selected-file">
            File dipilih:{" "}
            <strong>
              {form.image.name}
            </strong>
          </p>
        )}
      </div>

      {/* TOMBOL */}
      <button
        type="submit"
        className="submit-button"
        disabled={loading}
      >
        {loading
          ? "Menyimpan..."
          : "Tambah Artikel"}
      </button>

    </form>
  </div>
</div>


);
}

export default AdminArtikel;
