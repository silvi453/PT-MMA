import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="container nav-content">

        {/* LOGO */}
        <Link to="/" className="logo">
          <div className="logo-icon">✚</div>

          <div className="logo-text">
            <strong>PT MITRA MEDITAMA ABADI</strong>
            <span>Solusi Kesehatan, Hidup Lebih Sehat</span>
          </div>
        </Link>

        {/* MENU */}
        <nav className="nav-menu">

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Beranda
          </NavLink>

          <NavLink
            to="/tentang-kami"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Tentang Kami
          </NavLink>

          <NavLink
            to="/produk"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Produk
          </NavLink>

          <NavLink
            to="/layanan"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Layanan
          </NavLink>

          <NavLink
            to="/artikel"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Artikel
          </NavLink>

          <NavLink
            to="/kontak"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            Kontak
          </NavLink>

        </nav>

        {/* BUTTON KONTAK */}
        <Link to="/kontak" className="contact-button">
          Hubungi Kami →
        </Link>
      </div>
    </header>
  );
}

export default Navbar;