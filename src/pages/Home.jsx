import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";

const categories = [
  {
    icon: "🩺",
    title: "Alat Diagnostik",
    desc: "Peralatan untuk membantu pemeriksaan dan diagnosis lebih akurat.",
  },
  {
    icon: "🏥",
    title: "Alat Rumah Sakit",
    desc: "Peralatan medis untuk mendukung operasional rumah sakit.",
  },
  {
    icon: "🔬",
    title: "Alat Laboratorium",
    desc: "Peralatan laboratorium untuk hasil penelitian yang andal.",
  },
  {
    icon: "♿",
    title: "Alat Perawatan",
    desc: "Peralatan untuk perawatan pasien dan kebutuhan rehabilitasi.",
  },
];

const products = [
  {
    id: "patient-monitor",
    image: "/images/alkes1.png",
    title: "Patient Monitor",
    desc: "Monitor pasien dengan tampilan parameter vital secara real-time.",
  },
  {
    id: "ventilator",
    image: "/images/alkes2.png",
    title: "Ventilator",
    desc: "Ventilator modern untuk dukungan pernapasan pasien.",
  },
  {
    id: "infusion-pump",
    image: "/images/alkes3.png",
    title: "Infusion Pump",
    desc: "Pompa infus akurat untuk pemberian cairan dan obat.",
  },
  {
    id: "infusion-set",
    image: "/images/alkes4.png",
    title: "Infus Set",
    desc: "Set infus steril dengan aliran cairan yang stabil.",
  },
];

const advantages = [
  {
    icon: "🏅",
    title: "Kualitas Terjamin",
    desc: "Produk berkualitas resmi dan bersertifikat.",
  },
  {
    icon: "🏷️",
    title: "Harga Kompetitif",
    desc: "Harga terbaik dengan kualitas produk terbaik.",
  },
  {
    icon: "🚚",
    title: "Pengiriman Cepat",
    desc: "Pengiriman aman dan cepat ke seluruh Indonesia.",
  },
  {
    icon: "🎧",
    title: "Layanan Profesional",
    desc: "Tim kami siap membantu kebutuhan Anda.",
  },
];

function Home() {
  return (
    <>
      {/* =========================
          HERO
      ========================= */}
      <section className="hero">
        <div className="container hero-content">
          {/* TEKS HERO */}
          <div className="hero-text">
            <span className="small-title">SOLUSI KESEHATAN TERPERCAYA</span>

            <h1>
              Solusi Alat Kesehatan
              <br />
              <span>Terpercaya untuk Indonesia</span>
            </h1>

            <p>
              PT Mitra Meditama Abadi berkomitmen menyediakan produk berkualitas
              tinggi, layanan terbaik, dan solusi tepat guna mendukung fasilitas
              kesehatan di seluruh Indonesia.
            </p>

            <div className="hero-buttons">
              <Link to="/produk" className="btn btn-primary">
                🛍️ &nbsp; Lihat Produk
              </Link>
              <Link to="/kontak" className="btn btn-outline">
                ☎ &nbsp; Hubungi Kami
              </Link>
            </div>

            <div className="hero-features">
              <div className="hero-feature">
                <div className="feature-icon">🛡️</div>
                <div>
                  <strong>Produk Berkualitas</strong>
                  <span>Sertifikasi resmi & standar internasional</span>
                </div>
              </div>

              <div className="hero-divider"></div>

              <div className="hero-feature">
                <div className="feature-icon">🚚</div>
                <div>
                  <strong>Pengiriman Cepat</strong>
                  <span>Kirim ke seluruh wilayah Indonesia</span>
                </div>
              </div>

              <div className="hero-divider"></div>

              <div className="hero-feature">
                <div className="feature-icon">🏅</div>
                <div>
                  <strong>Garansi Resmi</strong>
                  <span>Layanan purna jual dan garansi produk</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <div className="red-curve"></div>
            <img src="/images/foto2.png" alt="Alat kesehatan" />
            <div className="dot-pattern"></div>
          </div>
        </div>
      </section>

      {/* =========================
          KATEGORI
      ========================= */}
      <section className="section">
        <div className="container">
          <SectionTitle title="KATEGORI PRODUK" />

          <div className="category-grid">
            {categories.map((category) => (
              <Link
                to="/produk"
                className="category-card"
                key={category.title}
              >
                <div className="category-icon">{category.icon}</div>
                <div>
                  <h3>{category.title}</h3>
                  <p>{category.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          PRODUK UNGGULAN
      ========================= */}
      <section className="section products-section">
        <div className="container">
          <SectionTitle title="PRODUK UNGGULAN" />

          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-image">
                  <img src={product.image} alt={product.title} />
                </div>

                <div className="product-info">
                  <h3>{product.title}</h3>
                  <p>{product.desc}</p>
                  <Link to={`/produk/${product.id}`} className="detail-link">
                    Lihat Detail →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          TENTANG KAMI & STATISTIK
      ========================= */}
      <section className="about-section">
        <div className="container">
          <div className="about-container">
            <div className="about-image">
              <img
                src="/images/company-building.jpg"
                alt="Gedung perusahaan"
              />
            </div>

            <div className="about-content">
              <span className="small-title">TENTANG KAMI</span>
              <h2>
                Mitra Terpercaya
                <br />
                Fasilitas Kesehatan
              </h2>
              <p>
                PT Mitra Meditama Abadi adalah perusahaan yang bergerak di
                bidang distribusi alat kesehatan dengan komitmen tinggi terhadap
                kualitas, inovasi, dan kepuasan pelanggan.
              </p>
              <p>
                Kami melayani berbagai instansi kesehatan di seluruh Indonesia
                dengan layanan profesional dan terpercaya.
              </p>

              <Link to="/tentang-kami" className="btn btn-primary">
                Selengkapnya Tentang Kami →
              </Link>
            </div>
          </div>

          {/* STATISTIK */}
          <SectionTitle title="STATISTIK" />
          <div className="statistics">
            <div className="stat-item">
              <div className="stat-icon">🏅</div>
              <div>
                <strong>10+</strong>
                <span>Tahun Pengalaman</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">📦</div>
              <div>
                <strong>1000+</strong>
                <span>Produk Berkualitas</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">👥</div>
              <div>
                <strong>500+</strong>
                <span>Klien di Seluruh Indonesia</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">📍</div>
              <div>
                <strong>34</strong>
                <span>Provinsi Terjangkau</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          KEUNGGULAN
      ========================= */}
      <section className="section">
        <div className="container">
          <SectionTitle title="KENAPA MEMILIH KAMI?" />

          <div className="advantages-grid">
            {advantages.map((item) => (
              <div className="advantage" key={item.title}>
                <div className="advantage-icon">{item.icon}</div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;