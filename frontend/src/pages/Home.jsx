import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";

const API_URL = "http://127.0.0.1:8000/api/products";
const IMAGE_URL = "http://127.0.0.1:8000/storage/";

// =====================================================
// KATEGORI PRODUK
// HARUS SAMA DENGAN TAMBAH PRODUK
// =====================================================

const categories = [
  {
    icon: "🩺",
    title: "Alat Diagnostik",
    desc: "Peralatan untuk membantu pemeriksaan dan diagnosis lebih akurat.",
  },
  {
    icon: "🏥",
    title: "Alat Medis",
    desc: "Berbagai peralatan medis untuk mendukung pelayanan kesehatan.",
  },
  {
    icon: "🏥",
    title: "Peralatan Rumah Sakit",
    desc: "Peralatan medis untuk mendukung operasional rumah sakit.",
  },
  {
    icon: "🔬",
    title: "Perlengkapan Medis",
    desc: "Perlengkapan medis untuk menunjang pelayanan dan perawatan pasien.",
  },
  {
    icon: "📦",
    title: "Lainnya",
    desc: "Berbagai produk kesehatan lainnya sesuai kebutuhan.",
  },
];

function Home() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // =====================================================
  // AMBIL PRODUK DARI DATABASE
  // =====================================================

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil data produk");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Data produk Home:", data);

        const productData = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

        setProducts(productData);
      })
      .catch((error) => {
        console.error("Error mengambil produk:", error);
        setProducts([]);
      })
      .finally(() => {
        setLoadingProducts(false);
      });
  }, []);

  // =====================================================
  // PRODUK UNGGULAN
  // =====================================================

  const featuredProducts = products.slice(0, 4);

  return (
    <>
      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero">
        <div className="container hero-content">

          <div className="hero-text">

            <span className="small-title">
              SOLUSI KESEHATAN TERPERCAYA
            </span>

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

              <Link
                to="/produk"
                className="btn btn-primary"
              >
                🛍️ &nbsp; Lihat Produk
              </Link>

              <Link
                to="/kontak"
                className="btn btn-outline"
              >
                ☎ &nbsp; Hubungi Kami
              </Link>

            </div>

            <div className="hero-features">

              <div className="hero-feature">

                <div className="feature-icon">
                  🛡️
                </div>

                <div>
                  <strong>
                    Produk Berkualitas
                  </strong>

                  <span>
                    Sertifikasi resmi & standar internasional
                  </span>
                </div>

              </div>

              <div className="hero-divider"></div>

              <div className="hero-feature">

                <div className="feature-icon">
                  🚚
                </div>

                <div>
                  <strong>
                    Pengiriman Cepat
                  </strong>

                  <span>
                    Kirim ke seluruh wilayah Indonesia
                  </span>
                </div>

              </div>

              <div className="hero-divider"></div>

              <div className="hero-feature">

                <div className="feature-icon">
                  🏅
                </div>

                <div>
                  <strong>
                    Garansi Resmi
                  </strong>

                  <span>
                    Layanan purna jual dan garansi produk
                  </span>
                </div>

              </div>

            </div>

          </div>


          <div className="hero-image">

            <div className="red-curve"></div>

            <img
              src="/images/foto2.png"
              alt="Alat kesehatan"
            />

            <div className="dot-pattern"></div>

          </div>

        </div>
      </section>


      {/* =================================================
          KATEGORI PRODUK
      ================================================= */}

      <section className="section">

        <div className="container">

          <SectionTitle title="KATEGORI PRODUK" />

          <div className="category-grid">

            {categories.map((category) => (

              <Link
                key={category.title}
                to={`/produk?category=${encodeURIComponent(
                  category.title
                )}`}
                className="category-card"
              >

                <div className="category-icon">
                  {category.icon}
                </div>

                <div>

                  <h3>
                    {category.title}
                  </h3>

                  <p>
                    {category.desc}
                  </p>

                </div>

              </Link>

            ))}

          </div>

        </div>

      </section>


      {/* =================================================
          PRODUK UNGGULAN
      ================================================= */}

      <section className="section products-section">

        <div className="container">

          <SectionTitle title="PRODUK UNGGULAN" />

          {loadingProducts ? (

            <p>
              Memuat produk...
            </p>

          ) : featuredProducts.length === 0 ? (

            <p>
              Belum ada produk.
            </p>

          ) : (

            <div className="product-grid">

              {featuredProducts.map((product) => (

                <div
                  className="product-card"
                  key={product.id}
                >

                  <div className="product-image">

                    <img
                      src={
                        product.image
                          ? `${IMAGE_URL}${product.image}`
                          : "/images/alkes1.png"
                      }
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = "/images/alkes1.png";
                      }}
                    />

                  </div>

                  <div className="product-info">

                    <span className="product-category">
                      {product.category || "Tanpa Kategori"}
                    </span>

                    <h3>
                      {product.name}
                    </h3>

                    <p>
                      {product.description ||
                        "Tidak ada deskripsi produk."}
                    </p>

                    <Link
                      to={`/produk/${product.id}`}
                      className="detail-link"
                    >
                      Lihat Detail →
                    </Link>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </section>


      {/* =================================================
          TENTANG KAMI & STATISTIK
      ================================================= */}

      <section className="about-section">

        <div className="container">

          <div className="about-container">

            <div className="about-image">

              <img
                src="/images/gedung.png"
                alt="Gedung perusahaan"
              />

            </div>

            <div className="about-content">

              <span className="small-title">
                TENTANG KAMI
              </span>

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

              <Link
                to="/tentang-kami"
                className="btn btn-primary"
              >
                Selengkapnya Tentang Kami →
              </Link>

            </div>

          </div>


          <SectionTitle title="STATISTIK" />

          <div className="statistics">

            <div className="stat-item">

              <div className="stat-icon">
                🏅
              </div>

              <div>
                <strong>
                  10+
                </strong>

                <span>
                  Tahun Pengalaman
                </span>
              </div>

            </div>


            <div className="stat-item">

              <div className="stat-icon">
                📦
              </div>

              <div>
                <strong>
                  1000+
                </strong>

                <span>
                  Produk Berkualitas
                </span>
              </div>

            </div>


            <div className="stat-item">

              <div className="stat-icon">
                👥
              </div>

              <div>
                <strong>
                  500+
                </strong>

                <span>
                  Klien di Seluruh Indonesia
                </span>
              </div>

            </div>


            <div className="stat-item">

              <div className="stat-icon">
                📍
              </div>

              <div>
                <strong>
                  34
                </strong>

                <span>
                  Provinsi Terjangkau
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          KEUNGGULAN
      ================================================= */}

      <section className="section">

        <div className="container">

          <SectionTitle title="KENAPA MEMILIH KAMI?" />

          <div className="advantages-grid">

            <div className="advantage">

              <div className="advantage-icon">
                🏅
              </div>

              <div>

                <h3>
                  Kualitas Terjamin
                </h3>

                <p>
                  Produk berkualitas resmi dan bersertifikat.
                </p>

              </div>

            </div>


            <div className="advantage">

              <div className="advantage-icon">
                🏷️
              </div>

              <div>

                <h3>
                  Harga Kompetitif
                </h3>

                <p>
                  Harga terbaik dengan kualitas produk terbaik.
                </p>

              </div>

            </div>


            <div className="advantage">

              <div className="advantage-icon">
                🚚
              </div>

              <div>

                <h3>
                  Pengiriman Cepat
                </h3>

                <p>
                  Pengiriman aman dan cepat ke seluruh Indonesia.
                </p>

              </div>

            </div>


            <div className="advantage">

              <div className="advantage-icon">
                🎧
              </div>

              <div>

                <h3>
                  Layanan Profesional
                </h3>

                <p>
                  Tim kami siap membantu kebutuhan Anda.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </>
  );
}

export default Home;

