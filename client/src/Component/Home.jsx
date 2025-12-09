import React, { useEffect, useRef } from "react";
import axios from "axios";

const menuItems = [
  {
    id: 1,
    name: "Truffle Butter Steak",
    price: "₹2,499",
    img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
    desc: "Premium Australian beef with truffle butter"
  },
  {
    id: 2,
    name: "Royal Seafood Platter",
    price: "₹3,199",
    img: "https://images.unsplash.com/photo-1553621042-f6e147245754",
    desc: "Lobster, prawns & exotic seafood"
  },
  {
    id: 3,
    name: "Golden Saffron Biryani",
    price: "₹1,899",
    img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a",
    desc: "Handcrafted royal dum biryani"
  }
];

const Home = () => {
  const menuRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      axios
        .get("http://localhost:3000/menu", {
          headers: { Authorization: `Bearer ${token}` }
        })
        .catch(() => {});
    }
  }, []);

  const scrollTo = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={styles.page}>

      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>THE ROYAL PLATE</h2>
        <div style={styles.navLinks}>
          <span onClick={() => scrollTo(menuRef)}>Menu</span>
          <span onClick={() => scrollTo(tableRef)}>Tables</span>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.overlay}>
          <h1 style={styles.heroTitle}>7-Star Fine Dining</h1>
          <p style={styles.heroSubtitle}>Luxury • Taste • Excellence</p>
        </div>
      </section>

      {/* MENU */}
      <section ref={menuRef} style={styles.menuSection}>
        <h2 style={styles.sectionTitle}>Signature Menu</h2>
        <div style={styles.grid}>
          {menuItems.map(item => (
            <div key={item.id} style={styles.card}>
              <img src={item.img} alt={item.name} style={styles.image} />
              <div style={styles.cardBody}>
                <h3>{item.name}</h3>
                <p style={styles.desc}>{item.desc}</p>
                <span style={styles.price}>{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TABLE SECTION */}
      <section ref={tableRef} style={styles.tableSection}>
        <h2 style={styles.sectionTitle}>Luxury Dining Tables</h2>
        <p style={styles.tableText}>
          Experience elite seating with private royal tables, candle-lit
          ambience and personalized service.
        </p>

        <div style={styles.tableGrid}>
          <div style={styles.tableCard}>Table 1 – VIP</div>
          <div style={styles.tableCard}>Table 2 – Royal Family</div>
          <div style={styles.tableCard}>Table 3 – Private Cabin</div>
          <div style={styles.tableCard}>Table 4 – Ocean View</div>
        </div>
      </section>

    </div>
  );
};

export default Home;

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    fontFamily: "Poppins, Arial",
    backgroundColor: "#0b0b0b",
    color: "#fff"
  },

  navbar: {
    position: "fixed",
    top: 0,
    width: "100%",
    height: "70px",
    background: "rgba(0,0,0,0.9)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    zIndex: 1000
  },
  logo: {
    color: "#d4af37",
    letterSpacing: "2px"
  },
  navLinks: {
    display: "flex",
    gap: "30px",
    cursor: "pointer"
  },

  hero: {
    height: "100vh",
    backgroundImage:
      'url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0")',
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  overlay: {
    height: "100%",
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
  },
  heroTitle: {
    fontSize: "4rem"
  },
  heroSubtitle: {
    color: "#d4af37",
    marginTop: "10px"
  },

  menuSection: {
    padding: "100px 40px"
  },
  tableSection: {
    padding: "100px 40px",
    background: "#111"
  },

  sectionTitle: {
    textAlign: "center",
    fontSize: "2.5rem",
    marginBottom: "50px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px"
  },
  card: {
    background: "#151515",
    borderRadius: "14px",
    overflow: "hidden"
  },
  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover"
  },
  cardBody: {
    padding: "20px"
  },
  desc: {
    color: "#bbb",
    fontSize: "0.9rem",
    margin: "10px 0"
  },
  price: {
    color: "#d4af37",
    fontWeight: "bold"
  },

  tableText: {
    textAlign: "center",
    maxWidth: "600px",
    margin: "0 auto 40px",
    color: "#ccc"
  },
  tableGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px"
  },
  tableCard: {
    background: "#1a1a1a",
    padding: "30px",
    textAlign: "center",
    borderRadius: "12px",
    border: "1px solid #d4af37"
  }
};
