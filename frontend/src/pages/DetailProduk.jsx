import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api/products";
const IMAGE_URL = "http://127.0.0.1:8000/storage/";

const NOMOR_WHATSAPP = "62895633927037";

function DetailProduk() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/${id}`, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Produk tidak ditemukan");
        }

        const result = await response.json();

        // Menyesuaikan dengan response Laravel:
        // { message: "...", data: {...} }
        setProduct(result.data ?? result);
      } catch (err) {
        console.error("Error detail produk:", err);
        setError("Produk tidak dapat ditemukan.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ======================================================
  // LOADING
  // ======================================================
  if (loading) {
    return (
      <main className="page-section">
        <div className="container">
          <div className="not-found">
            <h2>Memuat produk...</h2>
            <p>Mohon tunggu sebentar.</p>
          </div>
        </div>
      </main>
    );
  }

  // ======================================================
  // ERROR / PRODUK TIDAK DITEMUKAN
  // ======================================================
  if (error || !product) {
    return (
      <main className="page-section">
        <div className="container">
          <div className="not-found">
            <h2>Produk Tidak Ditemukan</h2>
            <p>
              Produk yang kamu cari mungkin sudah dihapus atau tidak tersedia.
            </p>

            <Link to="/produk" className="btn btn-primary">
              ← Kembali ke Produk
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ======================================================
  // GAMBAR PRODUK
  // ======================================================
  const imageSrc = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${IMAGE_URL}${product.image.replace(/^\/?storage\//, "")}`
    : "/images/alkes1.png";

  // ======================================================
  // FORMAT HARGA
  // ======================================================
  const formattedPrice =
    product.price !== null &&
    product.price !== undefined &&
    product.price !== ""
      ? `Rp ${Number(product.price).toLocaleString("id-ID")}`
      : "Hubungi kami";

  // ======================================================
  // PESAN WHATSAPP
  // ======================================================
  const pesanWhatsApp = `Halo PT Mitra Meditama Abadi,

Saya tertarik untuk melakukan pemesanan produk berikut:

Nama Produk: ${product.name}
Kategori: ${product.category || "-"}
Harga: ${formattedPrice}

Mohon informasi mengenai:
- Ketersediaan produk
- Harga terbaru
- Jumlah minimum pemesanan
- Proses pemesanan

Terima kasih.`;

  const linkWhatsApp = `https://wa.me/${"62895633927037"}?text=${encodeURIComponent(
    pesanWhatsApp
  )}`;

  return (
    <main className="page-section">
      <div className="container">

        {/* ================================
            TOMBOL KEMBALI
        ================================= */}
        <Link to="/produk" className="back-link">
          ← Kembali ke Produk
        </Link>

        {/* ================================
            DETAIL PRODUK
        ================================= */}
        <div className="detail-product">

          {/* ================================
              GAMBAR
          ================================= */}
          <div className="detail-image">
            <img
              src={imageSrc}
              alt={product.name}
              onError={(e) => {
                e.target.src = "/images/alkes1.png";
              }}
            />
          </div>

          {/* ================================
              INFORMASI PRODUK
          ================================= */}
          <div className="detail-content">

            {/* KATEGORI */}
            <span className="product-category">
              {product.category || "Produk Medis"}
            </span>

            {/* NAMA */}
            <h1>{product.name}</h1>

            {/* HARGA */}
            <div className="product-price">
              {formattedPrice}
            </div>

            {/* DESKRIPSI */}
            <p>
              {product.description ||
                "Informasi mengenai produk belum tersedia."}
            </p>

            {/* INFORMASI PRODUK */}
            <h3>Informasi Produk</h3>

            <ul>
              <li>
                <strong>Nama Produk:</strong> {product.name}
              </li>

              <li>
                <strong>Kategori:</strong>{" "}
                {product.category || "-"}
              </li>
            </ul>

            {/* ================================
                TOMBOL WHATSAPP
            ================================= */}
            <a
              href={linkWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Hubungi Kami →
            </a>

          </div>
        </div>
      </div>
    </main>
  );
}

export default DetailProduk;