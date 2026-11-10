"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const OWNER_UID = "9u9fkqukZ7alG2bCPyD0k3a6gfZ2";

type OrderItem = {
  id?: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt?: {
    toDate: () => Date;
  } | null;
};

export default function AdminOrders() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeOrders: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.uid === OWNER_UID) {
        setAuthorized(true);

        if (!unsubscribeOrders) {
          const ordersQuery = query(collection(db, "orders"));

          unsubscribeOrders = onSnapshot(
            ordersQuery,
            (snapshot) => {
              const loadedOrders: Order[] = snapshot.docs.map((item) => {
                const data = item.data();

                return {
                  id: item.id,
                  items: Array.isArray(data.items) ? data.items : [],
                  total: Number(data.total) || 0,
                  status:
                    typeof data.status === "string"
                      ? data.status
                      : "Pending",
                  createdAt: data.createdAt ?? null,
                };
              });

              loadedOrders.sort((a, b) => {
                const dateA = a.createdAt?.toDate().getTime() ?? 0;
                const dateB = b.createdAt?.toDate().getTime() ?? 0;
                return dateB - dateA;
              });

              setOrders(loadedOrders);
              setLoading(false);
            },
            (error) => {
              console.error("Error loading orders:", error);
              setLoading(false);
            }
          );
        }
      } else {
        setAuthorized(false);
        router.replace("/admin/login");
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeOrders?.();
    };
  }, [router]);

  async function handleLogout() {
    await signOut(auth);
    router.replace("/admin/login");
  }

  async function updateOrderStatus(
    orderId: string,
    newStatus: string
  ) {
    try {
      setUpdating(orderId);

      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
      });

    } catch (error) {
      console.error("Error updating order:", error);
      alert("Could not update order. Please try again.");
    } finally {
      setUpdating(null);
    }
  }

  function formatDate(createdAt: Order["createdAt"]) {
    if (!createdAt) return "Date unavailable";

    try {
      return createdAt.toDate().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "Date unavailable";
    }
  }

  if (loading) {
    return <main style={centerStyle}>Loading orders...</main>;
  }

  if (!authorized) return null;

  return (
    <main style={mainStyle}>
      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>The Gift Jammers</h1>
          <p style={subtitleStyle}>Order Management</p>
        </div>

        <div style={headerButtons}>
          <button
            onClick={() => router.push("/admin")}
            style={backButton}
          >
            Dashboard
          </button>

          <button onClick={handleLogout} style={logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <section style={introStyle}>
        <p style={eyebrowStyle}>YOUR STORE</p>
        <h2 style={headingStyle}>Customer Orders 🛍️</h2>
        <p style={descriptionStyle}>
          View customer orders and manage their status from one place.
        </p>
      </section>

      <section style={statsGrid}>
        <div style={statCard}>
          <span style={statLabel}>Total Orders</span>
          <strong style={statNumber}>{orders.length}</strong>
        </div>

        <div style={statCard}>
          <span style={statLabel}>Pending Orders</span>
          <strong style={statNumber}>
            {orders.filter((order) => order.status === "Pending").length}
          </strong>
        </div>

        <div style={statCard}>
          <span style={statLabel}>Completed Orders</span>
          <strong style={statNumber}>
            {orders.filter((order) => order.status === "Completed").length}
          </strong>
        </div>
      </section>

      <section style={ordersSection}>
        <div style={ordersHeading}>
          <h2 style={sectionTitle}>All Orders</h2>
          <span style={orderCount}>{orders.length} orders</span>
        </div>

        {orders.length === 0 ? (
          <div style={emptyState}>
            <span style={{ fontSize: 45 }}>📦</span>
            <h3>No orders yet</h3>
            <p>
              Customer orders will appear here once the checkout
              system is connected to Firebase.
            </p>
          </div>
        ) : (
          <div style={ordersList}>
            {orders.map((order, index) => (
              <article key={order.id} style={orderCard}>
                <div style={orderTop}>
                  <div>
                    <span style={orderNumber}>
                      ORDER #{orders.length - index}
                    </span>
                    <p style={dateText}>
                      {formatDate(order.createdAt)}
                    </p>
                    <p style={idText}>ID: {order.id}</p>
                  </div>

                  <span
                    style={{
                      ...statusBadge,
                      background:
                        order.status === "Completed"
                          ? "#e0f4e6"
                          : order.status === "Cancelled"
                          ? "#fce4e4"
                          : order.status === "Confirmed"
                          ? "#e4edff"
                          : "#fff0d9",
                      color:
                        order.status === "Completed"
                          ? "#24743c"
                          : order.status === "Cancelled"
                          ? "#b63132"
                          : order.status === "Confirmed"
                          ? "#2856a3"
                          : "#9a6412",
                    }}
                  >
                    {order.status}
                  </span>
                </div>

                <div style={itemsSection}>
                  <h3 style={itemsTitle}>Products</h3>

                  {order.items.map((item, itemIndex) => (
                    <div
                      key={`${order.id}-${item.id ?? itemIndex}`}
                      style={itemRow}
                    >
                      <div style={itemInfo}>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            style={itemImage}
                          />
                        )}

                        <div>
                          <strong style={itemName}>
                            {item.name}
                          </strong>
                          <p style={itemDescription}>
                            {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                      </div>

                      <strong style={itemTotal}>
                        ₹{item.quantity * item.price}
                      </strong>
                    </div>
                  ))}
                </div>

                <div style={orderBottom}>
                  <div>
                    <span style={totalLabel}>Order Total</span>
                    <strong style={totalAmount}>
                      ₹{order.total}
                    </strong>
                  </div>

                  <div style={statusControls}>
                    <label style={selectLabel}>
                      Update status
                    </label>

                    <select
                      value={order.status}
                      disabled={updating === order.id}
                      onChange={(event) =>
                        updateOrderStatus(order.id, event.target.value)
                      }
                      style={statusSelect}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

const centerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#FFF9F5",
};

const mainStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#FFF9F5",
  padding: "30px 6%",
  color: "#29201D",
  fontFamily: "Arial, Helvetica, sans-serif",
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

const titleStyle: React.CSSProperties = {
  color: "#B63132",
  margin: 0,
  fontSize: 27,
};

const subtitleStyle: React.CSSProperties = {
  color: "#79513C",
  marginTop: 6,
};

const headerButtons: React.CSSProperties = {
  display: "flex",
  gap: 10,
};

const backButton: React.CSSProperties = {
  background: "#eaded6",
  color: "#4d342a",
  border: "none",
  borderRadius: 8,
  padding: "12px 18px",
  cursor: "pointer",
};

const logoutButton: React.CSSProperties = {
  background: "#B63132",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "12px 22px",
  cursor: "pointer",
};

const introStyle: React.CSSProperties = {
  marginTop: 35,
};

const eyebrowStyle: React.CSSProperties = {
  color: "#B63132",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 3,
};

const headingStyle: React.CSSProperties = {
  fontFamily: "Georgia, serif",
  fontSize: 34,
  margin: "8px 0",
};

const descriptionStyle: React.CSSProperties = {
  color: "#79513C",
};

const statsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: 15,
  marginTop: 30,
};

const statCard: React.CSSProperties = {
  background: "white",
  border: "1px solid #eaded6",
  borderRadius: 13,
  padding: 20,
};

const statLabel: React.CSSProperties = {
  display: "block",
  color: "#79513C",
  fontSize: 13,
};

const statNumber: React.CSSProperties = {
  display: "block",
  color: "#B63132",
  fontSize: 30,
  marginTop: 8,
};

const ordersSection: React.CSSProperties = {
  marginTop: 40,
};

const ordersHeading: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 10,
  marginBottom: 20,
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "Georgia, serif",
  fontSize: 25,
};

const orderCount: React.CSSProperties = {
  color: "#79513C",
  fontSize: 13,
};

const emptyState: React.CSSProperties = {
  background: "white",
  border: "1px solid #eaded6",
  borderRadius: 15,
  padding: "55px 20px",
  textAlign: "center",
  color: "#79513C",
};

const ordersList: React.CSSProperties = {
  display: "grid",
  gap: 20,
};

const orderCard: React.CSSProperties = {
  background: "white",
  border: "1px solid #eaded6",
  borderRadius: 15,
  padding: 22,
};

const orderTop: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 15,
  flexWrap: "wrap",
  borderBottom: "1px solid #f0e5df",
  paddingBottom: 15,
};

const orderNumber: React.CSSProperties = {
  color: "#B63132",
  fontWeight: 800,
  fontSize: 13,
  letterSpacing: 1,
};

const dateText: React.CSSProperties = {
  color: "#79513C",
  fontSize: 12,
  marginBottom: 4,
};

const idText: React.CSSProperties = {
  color: "#999",
  fontSize: 10,
  margin: 0,
  wordBreak: "break-all",
};

const statusBadge: React.CSSProperties = {
  padding: "7px 13px",
  borderRadius: 20,
  fontSize: 11,
  fontWeight: 700,
};

const itemsSection: React.CSSProperties = {
  padding: "18px 0",
};

const itemsTitle: React.CSSProperties = {
  fontSize: 15,
  marginTop: 0,
};

const itemRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  padding: "10px 0",
  borderBottom: "1px solid #f5eee9",
};

const itemInfo: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const itemImage: React.CSSProperties = {
  width: 48,
  height: 48,
  objectFit: "cover",
  borderRadius: 7,
};

const itemName: React.CSSProperties = {
  fontSize: 13,
};

const itemDescription: React.CSSProperties = {
  fontSize: 12,
  color: "#79513C",
  margin: "5px 0 0",
};

const itemTotal: React.CSSProperties = {
  fontSize: 13,
  whiteSpace: "nowrap",
};

const orderBottom: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 18,
  borderTop: "1px solid #eaded6",
  paddingTop: 18,
};

const totalLabel: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  color: "#79513C",
};

const totalAmount: React.CSSProperties = {
  display: "block",
  fontSize: 23,
  color: "#B63132",
  marginTop: 5,
};

const statusControls: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 7,
};

const selectLabel: React.CSSProperties = {
  fontSize: 11,
  color: "#79513C",
};

const statusSelect: React.CSSProperties = {
  border: "1px solid #dfc9bc",
  borderRadius: 7,
  padding: "10px 13px",
  background: "#fff9f5",
  color: "#29201D",
  cursor: "pointer",
};