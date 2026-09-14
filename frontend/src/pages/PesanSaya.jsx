import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://192.168.1.17:8000/api";

function PesanSaya() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token =
    localStorage.getItem("token");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/my-contacts`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Gagal mengambil pesan."
        );
      }

      setMessages(
        result.data || []
      );

    } catch (error) {
      console.error(
        "Gagal mengambil pesan:",
        error
      );

      setError(
        error.message ||
          "Terjadi kesalahan."
      );

    } finally {
      setLoading(false);
    }
  };


  const markAsRead = async (contactId) => {
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/my-contacts/${contactId}/reply-read`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Gagal menandai balasan."
        );
      }

      setMessages((prev) =>
        prev.map((item) =>
          item.id === contactId
            ? {
                ...item,
                reply_read_at:
                  new Date().toISOString(),
              }
            : item
        )
      );

    } catch (error) {
      console.error(
        "Gagal menandai balasan:",
        error
      );
    }
  };


  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(
      date
    ).toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  if (!token) {
    return (
      <section className="page-section">

        <div className="container">

          <div className="message-empty">

            <div className="message-empty-icon">
              🔐
            </div>

            <h3>
              Login Terlebih Dahulu
            </h3>

            <p>
              Silakan login untuk melihat
              pesan dan balasan dari admin.
            </p>

            <Link
              to="/login"
              className="btn btn-primary"
            >
              Login
            </Link>

          </div>

        </div>

      </section>
    );
  }


  if (loading) {
    return (
      <section className="page-section">

        <div className="container">

          <div className="message-empty">

            <p>
              Memuat pesan...
            </p>

          </div>

        </div>

      </section>
    );
  }


  if (error) {
    return (
      <section className="page-section">

        <div className="container">

          <div className="message-error">
            {error}
          </div>

        </div>

      </section>
    );
  }


  return (
    <section className="page-section">

      <div className="container">

        <div className="message-page">

          <div className="message-header">

            <div>
              <h2>
                Pesan Saya
              </h2>

              <p>
                Lihat pesan yang pernah kamu
                kirim dan balasan dari admin.
              </p>
            </div>

            <button
              className="message-refresh"
              onClick={fetchMessages}
            >
              ↻ Refresh
            </button>

          </div>


          {messages.length === 0 ? (

            <div className="message-empty">

              <div className="message-empty-icon">
                ✉
              </div>

              <h3>
                Belum Ada Pesan
              </h3>

              <p>
                Kamu belum pernah mengirim
                pesan kepada kami.
              </p>

            </div>

          ) : (

            <div className="message-list">

              {messages.map((item) => (

                <div
                  className="message-card"
                  key={item.id}
                >

                  {/* PESAN USER */}

                  <div className="message-user">

                    <div className="message-card-title">

                      <span>
                        Pesan Anda
                      </span>

                      <small>
                        {formatDate(
                          item.created_at
                        )}
                      </small>

                    </div>

                    <p>
                      {item.message}
                    </p>

                  </div>


                  {/* BALASAN ADMIN */}

                  {item.reply ? (

                    <div
                      className={
                        `message-reply ${
                          !item.reply_read_at
                            ? "unread"
                            : ""
                        }`
                      }
                    >

                      <div className="message-card-title">

                        <span>
                          Balasan Admin
                        </span>

                        <small>
                          {formatDate(
                            item.replied_at
                          )}
                        </small>

                      </div>

                      <p>
                        {item.reply}
                      </p>


                      {!item.reply_read_at && (

                        <button
                          className="message-read-button"
                          onClick={() =>
                            markAsRead(
                              item.id
                            )
                          }
                        >
                          ✓ Tandai Sudah Dibaca
                        </button>

                      )}


                      {item.reply_read_at && (

                        <div className="message-read">
                          ✓ Sudah dibaca
                        </div>

                      )}

                    </div>

                  ) : (

                    <div className="message-waiting">

                      <span>
                        ⏳
                      </span>

                      <div>

                        <strong>
                          Menunggu balasan admin
                        </strong>

                        <p>
                          Pesan kamu sudah
                          diterima dan sedang
                          diproses.
                        </p>

                      </div>

                    </div>

                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </section>
  );
}

export default PesanSaya;