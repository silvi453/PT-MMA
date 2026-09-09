import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container nav-content">

        {/* =========================
            LOGO
        ========================= */}
        <Link to="/" className="logo" onClick={closeMenu}>
          <div className="logo-icon">
            <img
              src="/images/logo.png"
              alt="Logo PT Mitra Meditama Abadi"
            />
          </div>

          <div className="logo-text">
            <strong>PT MITRA MEDITAMA ABADI</strong>
            <span>Solusi Kesehatan, Hidup Lebih Sehat</span>
          </div>
        </Link>


        {/* =========================
            HAMBURGER MOBILE
        ========================= */}
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
            MENU
        ========================= */}
        <nav className={`nav-menu ${menuOpen ? "show" : ""}`}>

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

        </nav>


        {/* =========================
            BUTTON KONTAK
        ========================= */}
        <Link
          to="/kontak"
          className="contact-button"
          onClick={closeMenu}
        >
          Hubungi Kami →
        </Link>

      </div>
    </header>
  );
}

export default Navbar;

