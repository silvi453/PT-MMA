import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import "./Admin.css";

const API_URL = "http://127.0.0.1:8000";

function AdminDashboard() {
  const navigate = useNavigate();

  const [statistics, setStatistics] = useState({
    products: 0,
    articles: 0,
    services: 0,
    users: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | CEK LOGIN + AMBIL STATISTIK
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/admin", {
        replace: true,
      });

      return;
    }

    fetchStatistics(token);
  }, [navigate]);


  /*
  |--------------------------------------------------------------------------
  | FETCH STATISTICS
  |--------------------------------------------------------------------------
  */

  const fetchStatistics = async (token) => {
    setLoadingStats(true);

    try {

      // ==================================================
      // PRODUK
      // ==================================================

      let productsCount = 0;

      try {
        const response = await fetch(
          `${API_URL}/api/products`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();

          const products = Array.isArray(result.data)
            ? result.data
            : Array.isArray(result)
            ? result
            : [];

          productsCount = products.length;
        }

      } catch (error) {
        console.error(
          "Gagal mengambil jumlah produk:",
          error
        );
      }


      // ==================================================
      // ARTIKEL
      // ==================================================

      let articlesCount = 0;

      try {
        const response = await fetch(
          `${API_URL}/api/articles`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();

          const articles = Array.isArray(result.data)
            ? result.data
            : Array.isArray(result)
            ? result
            : [];

          articlesCount = articles.length;
        }

      } catch (error) {
        console.error(
          "Gagal mengambil jumlah artikel:",
          error
        );
      }


      // ==================================================
      // LAYANAN
      // ==================================================

      let servicesCount = 0;

      try {
        const response = await fetch(
          `${API_URL}/api/services`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();

          const services = Array.isArray(result.data)
            ? result.data
            : Array.isArray(result)
            ? result
            : [];

          servicesCount = services.length;
        }

      } catch (error) {
        console.error(
          "Gagal mengambil jumlah layanan:",
          error
        );
      }


      // ==================================================
      // PENGGUNA
      // ==================================================

      let usersCount = 0;

      try {
        const response = await fetch(
          `${API_URL}/api/users`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();

          const users = Array.isArray(result.data)
            ? result.data
            : Array.isArray(result)
            ? result
            : [];

          usersCount = users.length;
        }

      } catch (error) {
        console.error(
          "Gagal mengambil jumlah pengguna:",
          error
        );
      }


      // ==================================================
      // SET STATISTICS
      // ==================================================

      setStatistics({
        products: productsCount,
        articles: articlesCount,
        services: servicesCount,
        users: usersCount,
      });

    } catch (error) {

      console.error(
        "Gagal mengambil statistik dashboard:",
        error
      );

    } finally {

      setLoadingStats(false);

    }
  };


  /*
  |--------------------------------------------------------------------------
  | USER LOGIN
  |--------------------------------------------------------------------------
  */

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );


  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/admin", {
      replace: true,
    });
  };


  /*
  |--------------------------------------------------------------------------
  | RETURN
  |--------------------------------------------------------------------------
  */

  return (
    <div className="admin-dashboard">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <AdminSidebar />


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="admin-main">

        {/* ==================================================
            TOPBAR
        ================================================== */}

        <div className="admin-topbar">

          <div>

            <h1>
              Dashboard
            </h1>

            <p>
              Selamat datang di halaman admin PT MMA.
            </p>

          </div>


          {/* PROFILE SAJA */}
          
          <button
            className="admin-profile"
            onClick={() =>
              navigate("/admin/profile")
            }
          >
            👤 {user?.name || "Admin"}
          </button>

        </div>


        {/* ==================================================
            STATISTICS
        ================================================== */}

        <div className="admin-statistics">

          {/* PRODUK */}

          <div className="admin-stat-card">

            <span>
              📦
            </span>

            <div>

              <strong>
                {loadingStats
                  ? "..."
                  : statistics.products}
              </strong>

              <p>
                Total Produk
              </p>

            </div>

          </div>


          {/* ARTIKEL */}

          <div className="admin-stat-card">

            <span>
              📰
            </span>

            <div>

              <strong>
                {loadingStats
                  ? "..."
                  : statistics.articles}
              </strong>

              <p>
                Total Artikel
              </p>

            </div>

          </div>


          {/* LAYANAN */}

          <div className="admin-stat-card">

            <span>
              🛠️
            </span>

            <div>

              <strong>
                {loadingStats
                  ? "..."
                  : statistics.services}
              </strong>

              <p>
                Total Layanan
              </p>

            </div>

          </div>


          {/* PENGGUNA */}

          <div className="admin-stat-card">

            <span>
              👥
            </span>

            <div>

              <strong>
                {loadingStats
                  ? "..."
                  : statistics.users}
              </strong>

              <p>
                Total Pengguna
              </p>

            </div>

          </div>

        </div>


        {/* ==================================================
            WELCOME
        ================================================== */}

        <section className="admin-welcome">

          <h2>
            Kelola Website
          </h2>

          <p>
            Dari halaman ini admin dapat mengelola
            produk, artikel, layanan, dan data website
            PT Mitra Meditama Abadi.
          </p>


          {/* ==================================================
              QUICK ACTION
          ================================================== */}

          <div className="admin-actions">

            <button
              onClick={() =>
                navigate("/admin/tambahproduk")
              }
            >
              + Tambah Produk
            </button>


            <button
              onClick={() =>
                navigate("/admin/tambahartikel")
              }
            >
              + Tambah Artikel
            </button>


            <button
              onClick={() =>
                navigate("/admin/tambahlayanan")
              }
            >
              + Tambah Layanan
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;