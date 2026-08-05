import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        {/* KOLOM 1: BRAND / PERUSAHAAN */}
        <div className="footer-column footer-brand">
          <div className="logo" style={{ marginBottom: "15px" }}>
            <div className="logo-icon" style={{ background: "#fff", color: "#d71920" }}>
              ✚
            </div>
            <div className="logo-text">
              <strong style={{ color: "#fff", fontSize: "14px" }}>
                PT MITRA MEDITAMA ABADI
              </strong>
            </div>
          </div>
          <p>
            Solusi kesehatan terpercaya untuk mendukung fasilitas kesehatan di
            seluruh Indonesia.
          </p>
          <div className="footer-social">
            <a href="#facebook" aria-label="Facebook">f</a>
            <a href="#instagram" aria-label="Instagram">📷</a>
            <a href="#linkedin" aria-label="LinkedIn">in</a>
            <a href="#youtube" aria-label="YouTube">▶</a>
          </div>
        </div>

        {/* KOLOM 2: MENU */}
        <div className="footer-column">
          <h3>MENU</h3>
          <Link to="/">Beranda</Link>
          <Link to="/about">Tentang Kami</Link>
          <Link to="/products">Produk</Link>
          <Link to="/services">Layanan</Link>
          <Link to="/articles">Artikel</Link>
          <Link to="/contact">Kontak</Link>
        </div>

        {/* KOLOM 3: PRODUK */}
        <div className="footer-column">
          <h3>PRODUK</h3>
          <Link to="/products">Alat Diagnostik</Link>
          <Link to="/products">Alat Rumah Sakit</Link>
          <Link to="/products">Alat Laboratorium</Link>
          <Link to="/products">Alat Perawatan</Link>
          <Link to="/products">Suku Cadang</Link>
        </div>

        {/* KOLOM 4: HUBUNGI KAMI */}
        <div className="footer-column footer-contact">
          <h3>HUBUNGI KAMI</h3>
          <p>
            <span>📍</span>
            Jl. Simpang Danau Limboto Timur 2, Blok A5 - 132, Sawojajar,
            Kec. Kedungkandang, Kota Malang, Jawa Timur
          </p>
          <p>
            <span>📞</span> (0341) 727299
          </p>
          <p>
            <span>✉</span> adm.mitrameditamaabadi@gmail.com
          </p>
          <p>
            <span>🕐</span> Senin - Jumat: 08.00 - 17.00 WIB
          </p>
        </div>

        {/* KOLOM 5: NEWSLETTER */}
        <div className="footer-column footer-newsletter">
          <h3>NEWSLETTER</h3>
          <p>
            Dapatkan informasi terbaru seputar produk dan layanan kami.
          </p>

          <form onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Masukkan email Anda" required />
            <button type="submit">✈</button>
          </form>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="footer-bottom">
        © 2026 PT Mitra Meditama Abadi. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;