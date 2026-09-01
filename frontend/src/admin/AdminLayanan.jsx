import { useEffect, useState } from "react";
import "./AdminLayanan.css";

const API_URL = "http://127.0.0.1:8000/api/services";
const IMAGE_URL = "http://127.0.0.1:8000/storage/";

function AdminLayanan() {
const [services, setServices] = useState([]);

const [form, setForm] = useState({
name: "",
category: "",
description: "",
content: "",
image: null,
});

const [editingId, setEditingId] = useState(null);
const [oldImage, setOldImage] = useState(null);
const [previewImage, setPreviewImage] = useState(null);

const [showForm, setShowForm] = useState(false);

const [loading, setLoading] = useState(false);
const [loadingData, setLoadingData] = useState(true);

// ========================================
// GET SERVICES
// ========================================

useEffect(() => {
fetchServices();
}, []);

const fetchServices = async () => {
try {
setLoadingData(true);

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Gagal mengambil data layanan");
  }

  const result = await response.json();

  setServices(result.data || []);
} catch (error) {
  console.error("Fetch layanan error:", error);

  alert(
    "Gagal mengambil data layanan dari server."
  );
} finally {
  setLoadingData(false);
}


};

// ========================================
// TAMBAH LAYANAN
// ========================================

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

// ========================================
// HANDLE INPUT
// ========================================

const handleChange = (e) => {
const { name, value, files } = e.target;


// IMAGE
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
    setPreviewImage(
      URL.createObjectURL(file)
    );
  } else {
    setPreviewImage(null);
  }

  return;
}

// TEXT
setForm((prev) => ({
  ...prev,
  [name]: value,
}));

};

// ========================================
// RESET FORM
// ========================================

const resetForm = () => {
if (previewImage) {
URL.revokeObjectURL(previewImage);
}

setForm({
  name: "",
  category: "",
  description: "",
  content: "",
  image: null,
});

setEditingId(null);
setOldImage(null);
setPreviewImage(null);

const fileInput =
  document.getElementById(
    "service-image"
  );

if (fileInput) {
  fileInput.value = ""
}

};

// ========================================
// BATAL
// ========================================

const handleCancel = () => {
resetForm();

setShowForm(false);

};

// ========================================
// SUBMIT
// ========================================

const handleSubmit = async (e) => {
e.preventDefault();

if (!form.name.trim()) {
  alert("Nama layanan wajib diisi.");
  return;
}

setLoading(true);

try {
  const formData = new FormData();

  formData.append(
    "name",
    form.name.trim()
  );

  formData.append(
    "category",
    form.category.trim()
  );

  formData.append(
    "description",
    form.description.trim()
  );

  formData.append(
    "content",
    form.content.trim()
  );

  if (form.image) {
    formData.append(
      "image",
      form.image
    );
  }

  let url = API_URL;

  // EDIT
  if (editingId) {
    url = `${API_URL}/${editingId}`;

    formData.append(
      "_method",
      "PUT"
    );
  }

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const result =
    await response.json();

  // ERROR
  if (!response.ok) {
    console.error(
      "Response Laravel:",
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
          "Gagal menyimpan layanan."
      );
    }

    return;
  }

  // SUCCESS
  alert(
    editingId
      ? "Layanan berhasil diperbarui!"
      : "Layanan berhasil ditambahkan!"
  );

  resetForm();

  setShowForm(false);

  await fetchServices();
} catch (error) {
  console.error(
    "Submit layanan error:",
    error
  );

  alert(
    "Tidak dapat terhubung ke server Laravel.\n\nPastikan php artisan serve sedang berjalan."
  );
} finally {
  setLoading(false);
}


};

// ========================================
// EDIT
// ========================================

const handleEdit = (service) => {
setEditingId(service.id);

setForm({
  name: service.name || "",
  category: service.category || "",
  description:
    service.description || "",
  content: service.content || "",
  image: null,
});

setOldImage(
  service.image || null
);

if (previewImage) {
  URL.revokeObjectURL(
    previewImage
  );
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

// ========================================
// DELETE
// ========================================

const handleDelete = async (id) => {
const confirmation =
window.confirm(
"Yakin ingin menghapus layanan ini?"
);

if (!confirmation) {
  return;
}

try {
  const response =
    await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE",
      }
    );

  const result =
    await response.json();

  if (!response.ok) {
    alert(
      result.message ||
        "Gagal menghapus layanan."
    );

    return;
  }

  alert(
    "Layanan berhasil dihapus!"
  );

  if (editingId === id) {
    handleCancel();
  }

  await fetchServices();
} catch (error) {
  console.error(
    "Delete layanan error:",
    error
  );

  alert(
    "Tidak dapat terhubung ke server."
  );
}

};

// ========================================
// IMAGE URL
// ========================================

const getImageUrl = (image) => {
if (!image) {
return null;
}

return `${IMAGE_URL}${image}`;

};

// ========================================
// RENDER
// ========================================

return ( <div className="admin-layanan">

  {/* ==================================
      HEADER
  ================================== */}

  <div className="layanan-page-header">

    <div>

      <span className="layanan-header-label">
        Admin Panel
      </span>

      <h1>
        Kelola Layanan
      </h1>

      <p>
        Kelola layanan yang tersedia
        untuk website PT-MMA.
      </p>

    </div>

    <div className="layanan-total-box">

      <span>
        Total Layanan
      </span>

      <strong>
        {services.length}
      </strong>

    </div>

  </div>


  {/* ==================================
      TOOLBAR
  ================================== */}

  {!showForm && (
    <div className="layanan-toolbar">

      <div>

        <h2>
          Layanan
        </h2>

        <p>
          Daftar layanan yang
          tersedia di website.
        </p>

      </div>

      <button
        type="button"
        className="layanan-add-btn"
        onClick={handleAdd}
      >
        <span>＋</span>
        Tambah Layanan
      </button>

    </div>
  )}


  {/* ==================================
      FORM
  ================================== */}

  {showForm && (
    <div className="layanan-form-card">

      <div className="layanan-form-heading">

        <div>

          <h2>
            {editingId
              ? "Edit Layanan"
              : "Tambah Layanan"}
          </h2>

          <p>
            {editingId
              ? "Perbarui informasi layanan."
              : "Isi data layanan baru."}
          </p>

        </div>

        {editingId && (
          <span className="layanan-edit-badge">
            Mode Edit
          </span>
        )}

      </div>


      <form
        onSubmit={handleSubmit}
      >

        <div className="layanan-form-grid">

          {/* ==================================
              LEFT
          ================================== */}

          <div className="layanan-form-left">

            {/* NAME */}

            <div className="form-group">

              <label htmlFor="service-name">
                Nama Layanan
                <span className="required">
                  *
                </span>
              </label>

              <input
                id="service-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Masukkan nama layanan"
                required
              />

            </div>


            {/* CATEGORY */}

            <div className="form-group">

              <label htmlFor="service-category">
                Kategori
              </label>

              <input
                id="service-category"
                type="text"
                name="category"
                value={
                  form.category
                }
                onChange={
                  handleChange
                }
                placeholder="Contoh: Pengadaan"
              />

            </div>


            {/* DESCRIPTION */}

            <div className="form-group">

              <label htmlFor="service-description">
                Deskripsi
              </label>

              <textarea
                id="service-description"
                name="description"
                value={
                  form.description
                }
                onChange={
                  handleChange
                }
                placeholder="Tuliskan deskripsi singkat layanan..."
                rows="5"
              />

            </div>


            {/* CONTENT */}

            <div className="form-group">

              <label htmlFor="service-content">
                Detail Layanan
              </label>

              <textarea
                id="service-content"
                name="content"
                value={
                  form.content
                }
                onChange={
                  handleChange
                }
                placeholder="Tuliskan detail layanan..."
                rows="12"
              />

            </div>

          </div>


          {/* ==================================
              RIGHT
          ================================== */}

          <div className="layanan-form-right">

            <div className="form-group">

              <label htmlFor="service-image">
                Gambar Layanan
              </label>

              <input
                id="service-image"
                type="file"
                name="image"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={
                  handleChange
                }
              />

              <small>
                JPG, JPEG, PNG,
                WEBP. Maksimal
                5 MB.
              </small>

            </div>


            {/* PREVIEW */}

            <div className="image-preview-box">

              {previewImage ? (

                <img
                  src={
                    previewImage
                  }
                  alt="Preview layanan"
                />

              ) : editingId &&
                oldImage ? (

                <img
                  src={
                    getImageUrl(
                      oldImage
                    )
                  }
                  alt="Gambar layanan"
                />

              ) : (

                <div className="image-placeholder">

                  <span>
                    🖼️
                  </span>

                  <p>
                    Preview gambar
                  </p>

                </div>

              )}

            </div>


            {/* OLD IMAGE */}

            {editingId &&
              oldImage &&
              !previewImage && (

                <p className="old-image-info">
                  Pilih gambar baru
                  jika ingin
                  mengganti gambar
                  lama.
                </p>

              )}


            {/* FILE */}

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


        {/* ==================================
            BUTTON
        ================================== */}

        <div className="layanan-form-actions">

          <button
            type="submit"
            className="layanan-submit-btn"
            disabled={loading}
          >

            {loading
              ? "Menyimpan..."
              : editingId
              ? "Simpan Perubahan"
              : "Tambah Layanan"}

          </button>


          <button
            type="button"
            className="layanan-cancel-btn"
            onClick={
              handleCancel
            }
            disabled={loading}
          >
            Batal
          </button>

        </div>

      </form>

    </div>
  )}


  {/* ==================================
      LIST
  ================================== */}

  <div className="layanan-list-section">

    <div className="layanan-list-header">

      <div>

        <h2>
          Daftar Layanan
        </h2>

        <p>
          {services.length} layanan
          tersedia
        </p>

      </div>


      <button
        type="button"
        className="layanan-refresh-btn"
        onClick={
          fetchServices
        }
        disabled={
          loadingData
        }
      >

        {loadingData
          ? "Memuat..."
          : "↻ Refresh"}

      </button>

    </div>


    {/* LOADING */}

    {loadingData ? (

      <div className="layanan-state-box">

        <div className="layanan-loader" />

        <p>
          Memuat layanan...
        </p>

      </div>

    ) : services.length === 0 ? (

      /* EMPTY */

      <div className="layanan-state-box">

        <div className="layanan-empty-icon">
          🛠️
        </div>

        <h3>
          Belum ada layanan
        </h3>

        <p>
          Klik tombol Tambah
          Layanan untuk
          membuat layanan
          baru.
        </p>

      </div>

    ) : (

      /* SERVICES */

      <div className="layanan-grid">

        {services.map(
          (service) => (

            <div
              className="layanan-card"
              key={service.id}
            >

              {/* IMAGE */}

              <div className="layanan-card-image-wrap">

                {service.image ? (

                  <img
                    src={
                      getImageUrl(
                        service.image
                      )
                    }
                    alt={
                      service.name
                    }
                    className="layanan-card-image"
                    onError={(
                      e
                    ) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                ) : (

                  <div className="layanan-no-image">

                    <span>
                      🖼️
                    </span>

                    <p>
                      Tidak ada
                      gambar
                    </p>

                  </div>

                )}


                {service.category && (

                  <span className="layanan-card-category">

                    {
                      service.category
                    }

                  </span>

                )}

              </div>


              {/* CONTENT */}

              <div className="layanan-card-body">

                <h3>
                  {
                    service.name
                  }
                </h3>


                <p className="layanan-card-description">

                  {
                    service.description ||
                    "Tidak ada deskripsi layanan."
                  }

                </p>


                {service.created_at && (

                  <p className="layanan-card-date">

                    {new Date(
                      service.created_at
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

                <div className="layanan-card-actions">

                  <button
                    type="button"
                    className="layanan-edit-btn"
                    onClick={() =>
                      handleEdit(
                        service
                      )
                    }
                  >
                    Edit
                  </button>


                  <button
                    type="button"
                    className="layanan-delete-btn"
                    onClick={() =>
                      handleDelete(
                        service.id
                      )
                    }
                  >
                    Hapus
                  </button>

                </div>

              </div>

            </div>

          )
        )}

      </div>

    )}

  </div>

</div>

);
}

export default AdminLayanan;
