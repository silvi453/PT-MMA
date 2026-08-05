import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import TentangKami from "./pages/TentangKami";
import Produk from "./pages/Produk";
import DetailProduk from "./pages/DetailProduk";
import Layanan from "./pages/Layanan";
import Artikel from "./pages/Artikel";
import Kontak from "./pages/Kontak";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>

          {/* BERANDA */}
          <Route path="/" element={<Home />} />

          {/* TENTANG KAMI */}
          <Route
            path="/tentang-kami"
            element={<TentangKami />}
          />

          {/* PRODUK */}
          <Route
            path="/produk"
            element={<Produk />}
          />

          {/* DETAIL PRODUK */}
          <Route
            path="/produk/:id"
            element={<DetailProduk />}
          />

          {/* LAYANAN */}
          <Route
            path="/layanan"
            element={<Layanan />}
          />

          {/* ARTIKEL */}
          <Route
            path="/artikel"
            element={<Artikel />}
          />

          {/* KONTAK */}
          <Route
            path="/kontak"
            element={<Kontak />}
          />

        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;