import { useEffect, useMemo, useState } from "react";
import "./AdminPengguna.css";

const API_URL =
"http://127.0.0.1:8000/api/users";

function AdminPengguna() {
const [users, setUsers] = useState([]);

const [form, setForm] = useState({
name: "",
email: "",
password: "",
role: "user",
});

const [editingId, setEditingId] =
useState(null);

const [showForm, setShowForm] =
useState(false);

const [search, setSearch] =
useState("");

const [loading, setLoading] =
useState(false);

const [loadingData, setLoadingData] =
useState(true);

// ========================================
// GET USERS
// ========================================

useEffect(() => {
fetchUsers();
}, []);

const fetchUsers = async () => {
try {
setLoadingData(true);


  const response =
    await fetch(API_URL);

  if (!response.ok) {
    throw new Error(
      "Gagal mengambil data pengguna"
    );
  }

  const result =
    await response.json();

  setUsers(result.data || []);
} catch (error) {
  console.error(
    "Fetch users error:",
    error
  );

  alert(
    "Gagal mengambil data pengguna dari server."
  );
} finally {
  setLoadingData(false);
}

};

// ========================================
// FILTER SEARCH
// ========================================

const filteredUsers = useMemo(() => {
const keyword =
search
.toLowerCase()
.trim();

if (!keyword) {
  return users;
}

return users.filter((user) => {
  return (
    user.name
      ?.toLowerCase()
      .includes(keyword) ||
    user.email
      ?.toLowerCase()
      .includes(keyword) ||
    user.role
      ?.toLowerCase()
      .includes(keyword)
  );
});

}, [users, search]);

// ========================================
// ADD USER
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
const {
name,
value,
} = e.target;

setForm((prev) => ({
  ...prev,
  [name]: value,
}));

};

// ========================================
// RESET FORM
// ========================================

const resetForm = () => {
setForm({
name: "",
email: "",
password: "",
role: "user",
});

setEditingId(null);

};

// ========================================
// CANCEL
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
  alert(
    "Nama pengguna wajib diisi."
  );
  return;
}

if (!form.email.trim()) {
  alert(
    "Email pengguna wajib diisi."
  );
  return;
}

if (!editingId &&
    !form.password) {
  alert(
    "Password wajib diisi."
  );
  return;
}

setLoading(true);

try {
  const payload = {
    name: form.name.trim(),
    email: form.email.trim(),
    role: form.role,
  };

  // Password hanya dikirim
  // jika diisi
  if (form.password) {
    payload.password =
      form.password;
  }

  let url = API_URL;

  let method = "POST";

  if (editingId) {
    url =
      `${API_URL}/${editingId}`;

    method = "PUT";
  }

  const response =
    await fetch(url, {
      method,
      headers: {
        "Content-Type":
          "application/json",
        Accept:
          "application/json",
      },
      body: JSON.stringify(
        payload
      ),
    });

  const result =
    await response.json();

  if (!response.ok) {
    console.error(
      "Laravel response:",
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
          "Gagal menyimpan pengguna."
      );
    }

    return;
  }

  alert(
    editingId
      ? "Pengguna berhasil diperbarui!"
      : "Pengguna berhasil ditambahkan!"
  );

  resetForm();

  setShowForm(false);

  await fetchUsers();

} catch (error) {
  console.error(
    "Submit user error:",
    error
  );

  alert(
    "Tidak dapat terhubung ke server Laravel."
  );
} finally {
  setLoading(false);
}

};

// ========================================
// EDIT
// ========================================

const handleEdit = (user) => {
setEditingId(user.id);

setForm({
  name: user.name || "",
  email: user.email || "",
  password: "",
  role: user.role || "user",
});

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
"Yakin ingin menghapus pengguna ini?"
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
        headers: {
          Accept:
            "application/json",
        },
      }
    );

  const result =
    await response.json();

  if (!response.ok) {
    alert(
      result.message ||
        "Gagal menghapus pengguna."
    );

    return;
  }

  alert(
    "Pengguna berhasil dihapus!"
  );

  await fetchUsers();

} catch (error) {
  console.error(
    "Delete user error:",
    error
  );

  alert(
    "Tidak dapat terhubung ke server."
  );
}

};

// ========================================
// FORMAT DATE
// ========================================

const formatDate = (date) => {
if (!date) {
return "-";
}

return new Date(
  date
).toLocaleDateString(
  "id-ID",
  {
    day: "numeric",
    month: "long",
    year: "numeric",
  }
);

};

// ========================================
// RENDER
// ========================================

return ( <div className="admin-pengguna">

  {/* ==================================
      HEADER
  ================================== */}

  <div className="pengguna-page-header">

    <div>

      <span className="pengguna-header-label">
        Admin Panel
      </span>

      <h1>
        Kelola Pengguna
      </h1>

      <p>
        Kelola akun pengguna dan
        administrator website PT-MMA.
      </p>

    </div>

    <div className="pengguna-total-box">

      <span>
        Total Pengguna
      </span>

      <strong>
        {users.length}
      </strong>

    </div>

  </div>


  {/* ==================================
      FORM
  ================================== */}

  {showForm && (
    <div className="pengguna-form-card">

      <div className="pengguna-form-heading">

        <div>

          <h2>
            {editingId
              ? "Edit Pengguna"
              : "Tambah Pengguna"}
          </h2>

          <p>
            {editingId
              ? "Perbarui informasi akun pengguna."
              : "Buat akun pengguna baru."}
          </p>

        </div>

        {editingId && (
          <span className="pengguna-edit-badge">
            Mode Edit
          </span>
        )}

      </div>


      <form
        onSubmit={handleSubmit}
      >

        <div className="pengguna-form-grid">

          {/* NAME */}

          <div className="form-group">

            <label htmlFor="user-name">
              Nama Pengguna
              <span>*</span>
            </label>

            <input
              id="user-name"
              type="text"
              name="name"
              value={form.name}
              onChange={
                handleChange
              }
              placeholder="Masukkan nama pengguna"
              required
            />

          </div>


          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="user-email">
              Email
              <span>*</span>
            </label>

            <input
              id="user-email"
              type="email"
              name="email"
              value={form.email}
              onChange={
                handleChange
              }
              placeholder="contoh@email.com"
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="form-group">

            <label htmlFor="user-password">
              Password
              {!editingId && (
                <span>*</span>
              )}
            </label>

            <input
              id="user-password"
              type="password"
              name="password"
              value={
                form.password
              }
              onChange={
                handleChange
              }
              placeholder={
                editingId
                  ? "Kosongkan jika tidak ingin mengubah"
                  : "Minimal 6 karakter"
              }
              minLength="6"
              required={
                !editingId
              }
            />

            {editingId && (
              <small>
                Kosongkan jika
                password tidak
                ingin diubah.
              </small>
            )}

          </div>


          {/* ROLE */}

          <div className="form-group">

            <label htmlFor="user-role">
              Role
              <span>*</span>
            </label>

            <select
              id="user-role"
              name="role"
              value={form.role}
              onChange={
                handleChange
              }
              required
            >

              <option value="user">
                User
              </option>

              <option value="admin">
                Admin
              </option>

            </select>

          </div>

        </div>


        {/* ACTION */}

        <div className="pengguna-form-actions">

          <button
            type="submit"
            className="pengguna-submit-btn"
            disabled={loading}
          >
            {loading
              ? "Menyimpan..."
              : editingId
              ? "Simpan Perubahan"
              : "Tambah Pengguna"}
          </button>

          <button
            type="button"
            className="pengguna-cancel-btn"
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
      TOOLBAR
  ================================== */}

  <div className="pengguna-toolbar">

    <div>

      <h2>
        Daftar Pengguna
      </h2>

      <p>
        Kelola akun pengguna
        website.
      </p>

    </div>

    <button
      type="button"
      className="pengguna-add-btn"
      onClick={handleAdd}
    >
      <span>＋</span>
      Tambah Pengguna
    </button>

  </div>


  {/* ==================================
      SEARCH
  ================================== */}

  <div className="pengguna-search-box">

    <span>
      🔎
    </span>

    <input
      type="text"
      value={search}
      onChange={(e) =>
        setSearch(
          e.target.value
        )
      }
      placeholder="Cari nama, email, atau role..."
    />

    {search && (
      <button
        type="button"
        onClick={() =>
          setSearch("")
        }
      >
        ×
      </button>
    )}

  </div>


  {/* ==================================
      LIST
  ================================== */}

  <div className="pengguna-list-section">

    <div className="pengguna-list-header">

      <div>

        <h2>
          Pengguna
        </h2>

        <p>
          {filteredUsers.length}{" "}
          pengguna ditemukan
        </p>

      </div>

      <button
        type="button"
        className="pengguna-refresh-btn"
        onClick={
          fetchUsers
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

      <div className="pengguna-state-box">

        <div className="pengguna-loader" />

        <p>
          Memuat pengguna...
        </p>

      </div>

    ) : filteredUsers.length === 0 ? (

      <div className="pengguna-state-box">

        <div className="pengguna-empty-icon">
          👤
        </div>

        <h3>
          {search
            ? "Pengguna tidak ditemukan"
            : "Belum ada pengguna"}
        </h3>

        <p>
          {search
            ? "Coba gunakan kata kunci pencarian lain."
            : "Klik Tambah Pengguna untuk membuat akun baru."}
        </p>

      </div>

    ) : (

      <div className="pengguna-table-wrapper">

        <table className="pengguna-table">

          <thead>

            <tr>

              <th>
                Pengguna
              </th>

              <th>
                Email
              </th>

              <th>
                Role
              </th>

              <th>
                Dibuat
              </th>

              <th>
                Aksi
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredUsers.map(
              (user) => (

                <tr
                  key={user.id}
                >

                  {/* USER */}

                  <td>

                    <div className="user-info">

                      <div className="user-avatar">

                        {user.name
                          ?.charAt(
                            0
                          )
                          .toUpperCase()}

                      </div>

                      <div>

                        <strong>
                          {
                            user.name
                          }
                        </strong>

                        <small>
                          ID:{" "}
                          {
                            user.id
                          }
                        </small>

                      </div>

                    </div>

                  </td>


                  {/* EMAIL */}

                  <td>

                    <span className="user-email">
                      {
                        user.email
                      }
                    </span>

                  </td>


                  {/* ROLE */}

                  <td>

                    <span
                      className={
                        user.role ===
                        "admin"
                          ? "role-badge role-admin"
                          : "role-badge role-user"
                      }
                    >
                      {user.role ===
                      "admin"
                        ? "Admin"
                        : "User"}
                    </span>

                  </td>


                  {/* DATE */}

                  <td>

                    <span className="user-date">
                      {
                        formatDate(
                          user.created_at
                        )
                      }
                    </span>

                  </td>


                  {/* ACTION */}

                  <td>

                    <div className="user-actions">

                      <button
                        type="button"
                        className="user-edit-btn"
                        onClick={() =>
                          handleEdit(
                            user
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="user-delete-btn"
                        onClick={() =>
                          handleDelete(
                            user.id
                          )
                        }
                      >
                        Hapus
                      </button>

                    </div>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    )}

  </div>

</div>


);
}

export default AdminPengguna ;
