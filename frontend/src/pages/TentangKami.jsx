import SectionTitle from "../components/SectionTitle";

function TentangKami() {
  return (
    <section className="page-section">

      <div className="container">

        <SectionTitle title="TENTANG KAMI" />

        <div className="page-about">

          <img
            src="/images/company-building.jpg"
            alt="Gedung PT Alat Kesehatan"
          />

          <div>

            <span className="small-title">
              TENTANG PERUSAHAAN
            </span>

            <h1>
              Mitra Terpercaya
              Fasilitas Kesehatan
            </h1>

            <p>
              PT Mitra Meditama Abadi merupakan perusahaan
              yang bergerak dalam bidang distribusi
              alat kesehatan di Indonesia.
            </p>

            <p>
              Kami berkomitmen memberikan produk
              berkualitas, pelayanan profesional,
              harga kompetitif, serta dukungan
              purna jual kepada pelanggan.
            </p>

            <p>
              Dengan pengalaman lebih dari 10 tahun,
              kami terus berkembang menjadi mitra
              terpercaya bagi rumah sakit,
              klinik, laboratorium, dan berbagai
              fasilitas kesehatan.
            </p>

          </div>

        </div>

        <div className="about-stats">

          <div>
            <strong>10+</strong>
            <span>Tahun Pengalaman</span>
          </div>

          <div>
            <strong>1000+</strong>
            <span>Produk</span>
          </div>

          <div>
            <strong>500+</strong>
            <span>Klien</span>
          </div>

          <div>
            <strong>34</strong>
            <span>Provinsi</span>
          </div>

        </div>

      </div>

    </section>
  );
}

export default TentangKami;