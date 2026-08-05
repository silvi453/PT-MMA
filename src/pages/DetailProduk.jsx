import { Link, useParams } from "react-router-dom";

const products = {
  "patient-monitor": {
    title: "Patient Monitor",
    category: "Alat Diagnostik",
    image: "/images/alkes1.png",
    description:
      "Patient Monitor merupakan perangkat medis yang digunakan untuk memantau kondisi vital pasien secara real-time.",
    features: [
      "Tampilan parameter vital secara real-time",
      "Desain modern dan mudah digunakan",
      "Cocok untuk rumah sakit dan klinik",
      "Hasil monitoring akurat",
    ],
  },

  "ventilator": {
    title: "Ventilator",
    category: "Alat Rumah Sakit",
    image: "/images/alkes2.png",
    description:
      "Ventilator merupakan perangkat medis yang membantu memberikan dukungan pernapasan kepada pasien.",
    features: [
      "Mode ventilasi lengkap",
      "Pengaturan mudah",
      "Monitor kondisi pernapasan",
      "Cocok untuk fasilitas kesehatan",
    ],
  },

  "infusion-pump": {
    title: "Infusion Pump",
    category: "Alat Rumah Sakit",
    image: "/images/alkes3.png",
    description:
      "Infusion Pump digunakan untuk memberikan cairan atau obat kepada pasien dengan jumlah dan kecepatan yang terkontrol.",
    features: [
      "Kontrol kecepatan infus",
      "Alarm keamanan",
      "Pengoperasian mudah",
      "Akurasi tinggi",
    ],
  },

  "infusion-set": {
    title: "Infus Set",
    category: "Alat Perawatan",
    image: "/images/alkes4.png",
    description:
      "Pompa infus (infusion pump) adalah perangkat medis elektronik yang mengatur dan mengalirkan cairan atau obat ke dalam tubuh pasien dengan akurasi volume dan kecepatan yang sangat tinggi.",
    features: [
      "Steril dan aman",
      "Material berkualitas",
      "Aliran cairan stabil",
      "Mudah digunakan",
    ],
  },
};

function DetailProduk() {
  const { id } = useParams();
  const product = products[id];

  if (!product) return null;

  return (
    <section className="page-section">
      <div className="container">

        <Link to="/produk" className="back-link">
          ← Kembali ke Produk
        </Link>

        <div className="detail-product">

          <div className="detail-image">
            <img
              src={product.image}
              alt={product.title}
            />
          </div>

          <div className="detail-content">

            <span className="product-category">
              {product.category}
            </span>

            <h1>{product.title}</h1>

            <p>{product.description}</p>

            <h3>Keunggulan Produk</h3>

            <ul>
              {product.features.map((feature, index) => (
                <li key={index}>
                  ✓ {feature}
                </li>
              ))}
            </ul>

            <Link
              to="/kontak"
              className="btn btn-primary"
            >
              Tanya Produk →
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}

export default DetailProduk;