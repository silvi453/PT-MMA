<div className="footer-contact">
  <h3>HUBUNGI KAMI</h3>

  <p>
    Jl. Simpang Danau Limboto Timur 2, Blok A5 - 132, Sawojajar,
    Kec. Kedungkandang, Kota Malang, Jawa Timur
  </p>

  <button
    type="button"
    onClick={() => {
      window.location.href = "tel:+6281234567890";
    }}
    style={{
      display: "block",
      background: "none",
      border: "none",
      padding: "10px 0",
      margin: "0 0 5px",
      color: "white",
      fontSize: "10px",
      cursor: "pointer",
      textAlign: "left",
    }}
  >
    📞 0812-3456-7890
  </button>

  <button
    type="button"
    onClick={() => {
      window.location.href =
        "mailto:admin@mitrameditamaabadi.com";
    }}
    style={{
      display: "block",
      background: "none",
      border: "none",
      padding: "10px 0",
      margin: "0 0 5px",
      color: "white",
      fontSize: "10px",
      cursor: "pointer",
      textAlign: "left",
    }}
  >
    📧 admin@mitrameditamaabadi.com
  </button>

  <p>Senin - Jumat: 08.00 - 17.00 WIB</p>
  <p>Sabtu: 08.00 - 14.00 WIB</p>
</div>