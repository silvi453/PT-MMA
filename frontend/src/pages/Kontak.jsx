import SectionTitle from "../components/SectionTitle";

function Kontak() {
  return (
    <section className="page-section">

      <div className="container">

        <SectionTitle title="HUBUNGI KAMI" />

        <div className="contact-page">

          <div className="contact-info">

            <h2>
              Kami Siap Membantu
            </h2>

            <p>
              Jangan ragu untuk menghubungi
              kami jika Anda membutuhkan
              informasi produk atau layanan.
            </p>

            <div className="contact-item">
              <strong>📍 Alamat</strong>
              <span>
                Jl. Simpang Danau Limboto Timur 2, Blok A5 - 132, Sawojajar, Kec. Kedungkandang, Kota Malang, Jawa Timur
              </span>
            </div>

            <div className="contact-item">
              <strong>☎ Telepon</strong>
              <span>
                (0341) 727299
              </span>
            </div>

            <div className="contact-item">
              <strong>✉ Email</strong>
              <span>
                adm.mitrameditamaabadi@gmail.com
              </span>
            </div>

          </div>

          <form className="contact-form">

            <input
              type="text"
              placeholder="Nama Lengkap"
            />

            <input
              type="email"
              placeholder="Email"
            />

            <input
              type="text"
              placeholder="Nomor Telepon"
            />

            <textarea
              rows="6"
              placeholder="Pesan Anda"
            ></textarea>

            <button
              type="submit"
              className="btn btn-primary"
            >
              Kirim Pesan →
            </button>

          </form>

        </div>

      </div>

    </section>
  );
}

export default Kontak;