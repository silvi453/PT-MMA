import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import TentangKami from "./pages/TentangKami";
import Produk from "./pages/Produk";
import DetailProduk from "./pages/DetailProduk";
import Layanan from "./pages/Layanan";
import Artikel from "./pages/Artikel";
import Kontak from "./pages/Kontak";
import Register from "./pages/Register";
import Login from "./pages/Login";

import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProduk from "./admin/AdminProduk";
import AdminArtikel from "./admin/AdminArtikel";
import AdminLayanan from "./admin/AdminLayanan";
import AdminPengguna from "./admin/AdminPengguna";

import TambahProduk from "./admin/TambahProduk";
import TambahArtikel from "./admin/TambahArtikel";
import TambahLayanan from "./admin/TambahLayanan";

import EditProduk from "./admin/EditProduk";
import EditLayanan from "./admin/EditLayanan";

import AdminModal from "./components/AdminModal";

function App() {
const location = useLocation();

const isAdminPage =
location.pathname.startsWith("/admin");
const isAuthPage =
location.pathname === "/login" ||
location.pathname === "/register";
const showPublicLayout =
!isAdminPage && !isAuthPage;

return (
<>
  {showPublicLayout && <Navbar />}
  <main>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tentang-kami" element={<TentangKami />} />
      <Route path="/produk" element={<Produk />} />
      <Route path="/produk/:id" element={<DetailProduk />} />
      <Route path="/layanan" element={<Layanan />} />
      <Route path="/artikel" element={<Artikel />} />
      <Route path="/kontak" element={<Kontak />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<AdminProduk />} />
      <Route path="/admin/articles" element={<AdminArtikel />} />
      <Route path="/admin/services" element={<AdminLayanan />} />
      <Route path="/admin/users" element={<AdminPengguna />} />
      <Route path="/admin/pengguna" element={<AdminPengguna />} />
      <Route path="/adminmodal" element={<AdminModal />} />
      <Route path="/admin/tambahproduk" element={<TambahProduk />} />
      <Route path="/admin/tambahartikel" element={<TambahArtikel />} />
      <Route path="/admin/tambahlayanan" element={<TambahLayanan />} />
      <Route path="/admin/editproduk/:id" element={<EditProduk />} />
      <Route path="/admin/editlayanan/:id" element={<EditLayanan />} />

    </Routes>
  </main>
  {showPublicLayout && <Footer />}
</>

);
}

export default App;
