import SectionTitle from "../components/SectionTitle";

const articles = [
  {
    title: "Cara Memilih Alat Kesehatan yang Berkualitas",
    date: "12 Juni 2024",
    category: "Tips Kesehatan",
  },
  {
    title: "Pentingnya Perawatan Alat Medis",
    date: "05 Juni 2024",
    category: "Perawatan",
  },
  {
    title: "Teknologi Terbaru dalam Dunia Medis",
    date: "28 Mei 2024",
    category: "Teknologi",
  },
];

function Artikel() {
  return (
    <section className="page-section">

      <div className="container">

        <SectionTitle title="ARTIKEL" />

        <div className="article-grid">

          {articles.map((article) => (

            <article
              className="article-card"
              key={article.title}
            >

              <div className="article-image">
                📰
              </div>

              <div className="article-content">

                <span>
                  {article.category}
                </span>

                <h3>
                  {article.title}
                </h3>

                <p>
                  {article.date}
                </p>

                <button>
                  Baca Selengkapnya →
                </button>

              </div>

            </article>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Artikel;