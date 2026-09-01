import SectionTitle from "../components/SectionTitle";

const services = [
  {
    icon: "🚚",
    title: "Pengiriman Produk",
    desc: "Kami menyediakan layanan pengiriman produk ke berbagai wilayah di Indonesia.",
  },
  {
    icon: "🔧",
    title: "Instalasi Produk",
    desc: "Tim teknis membantu proses instalasi dan memastikan alat siap digunakan.",
  },
  {
    icon: "🛠️",
    title: "Maintenance",
    desc: "Layanan perawatan dan pemeliharaan alat kesehatan.",
  },
  {
    icon: "🎧",
    title: "Customer Support",
    desc: "Tim profesional kami siap membantu kebutuhan dan pertanyaan pelanggan.",
  },
];

function Layanan() {
  return (
    <section className="page-section">

      <div className="container">

        <SectionTitle title="LAYANAN KAMI" />

        <p className="page-intro">
          Kami tidak hanya menyediakan produk,
          tetapi juga memberikan layanan terbaik
          untuk memastikan kebutuhan fasilitas
          kesehatan Anda terpenuhi.
        </p>

        <div className="service-grid">

          {services.map((service) => (

            <div
              className="service-card"
              key={service.title}
            >

              <div className="service-icon">
                {service.icon}
              </div>

              <h3>
                {service.title}
              </h3>

              <p>
                {service.desc}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Layanan;