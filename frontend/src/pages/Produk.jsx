import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";

const products = [
  {
    id: "patient-monitor",
    image: "/images/alkes1.png",
    title: "Patient Monitor",
    category: "Alat Diagnostik",
    desc: "Monitor kondisi vital pasien secara real-time.",
  },
  {
    id: "ventilator",
    image: "/images/alkes2.png",
    title: "Ventilator",
    category: "Alat Rumah Sakit",
    desc: "Perangkat pendukung pernapasan pasien.",
  },
  {
    id: "infusion-pump",
    image: "/images/alkes3.png",
    title: "Infusion Pump",
    category: "Alat Rumah Sakit",
    desc: "Pompa infus dengan pengaturan yang akurat.",
  },
  {
    id: "infusion set",
    image: "/images/alkes4.png",
    title: "Set Infus",
    category: "Alat Perawatan",
    desc: "Set infus steril untuk memberikan cairan yang aman dan nyaman."
  }
];

function Produk() {
  return (
    <section className="page-section">

      <div className="container">

        <SectionTitle title="PRODUK KAMI" />

        <div className="product-page-grid">

          {products.map((product) => (

            <div
              className="product-card"
              key={product.id}
            >

              <div className="product-image">

                <img
                  src={product.image}
                  alt={product.title}
                />

              </div>

              <div className="product-info">

                <span className="product-category">
                  {product.category}
                </span>

                <h3>
                  {product.title}
                </h3>

                <p>
                  {product.desc}
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

      </div>

    </section>
  );
}

export default Produk;