import "./TentangKami.css";

function TentangKami() {
  return (
    <main className="tentang-page">

      {/* =====================================================
          HERO TENTANG KAMI
      ===================================================== */}
      <section className="tentang-hero">
        <div className="tentang-container">

          <div className="tentang-hero-grid">

            {/* FOTO KANTOR */}
            <div className="tentang-image-wrapper">
              <div className="tentang-image">
                <img
                  src="/images/gedung.png"
                  alt="Kantor PT Mitra Meditama Abadi"
                />
              </div>

              <div className="tentang-image-badge">
                <strong>PT MMA</strong>
                <span>Mitra Meditama Abadi</span>
              </div>
            </div>

            {/* TEXT */}
            <div className="tentang-hero-content">

              <span className="tentang-eyebrow">
                TENTANG KAMI
              </span>

              <h1>
                Mitra Terpercaya
                <br />
                <span>Untuk Kebutuhan Kesehatan</span>
              </h1>

              <p className="tentang-lead">
                PT Mitra Meditama Abadi merupakan perusahaan yang
                bergerak dalam penyediaan alat kesehatan dan
                kebutuhan medis untuk mendukung pelayanan kesehatan
                yang berkualitas.
              </p>

              <p>
                Kami berkomitmen untuk menyediakan produk kesehatan
                yang berkualitas dengan pelayanan yang profesional,
                cepat, dan terpercaya.
              </p>

              <p>
                Dengan mengutamakan kepuasan pelanggan, kami terus
                berkembang menjadi mitra yang dapat diandalkan oleh
                rumah sakit, klinik, tenaga kesehatan, maupun
                berbagai fasilitas kesehatan lainnya.
              </p>

              <div className="tentang-line"></div>

              <div className="tentang-highlight">
                <div className="highlight-icon">
                  ✓
                </div>

                <div>
                  <strong>Pelayanan Profesional</strong>
                  <span>
                    Mengutamakan kualitas produk dan kepuasan pelanggan.
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          STATISTIK
      ===================================================== */}
      <section className="tentang-statistics">
        <div className="tentang-container">

          <div className="statistics-header">
            <span>PERJALANAN KAMI</span>

            <h2>
              Tumbuh Bersama
              <br />
              <strong>Mitra Kami</strong>
            </h2>
          </div>

          <div className="tentang-stats-grid">

            <div className="tentang-stat-card">
              <strong>10+</strong>
              <span>Tahun Pengalaman</span>
              <p>
                Berpengalaman dalam mendukung kebutuhan alat kesehatan.
              </p>
            </div>

            <div className="tentang-stat-card">
              <strong>100+</strong>
              <span>Produk</span>
              <p>
                Berbagai pilihan produk untuk kebutuhan fasilitas kesehatan.
              </p>
            </div>

            <div className="tentang-stat-card">
              <strong>50+</strong>
              <span>Mitra</span>
              <p>
                Dipercaya oleh berbagai pelanggan dan mitra kesehatan.
              </p>
            </div>

            <div className="tentang-stat-card">
              <strong>24/7</strong>
              <span>Komitmen Pelayanan</span>
              <p>
                Siap memberikan pelayanan dan dukungan terbaik.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          VISI MISI
      ===================================================== */}
      <section className="visi-misi-section">
        <div className="tentang-container">

          <div className="visi-misi-heading">

            <span className="tentang-eyebrow">
              NILAI PERUSAHAAN
            </span>

            <h2>
              Visi &amp; Misi
            </h2>

            <p>
              Menjadi bagian dari kemajuan pelayanan kesehatan
              melalui produk berkualitas dan pelayanan yang dapat
              diandalkan.
            </p>

          </div>


          <div className="visi-misi-grid">

            {/* VISI */}
            <div className="visi-card">

              <div className="visi-icon">
                👁
              </div>

              <div>
                <span className="card-label">
                  VISI
                </span>

                <h3>
                  Menjadi Mitra Kesehatan Terpercaya
                </h3>

                <p>
                  Menjadi perusahaan penyedia alat kesehatan yang
                  terpercaya dan mampu memberikan kontribusi positif
                  bagi peningkatan kualitas pelayanan kesehatan
                  di Indonesia.
                </p>
              </div>

            </div>


            {/* MISI */}
            <div className="misi-card">

              <div className="misi-icon">
                +
              </div>

              <div>
                <span className="card-label">
                  MISI
                </span>

                <h3>
                  Memberikan Solusi Terbaik
                </h3>

                <ul>
                  <li>
                    <span>✓</span>
                    Menyediakan produk kesehatan yang berkualitas.
                  </li>

                  <li>
                    <span>✓</span>
                    Memberikan pelayanan yang profesional dan responsif.
                  </li>

                  <li>
                    <span>✓</span>
                    Membangun hubungan jangka panjang dengan pelanggan.
                  </li>

                  <li>
                    <span>✓</span>
                    Terus berinovasi mengikuti perkembangan kebutuhan kesehatan.
                  </li>
                </ul>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          KOMITMEN
      ===================================================== */}
      <section className="komitmen-section">
        <div className="tentang-container">

          <div className="komitmen-box">

            <div className="komitmen-content">

              <span className="tentang-eyebrow">
                KOMITMEN KAMI
              </span>

              <h2>
                Bersama Membangun
                <br />
                <span>Kesehatan yang Lebih Baik</span>
              </h2>

              <p>
                Kami percaya bahwa kualitas pelayanan kesehatan
                tidak hanya ditentukan oleh tenaga profesional,
                tetapi juga oleh ketersediaan produk dan peralatan
                kesehatan yang tepat.
              </p>

              <p>
                Karena itu, PT Mitra Meditama Abadi berusaha menjadi
                partner yang memberikan solusi, bukan sekadar
                menyediakan produk.
              </p>

            </div>

            <div className="komitmen-decoration">
              <div className="medical-cross">
                +
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          CTA
      ===================================================== */}
      <section className="tentang-cta">
        <div className="tentang-container">

          <div className="cta-content">

            <span>
              PT MITRA MEDITAMA ABADI
            </span>

            <h2>
              Siap Menjadi Mitra
              <br />
              Kesehatan Anda
            </h2>

            <p>
              Hubungi kami untuk mendapatkan informasi mengenai
              produk dan layanan yang tersedia.
            </p>

            <a
              href="/kontak"
              className="cta-button"
            >
              Hubungi Kami
              <span>→</span>
            </a>

          </div>

        </div>
      </section>

    </main>
  );
}

export default TentangKami;