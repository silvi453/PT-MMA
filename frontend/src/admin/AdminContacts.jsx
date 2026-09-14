import { useEffect, useState } from "react";
import "./AdminContacts.css";

const API_URL = "http://127.0.0.1:8000/api";

function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);

  // ==============================
  // STATE BALASAN
  // ==============================
  const [replyMessage, setReplyMessage] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [replySuccess, setReplySuccess] = useState("");
  const [showReply, setShowReply] = useState(false);

  // ==============================
  // TOKEN
  // ==============================
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==============================
  // FETCH CONTACTS
  // ==============================
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

  useEffect(() => {
    fetchContacts();
  }, []);

  // ==============================
  // MARK AS READ
  // ==============================
  const markAsRead = async (id) => {
    const token = getToken();

    try {
      const response = await fetch(`${API_URL}/contacts/${id}/read`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal menandai pesan");
      }

      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === id
            ? {
                ...contact,
                is_read: true,
              }
            : contact
        )
      );

      setSelectedContact((prev) =>
        prev && prev.id === id
          ? {
              ...prev,
              is_read: true,
            }
          : prev
      );
    } catch (error) {
      console.error("Gagal menandai pesan:", error);
    }
  };

  // ==============================
  // OPEN MESSAGE
  // ==============================
  const handleOpenMessage = (contact) => {
    setSelectedContact(contact);

    setReplyMessage("");
    setReplyError("");
    setReplySuccess("");
    setShowReply(false);

    if (!contact.is_read) {
      markAsRead(contact.id);
    }
  };

  // ==============================
  // OPEN REPLY
  // ==============================
  const handleOpenReply = () => {
    setShowReply(true);
    setReplyError("");
    setReplySuccess("");
  };

  // ==============================
  // CLOSE REPLY
  // ==============================
  const handleCloseReply = () => {
    setShowReply(false);
    setReplyMessage("");
    setReplyError("");
    setReplySuccess("");
  };

  // ==============================
  // SEND REPLY
  // ==============================
  const handleReply = async () => {
    if (!selectedContact) return;

    if (!replyMessage.trim()) {
      setReplyError("Pesan balasan wajib diisi.");
      setReplySuccess("");
      return;
    }

    const token = getToken();

    if (!token) {
      setReplyError("Sesi login tidak ditemukan.");
      setReplySuccess("");
      return;
    }

    setReplying(true);
    setReplyError("");
    setReplySuccess("");

    try {
      const response = await fetch(
        `${API_URL}/contacts/${selectedContact.id}/reply`,
        {
          method: "POST",

          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            reply: replyMessage.trim(),
          }),
        }
      );

      // ==============================
      // AMBIL RESPONSE BACKEND
      // ==============================
      let result = {};

      try {
        result = await response.json();
      } catch (jsonError) {
        console.error(
          "Response backend bukan JSON:",
          jsonError
        );
      }

      console.log("STATUS RESPONSE:", response.status);
      console.log("RESPONSE BACKEND:", result);

      // ==============================
      // ERROR RESPONSE
      // ==============================
      if (!response.ok) {
        const backendError =
          result.error ||
          result.message ||
          result.errors?.reply?.[0] ||
          `Server mengembalikan error ${response.status}.`;

        throw new Error(backendError);
      }

      // ==============================
      // DATA CONTACT TERBARU
      // ==============================
      const updatedContact = result.data;

      if (!updatedContact) {
        throw new Error(
          "Balasan berhasil diproses, tetapi data pesan tidak ditemukan."
        );
      }

      // ==============================
      // UPDATE LIST
      // ==============================
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === selectedContact.id
            ? updatedContact
            : contact
        )
      );

      // ==============================
      // UPDATE DETAIL
      // ==============================
      setSelectedContact(updatedContact);

      // ==============================
      // RESET INPUT
      // ==============================
      setReplyMessage("");

      setReplySuccess(
        result.message ||
          "Balasan berhasil dikirim dan disimpan."
      );
    } catch (error) {
      console.error(
        "Gagal mengirim balasan:",
        error
      );

      setReplyError(
        error.message ||
          "Gagal mengirim balasan."
      );

      setReplySuccess("");
    } finally {
      setReplying(false);
    }
  };

  // ==============================
  // DELETE CONTACT
  // ==============================
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
        prev.filter(
          (contact) => contact.id !== id
        )
      );

      setSelectedContact(null);

      setReplyMessage("");
      setReplyError("");
      setReplySuccess("");
      setShowReply(false);
    } catch (error) {
      console.error(
        "Gagal menghapus pesan:",
        error
      );
    }
  };

  // ==============================
  // COUNT
  // ==============================
  const unreadCount = contacts.filter(
    (contact) => !contact.is_read
  ).length;

  const readCount = contacts.filter(
    (contact) => contact.is_read
  ).length;

  // ==============================
  // FORMAT DATE
  // ==============================
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      "id-ID",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  return (
    <div className="admin-contacts-page">

      {/* =========================
          HEADER
      ========================== */}
      <div className="admin-contacts-header">

        <div>
          <span className="admin-contacts-label">
            ADMIN PANEL
          </span>

          <h1>
            Pesan Kontak
          </h1>

          <p>
            Kelola pesan dan pertanyaan yang
            dikirim oleh pengunjung website.
          </p>
        </div>

        <button
          className="refresh-contact-btn"
          onClick={fetchContacts}
        >
          ↻ Refresh
        </button>

      </div>

      {/* =========================
          SUMMARY
      ========================== */}
      <div className="contact-summary">

        <div className="contact-summary-card">

          <div className="summary-icon">
            ✉
          </div>

          <div>
            <span>
              Total Pesan
            </span>

            <strong>
              {contacts.length}
            </strong>
          </div>

        </div>

        <div className="contact-summary-card unread">

          <div className="summary-icon">
            ●
          </div>

          <div>
            <span>
              Belum Dibaca
            </span>

            <strong>
              {unreadCount}
            </strong>
          </div>

        </div>

        <div className="contact-summary-card">

          <div className="summary-icon">
            ✓
          </div>

          <div>
            <span>
              Sudah Dibaca
            </span>

            <strong>
              {readCount}
            </strong>
          </div>

        </div>

      </div>

      {/* =========================
          CONTENT
      ========================== */}
      <div className="contacts-content">

        {/* =======================
            LIST
        ======================== */}
        <div className="contacts-list">

          <div className="contacts-list-header">

            <div>
              <h2>
                Daftar Pesan
              </h2>

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
                Pesan dari pengunjung akan
                muncul di sini.
              </p>

            </div>

          ) : (

            /* ITEMS */
            <div className="contact-items">

              {contacts.map((contact) => (

                <div
                  key={contact.id}
                  className={`contact-item ${
                    !contact.is_read
                      ? "unread"
                      : ""
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

                      {contact.reply && (
                        <span className="replied-badge">
                          Dibalas
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

                  <div className="contact-arrow">
                    →
                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* =======================
            DETAIL
        ======================== */}
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
                Pilih salah satu pesan di sebelah
                kiri untuk melihat detailnya.
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
                  onClick={() => {
                    setSelectedContact(null);
                    setShowReply(false);
                    setReplyMessage("");
                    setReplyError("");
                    setReplySuccess("");
                  }}
                >
                  ×
                </button>

              </div>

              {/* SENDER */}
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
                      📞{" "}
                      {selectedContact.phone}
                    </span>
                  )}

                </div>

              </div>

              {/* PESAN PENGUNJUNG */}
              <div className="message-body">

                <span>
                  ISI PESAN
                </span>

                <p>
                  {selectedContact.message ||
                    "Tidak ada isi pesan."}
                </p>

              </div>

              {/* =====================
                  BALASAN TERSIMPAN
              ====================== */}
              {selectedContact.reply && (

                <div className="saved-reply-section">

                  <div className="saved-reply-header">

                    <span>
                      BALASAN ADMIN
                    </span>

                    {selectedContact.replied_at && (
                      <small>
                        {formatDate(
                          selectedContact.replied_at
                        )}
                      </small>
                    )}

                  </div>

                  <div className="saved-reply-body">

                    <p>
                      {selectedContact.reply}
                    </p>

                  </div>

                </div>

              )}

              {/* =====================
                  FORM BALAS
              ====================== */}
              {showReply && (

                <div className="reply-section">

                  <div className="reply-header">

                    <span>
                      BALAS PESAN
                    </span>

                    <small>
                      Kepada:{" "}
                      {selectedContact.email}
                    </small>

                  </div>

                  <textarea
                    value={replyMessage}
                    onChange={(e) =>
                      setReplyMessage(
                        e.target.value
                      )
                    }
                    placeholder="Tulis balasan untuk pengunjung..."
                    rows="6"
                    disabled={replying}
                  />

                  {/* ERROR */}
                  {replyError && (
                    <div className="reply-error">
                      ⚠ {replyError}
                    </div>
                  )}

                  {/* SUCCESS */}
                  {replySuccess && (
                    <div className="reply-success">
                      ✓ {replySuccess}
                    </div>
                  )}

                  <div className="reply-form-actions">

                    <button
                      className="reply-cancel-btn"
                      onClick={
                        handleCloseReply
                      }
                      disabled={replying}
                    >
                      Batal
                    </button>

                    <button
                      className="reply-send-btn"
                      onClick={handleReply}
                      disabled={replying}
                    >
                      {replying
                        ? "Mengirim..."
                        : "📧 Kirim Balasan"}
                    </button>

                  </div>

                </div>

              )}

              {/* =====================
                  WAKTU PESAN
              ====================== */}
              {selectedContact.created_at && (

                <div className="message-date">

                  <span>
                    Dikirim pada
                  </span>

                  <strong>
                    {formatDate(
                      selectedContact.created_at
                    )}
                  </strong>

                </div>

              )}

              {/* =====================
                  ACTION BUTTON
              ====================== */}
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

                {!showReply && (

                  <button
                    className="reply-btn"
                    onClick={handleOpenReply}
                  >
                    ↩ Balas
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
