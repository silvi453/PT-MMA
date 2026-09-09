import { useEffect, useState } from "react";
import SectionTitle from "../components/SectionTitle";

const API_URL = "http://127.0.0.1:8000/api/articles";
const IMAGE_URL = "http://127.0.0.1:8000/storage/";

function Artikel() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil data artikel");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Data artikel:", data);

        setArticles(
          Array.isArray(data)
            ? data
            : data.data || []
        );
      })
      .catch((error) => {
        console.error("Error mengambil artikel:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="page-section">

      <div className="container">

        <SectionTitle title="ARTIKEL" />

        {loading ? (
          <p>Memuat artikel...</p>
        ) : articles.length === 0 ? (
          <p>Belum ada artikel.</p>
        ) : (

          <div className="article-grid">

            {articles.map((article) => (

              <article
                className="article-card"
                key={article.id}
              >

                <div className="article-image">

                  {article.image ? (
                    <img
                      src={`${IMAGE_URL}${article.image}`}
                      alt={article.title}
                    />
                  ) : (
                    "📰"
                  )}

                </div>

                <div className="article-content">

                  <span>
                    {article.category}
                  </span>

                  <h3>
                    {article.title}
                  </h3>

                  <p>
                    {article.summary}
                  </p>

                  <button>
                    Baca Selengkapnya →
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </div>

    </section>
  );
}

export default Artikel;

