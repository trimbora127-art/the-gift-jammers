"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Replace this with the owner's actual Firebase UID
  const OWNER_UID = "9u9fkqukZ7alG2bCPyD0k3a6gfZ2";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (result.user.uid !== OWNER_UID) {
        await signOut(auth);
        setError("You are not authorised to access this dashboard.");
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#FFF9F5",
      padding: "20px"
    }}>
      <form onSubmit={handleLogin} style={{
        width: "100%",
        maxWidth: "420px",
        background: "white",
        padding: "40px",
        borderRadius: "18px",
        boxShadow: "0 10px 40px #00000012"
      }}>
        <h1 style={{ color: "#B63132", fontSize: "30px" }}>
          The Gift Jammers
        </h1>

        <p style={{ color: "#79513C", marginBottom: "28px" }}>
          Admin Dashboard Login
        </p>

        <label>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        {error && (
          <p style={{ color: "red", marginTop: "15px" }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} style={{
          width: "100%",
          padding: "14px",
          marginTop: "22px",
          background: "#B63132",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "13px",
  margin: "9px 0 20px",
  border: "1px solid #ddd",
  borderRadius: "7px",
  boxSizing: "border-box"
};