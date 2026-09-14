import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");

      setIsLoggedIn(!!token);
    };

    checkLogin();

    window.addEventListener("authChanged", checkLogin);
    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("authChanged", checkLogin);
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  return (
    <header className="navbar">
      <div className="container nav-content">

        {/* =========================
            LOGO
        ========================== */}
        <Link
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          <div className="logo-icon">
            <img
              src="/images/logo.png"
              alt="Logo PT Mitra Meditama Abadi"
            />
          </div>

          <div className="logo-text">
            <strong>PT MITRA MEDITAMA ABADI</strong>

            <span>
              Solusi Kesehatan, Hidup Lebih Sehat
            </span>
          </div>
        </Link>

        {/* =========================
            MOBILE MENU BUTTON
        ========================== */}
        <button
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Buka menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* =========================
            NAVIGATION
        ========================== */}
        <nav
          className={`nav-menu ${menuOpen ? "show" : ""}`}
        >
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
            onClick={closeMenu}
          >
            Beranda
          </NavLink>

          <NavLink
            to="/tentang-kami"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
            onClick={closeMenu}
          >
            Tentang Kami
          </NavLink>

          <NavLink
            to="/produk"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
            onClick={closeMenu}
          >
            Produk
          </NavLink>

          <NavLink
            to="/layanan"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
            onClick={closeMenu}
          >
            Layanan
          </NavLink>

          <NavLink
            to="/artikel"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
            onClick={closeMenu}
          >
            Artikel
          </NavLink>

          <NavLink
            to="/kontak"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
            onClick={closeMenu}
          >
            Kontak
          </NavLink>

          {/* =========================
              PROFIL SAYA
              HANYA UNTUK USER LOGIN
          ========================== */}
          {isLoggedIn && (
            <NavLink
              to="/profil"
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
              onClick={closeMenu}
            >
              Profil Saya
            </NavLink>
          )}

          {/* =========================
              PESAN SAYA
              HANYA UNTUK USER LOGIN
          ========================== */}
          {isLoggedIn && (
            <NavLink
              to="/pesan-saya"
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
              onClick={closeMenu}
            >
              Pesan Saya
            </NavLink>
          )}
        </nav>

        {/* =========================
            BUTTON KANAN
        ========================== */}
        <div className="navbar-actions">

          {/* =========================
              BELUM LOGIN
          ========================== */}
          {!isLoggedIn && (
            <Link
              to="/login"
              className="login-navbar-button"
              onClick={closeMenu}
            >
              Login
            </Link>
          )}

          {/* =========================
              SUDAH LOGIN
          ========================== */}
          {isLoggedIn && (
            <Link
              to="/kontak"
              className="contact-button"
              onClick={closeMenu}
            >
              Hubungi Kami →
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}

export default Navbar;
