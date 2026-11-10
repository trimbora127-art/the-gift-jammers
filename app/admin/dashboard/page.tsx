"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const OWNER_UID = "9u9fkqukZ7alG2bCPyD0k3a6gfZ2";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid === OWNER_UID) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        router.replace("/admin/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  async function handleLogout() {
    await signOut(auth);
    router.replace("/admin/login");
  }

  if (loading) {
    return <main style={centerStyle}>Loading dashboard...</main>;
  }

  if (!authorized) return null;

  const sections = [
    { icon: "📦", title: "Products", description: "Add, edit and manage products", path: "/admin/products" },
    { icon: "🛍️", title: "Orders", description: "View and manage customer orders", path: "/admin/orders" },
    { icon: "🏷️", title: "Categories", description: "Manage product categories", path: "/admin/categories" },
    { icon: "⚙️", title: "Settings", description: "Manage store settings", path: "/admin/settings" },
  ];

  return (
    <main style={mainStyle}>
      <header style={headerStyle}>
        <div>
          <h1 style={{ color: "#B63132", margin: 0 }}>
            The Gift Jammers
          </h1>
          <p style={{ color: "#79513C", marginTop: 6 }}>
            Admin Dashboard
          </p>
        </div>

        <button onClick={handleLogout} style={logoutStyle}>
          Logout
        </button>
      </header>

      <section style={{ marginTop: 40 }}>
        <h2>Welcome back! ❤️</h2>
        <p style={{ color: "#79513C" }}>
          Manage your gifting store from one place.
        </p>
      </section>

      <section style={gridStyle}>
        {sections.map((section) => (
          <button
            key={section.title}
            onClick={() => router.push(section.path)}
            style={cardStyle}
          >
            <span style={{ fontSize: 35 }}>{section.icon}</span>
            <h3 style={{ color: "#B63132" }}>{section.title}</h3>
            <p style={{ color: "#79513C" }}>
              {section.description}
            </p>
          </button>
        ))}
      </section>
    </main>
  );
}

const centerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
};

const mainStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#FFF9F5",
  padding: "35px",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 15,
  borderBottom: "1px solid #eaded6",
  paddingBottom: 20,
};

const logoutStyle: React.CSSProperties = {
  background: "#B63132",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "12px 22px",
  cursor: "pointer",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
  marginTop: 30,
};

const cardStyle: React.CSSProperties = {
  background: "white",
  border: "1px solid #eaded6",
  borderRadius: 15,
  padding: 25,
  textAlign: "left",
  cursor: "pointer",
};