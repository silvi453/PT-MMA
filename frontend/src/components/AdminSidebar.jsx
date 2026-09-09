import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../admin/Admin.css";

const API_URL = "http://127.0.0.1:8000";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadContacts, setUnreadContacts] = useState(0);

  /*
  |--------------------------------------------------------------------------
  | CEK PESAN BELUM DIBACA
  |--------------------------------------------------------------------------
  */

  const fetchUnreadContacts = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/contacts/unread-count`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return;
      }

      const result = await response.json();

      setUnreadContacts(result.count || 0);

    } catch (error) {
      console.error(
        "Gagal mengambil notifikasi kontak:",
        error
      );
    }
  };


  /*
  |--------------------------------------------------------------------------
  | CEK NOTIFIKASI SAAT SIDEBAR DIBUKA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchUnreadContacts();

    // Cek setiap 10 detik
    const interval = setInterval(() => {
      fetchUnreadContacts();
    }, 10000);

    return () => clearInterval(interval);
  }, []);


  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/admin", {
      replace: true,
    });
  };


  /*
  |--------------------------------------------------------------------------
  | CEK HALAMAN AKTIF
  |--------------------------------------------------------------------------
  */

  const isActive = (path) => {
    return location.pathname === path
      ? "admin-menu-active"
      : "";
  };


  return (
    <aside className="admin-sidebar">

      {/* =====================================================
          LOGO ADMIN
      ===================================================== */}

      <div className="admin-sidebar-logo">

        <div className="admin-logo-small">
          ✚
        </div>

        <div>
          <strong>PT MMA</strong>

          <span>
            Admin Panel
          </span>
        </div>

      </div>


      {/* =====================================================
          MENU NAVIGASI
      ===================================================== */}

      <nav className="admin-menu">

        {/* DASHBOARD */}

        <button
          className={isActive("/admin/dashboard")}
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          🏠 Dashboard
        </button>


        {/* PRODUK */}

        <button
          className={isActive("/admin/products")}
          onClick={() =>
            navigate("/admin/products")
          }
        >
          📦 Produk
        </button>


        {/* ARTIKEL */}

        <button
          className={isActive("/admin/articles")}
          onClick={() =>
            navigate("/admin/articles")
          }
        >
          📰 Artikel
        </button>


        {/* LAYANAN */}

        <button
          className={isActive("/admin/services")}
          onClick={() =>
            navigate("/admin/services")
          }
        >
          🛠️ Layanan
        </button>


        {/* PENGGUNA */}

        <button
          className={isActive("/admin/users")}
          onClick={() =>
            navigate("/admin/users")
          }
        >
          👥 Pengguna
        </button>


        {/* =================================================
            PESAN KONTAK
        ================================================= */}

        <button
          className={isActive("/admin/contacts")}
          onClick={() =>
            navigate("/admin/contacts")
          }
        >
          <span>
            ✉️ Pesan Kontak
          </span>

          {unreadContacts > 0 && (
            <span className="admin-sidebar-badge">
              {unreadContacts}
            </span>
          )}
        </button>

      </nav>


      {/* =====================================================
          LOGOUT
      ===================================================== */}

      <button
        className="admin-logout"
        onClick={handleLogout}
      >
        ↪ Logout
      </button>

    </aside>
  );
}

export default AdminSidebar;