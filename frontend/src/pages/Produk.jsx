import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";

const API_URL = "http://127.0.0.1:8000/api/products";
const IMAGE_URL = "http://127.0.0.1:8000/storage/";

function Produk() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category");

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil data produk");
        }

        return response.json();
      })
      .then((data) => {
        const productData = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

        setProducts(productData);
      })
      .catch((error) => {
        console.error("Error mengambil produk:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(
        (product) =>
          product.category &&
          product.category.trim().toLowerCase() ===
            selectedCategory.trim().toLowerCase()
      )
    : products;

  return (
    <section className="page-section">
      <div className="container">

        <SectionTitle
          title={
            selectedCategory
              ? `PRODUK ${selectedCategory.toUpperCase()}`
              : "PRODUK KAMI"
          }
        />

        {loading && (
          <p className="loading-text">
            Memuat produk...
          </p>
        )}

        {/* TIDAK ADA PRODUK SAMA SEKALI */}
        {!loading && products.length === 0 && (
          <div className="empty-product">
            <p>Belum ada produk.</p>
          </div>
        )}

        {/* KATEGORI TIDAK MEMILIKI PRODUK */}
        {!loading &&
          products.length > 0 &&
          filteredProducts.length === 0 && (
            <div className="empty-product">
              <p>
                Belum ada produk dalam kategori{" "}
                <strong>{selectedCategory}</strong>.
              </p>
            </div>
          )}

        {!loading && filteredProducts.length > 0 && (
          <div className="product-page-grid">
            {filteredProducts.map((product) => (
              <div className="product-card" key={product.id}>

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

                  <h3>{product.name}</h3>

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
  );
}

export default Produk;