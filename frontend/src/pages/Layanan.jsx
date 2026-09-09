import { useEffect, useState } from "react";
import SectionTitle from "../components/SectionTitle";

const API_URL = "http://127.0.0.1:8000/api/services";

function Layanan() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil data layanan");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Data layanan:", data);

        // Menyesuaikan kemungkinan response Laravel
        setServices(
          Array.isArray(data)
            ? data
            : data.data || []
        );
      })
      .catch((error) => {
        console.error("Error mengambil layanan:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

        {loading ? (
          <p>Memuat layanan...</p>
        ) : services.length === 0 ? (
          <p>Belum ada layanan.</p>
        ) : (

          <div className="service-grid">

            {services.map((service) => (

              <div
                className="service-card"
                key={service.id}
              >

                <div className="service-icon">
                  {service.icon}
                </div>

                <h3>
                  {service.name}
                </h3>

                <p>
                  {service.description}
                </p>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>
  );
}

export default Layanan;