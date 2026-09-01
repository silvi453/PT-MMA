jsx
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">

        {/* ============================= */}
        {/* KOLOM 1: BRAND / PERUSAHAAN */}
        {/* ============================= */}
        <div className="footer-column footer-brand">
          <div
            className="logo"
            style={{ marginBottom: "15px" }}
          >
            <div
              className="logo-icon"
              style={{
                background: "#fff",
                color: "#d71920",
              }}
            >
              ✚
            </div>

            <div className="logo-text">
              <strong
                style={{
                  color: "#fff",
                  fontSize: "14px",
                }}
              >
                PT MITRA MEDITAMA ABADI
              </strong>
            </div>
          </div>

          <p>
            Solusi kesehatan terpercaya untuk mendukung fasilitas kesehatan
            di seluruh Indonesia.
          </p>
        </div>

        {/* ============================= */}
        {/* KOLOM 2: MENU */}
        {/* ============================= */}
        <div className="footer-column">
          <h3>MENU</h3>

          <Link to="/">Beranda</Link>
          <Link to="/tentang-kami">Tentang Kami</Link>
          <Link to="/produk">Produk</Link>
          <Link to="/layanan">Layanan</Link>
          <Link to="/artikel">Artikel</Link>
          <Link to="/kontak">Kontak</Link>
        </div>

        {/* ============================= */}
        {/* KOLOM 3: HUBUNGI KAMI */}
        {/* ============================= */}
        <div className="footer-column footer-contact">

          <h3>HUBUNGI KAMI</h3>

          {/* ALAMAT */}
          <p className="footer-address">
            Jl. Simpang Danau Limboto Timur 2, Blok A5 - 132, Sawojajar,
            Kec. Kedungkandang, Kota Malang, Jawa Timur
          </p>

          {/* ============================= */}
          {/* NOMOR TELEPON */}
          {/* ============================= */}
          <a
            className="footer-contact-link"
            href="tel:+6281234567890"
          >
            📞 0812-3456-7890
          </a>

          {/* ============================= */}
          {/* EMAIL */}
          {/* ============================= */}
          <a
            className="footer-contact-link"
            href="mailto:admin@mitrameditamaabadi.com"
          >
            📧 admin@mitrameditamaabadi.com
          </a>

          {/* JAM OPERASIONAL */}
          <p className="footer-hours">
            Senin - Jumat: 08.00 - 17.00 WIB
          </p>

          <p className="footer-hours">
            Sabtu: 08.00 - 14.00 WIB
          </p>

        </div>

        {/* ============================= */}
        {/* KOLOM 4: NEWSLETTER */}
        {/* ============================= */}
        <div className="footer-column footer-newsletter">

          <h3>NEWSLETTER</h3>

          <p>
            Dapatkan informasi terbaru seputar produk dan layanan kami.
          </p>

          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Masukkan email Anda"
              required
            />

            <button type="submit">
              Send
            </button>
          </form>

        </div>

      </div>

      {/* ============================= */}
      {/* COPYRIGHT */}
      {/* ============================= */}
      <div className="footer-bottom">
        © 2026 PT Mitra Meditama Abadi. Silvi
      </div>

    </footer>
  );
}

export default Footer;