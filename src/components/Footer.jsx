import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="container footer-content">

        {/* PERUSAHAAN */}
        <div className="footer-company">

          <div className="footer-logo">

            <div className="footer-logo-icon">
              ✚
            </div>

            <strong>
              PT MITRA MEDITAMA ABADI
            </strong>

          </div>

          <p>
            Solusi kesehatan terpercaya untuk
            distribusi fasilitas kesehatan
            di seluruh Indonesia.
          </p>

        </div>


        {/* HUBUNGI KAMI */}
        <div className="footer-column footer-contact">

          <h3>HUBUNGI KAMI</h3>

          <p>
            📍 Jl. Simpang Danau Limboto Timur 2,
            Blok A5 - 132, Sawojajar,
            Kec. Kedungkandang, Kota Malang,
            Jawa Timur
          </p>

          <p>
            ☎ (0341) 727299
          </p>

          <p>
            ✉ adm.mitrameditamaabadi@gmail.com
          </p>

          <p>
            🕐 Senin - Jumat: 08.00 - 17.00 WIB
          </p>

        </div>

      </div>


      {/* COPYRIGHT */}
      <div className="copyright">
        © 2026 PT Mitra Meditama Abadi. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;