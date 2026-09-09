import { useEffect, useState } from "react";
import "./AdminContacts.css";

const API_URL = "http://127.0.0.1:8000/api";

function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================================================
  // AMBIL SEMUA PESAN
  // =========================================================

  const fetchContacts = async () => {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/contacts`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil pesan kontak");
      }

      const result = await response.json();

      const data = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
        ? result.data
        : [];

      setContacts(data);
    } catch (error) {
      console.error("Gagal mengambil pesan kontak:", error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD SAAT HALAMAN DIBUKA
  // =========================================================

  useEffect(() => {
    fetchContacts();
  }, []);

  // =========================================================
  // TANDAI SUDAH DIBACA
  // =========================================================

  const markAsRead = async (id) => {
    const token = getToken();

    try {
      const response = await fetch(
        `${API_URL}/contacts/${id}/read`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal menandai pesan");
      }

      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === id
            ? { ...contact, is_read: true }
            : contact
        )
      );

      setSelectedContact((prev) =>
        prev && prev.id === id
          ? { ...prev, is_read: true }
          : prev
      );
    } catch (error) {
      console.error("Gagal menandai pesan:", error);
    }
  };

  // =========================================================
  // BUKA PESAN
  // =========================================================

  const handleOpenMessage = (contact) => {
    setSelectedContact(contact);

    if (!contact.is_read) {
      markAsRead(contact.id);
    }
  };

  // =========================================================
  // HAPUS PESAN
  // =========================================================

  const deleteContact = async (id) => {
    const yakin = window.confirm(
      "Yakin ingin menghapus pesan ini?"
    );

    if (!yakin) return;

    const token = getToken();

    try {
      const response = await fetch(
        `${API_URL}/contacts/${id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal menghapus pesan");
      }

      setContacts((prev) =>
        prev.filter((contact) => contact.id !== id)
      );

      setSelectedContact(null);
    } catch (error) {
      console.error("Gagal menghapus pesan:", error);
    }
  };

  // =========================================================
  // STATISTIK
  // =========================================================

  const unreadCount = contacts.filter(
    (contact) => !contact.is_read
  ).length;

  const readCount = contacts.filter(
    (contact) => contact.is_read
  ).length;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="admin-contacts-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="admin-contacts-header">

        <div>
          <span className="admin-contacts-label">
            ADMIN PANEL
          </span>

          <h1>Pesan Kontak</h1>

          <p>
            Kelola pesan dan pertanyaan yang dikirim
            oleh pengunjung website.
          </p>
        </div>

        <button
          className="refresh-contact-btn"
          onClick={fetchContacts}
        >
          ↻ Refresh
        </button>

      </div>


      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="contact-summary">

        <div className="contact-summary-card">

          <div className="summary-icon">
            ✉
          </div>

          <div>
            <span>Total Pesan</span>
            <strong>{contacts.length}</strong>
          </div>

        </div>


        <div className="contact-summary-card unread">

          <div className="summary-icon">
            ●
          </div>

          <div>
            <span>Belum Dibaca</span>
            <strong>{unreadCount}</strong>
          </div>

        </div>


        <div className="contact-summary-card">

          <div className="summary-icon">
            ✓
          </div>

          <div>
            <span>Sudah Dibaca</span>
            <strong>{readCount}</strong>
          </div>

        </div>

      </div>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="contacts-content">

        {/* ===================================================
            LIST PESAN
        =================================================== */}

        <div className="contacts-list">

          <div className="contacts-list-header">

            <div>
              <h2>Daftar Pesan</h2>

              <p>
                Pesan terbaru dari pengunjung
              </p>
            </div>

            <span>
              {contacts.length} pesan
            </span>

          </div>


          {/* LOADING */}

          {loading ? (

            <div className="contact-empty">

              <div className="contact-loading">
                <div className="loading-spinner"></div>

                <p>
                  Memuat pesan...
                </p>
              </div>

            </div>

          ) : contacts.length === 0 ? (

            /* EMPTY */

            <div className="contact-empty">

              <div className="empty-icon">
                ✉
              </div>

              <h3>
                Belum Ada Pesan
              </h3>

              <p>
                Pesan dari pengunjung akan muncul
                di sini.
              </p>

            </div>

          ) : (

            /* LIST */

            <div className="contact-items">

              {contacts.map((contact) => (

                <div
                  key={contact.id}
                  className={`contact-item ${
                    !contact.is_read ? "unread" : ""
                  }`}
                  onClick={() =>
                    handleOpenMessage(contact)
                  }
                >

                  {/* AVATAR */}

                  <div className="contact-avatar">

                    {(contact.name || "P")
                      .charAt(0)
                      .toUpperCase()}

                  </div>


                  {/* CONTENT */}

                  <div className="contact-item-content">

                    <div className="contact-item-top">

                      <strong>
                        {contact.name ||
                          "Tanpa Nama"}
                      </strong>

                      {!contact.is_read && (
                        <span className="unread-badge">
                          Baru
                        </span>
                      )}

                    </div>


                    <span className="contact-email">
                      {contact.email || "-"}
                    </span>


                    <p>
                      {contact.message ||
                        "Tidak ada pesan."}
                    </p>

                  </div>


                  {/* ARROW */}

                  <div className="contact-arrow">
                    →
                  </div>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* ===================================================
            DETAIL PESAN
        =================================================== */}

        <div className="contact-detail">

          {!selectedContact ? (

            <div className="contact-detail-empty">

              <div className="detail-empty-icon">
                ✉
              </div>

              <h3>
                Pilih Pesan
              </h3>

              <p>
                Pilih salah satu pesan di sebelah kiri
                untuk melihat detailnya.
              </p>

            </div>

          ) : (

            <>

              {/* DETAIL HEADER */}

              <div className="detail-header">

                <div>

                  <span>
                    PESAN MASUK
                  </span>

                  <h2>
                    Pesan dari{" "}
                    {selectedContact.name ||
                      "Pengunjung"}
                  </h2>

                </div>

                <button
                  className="close-detail"
                  onClick={() =>
                    setSelectedContact(null)
                  }
                >
                  ×
                </button>

              </div>


              {/* PENGIRIM */}

              <div className="sender-info">

                <div className="sender-avatar">

                  {(selectedContact.name || "P")
                    .charAt(0)
                    .toUpperCase()}

                </div>


                <div>

                  <strong>
                    {selectedContact.name ||
                      "Tanpa Nama"}
                  </strong>

                  <span>
                    {selectedContact.email || "-"}
                  </span>

                  {selectedContact.phone && (
                    <span>
                      📞 {selectedContact.phone}
                    </span>
                  )}

                </div>

              </div>


              {/* ISI PESAN */}

              <div className="message-body">

                <span>
                  ISI PESAN
                </span>

                <p>
                  {selectedContact.message ||
                    "Tidak ada isi pesan."}
                </p>

              </div>


              {/* WAKTU */}

              {selectedContact.created_at && (

                <div className="message-date">

                  <span>
                    Dikirim pada
                  </span>

                  <strong>
                    {new Date(
                      selectedContact.created_at
                    ).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </strong>

                </div>

              )}


              {/* ACTION */}

              <div className="detail-actions">

                {!selectedContact.is_read && (

                  <button
                    className="read-btn"
                    onClick={() =>
                      markAsRead(
                        selectedContact.id
                      )
                    }
                  >
                    ✓ Tandai Sudah Dibaca
                  </button>

                )}

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteContact(
                      selectedContact.id
                    )
                  }
                >
                  🗑 Hapus Pesan
                </button>

              </div>

            </>

          )}

        </div>

      </div>

    </div>
  );
}

export default AdminContacts;