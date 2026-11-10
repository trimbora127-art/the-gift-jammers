"use client";

import { useEffect, useState, type FormEvent } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminProducts() {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Bouquets");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/admin/login");
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!name.trim() || !price || Number(price) <= 0 || !image) {
      setMessage("Please enter the product name, valid price and image.");
      return;
    }

    if (!image.type.startsWith("image/") || image.size > 5 * 1024 * 1024) {
      setMessage("Choose an image up to 5 MB.");
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const formData = new FormData();
      formData.append("file", image);

      const token = await user.getIdToken();

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || "Image upload failed.");
      }

      await addDoc(collection(db, "products"), {
        name: name.trim(),
        price: Number(price),
        category,
        description: description.trim(),
        imageUrl: uploadResult.url,
        cloudinaryPublicId: uploadResult.publicId,
        createdAt: serverTimestamp(),
        active: true,
      });

      setMessage("Product added successfully!");
      setName("");
      setPrice("");
      setCategory("Bouquets");
      setDescription("");
      setImage(null);

      const fileInput = document.getElementById(
        "product-image"
      ) as HTMLInputElement | null;

      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return <main style={{ padding: 30 }}>Checking admin access...</main>;
  }

  return (
    <main
      style={{
        maxWidth: 650,
        margin: "40px auto",
        padding: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ color: "#702b43", fontSize: 28 }}>
        Manage Products
      </h1>

      <p style={{ color: "#666", marginBottom: 25 }}>
        Add a new product to The Gift Jammers store.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
        <label>
          Product Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            required
            style={inputStyle}
          />
        </label>

        <label>
          Price (₹)
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            required
            style={inputStyle}
          />
        </label>

        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          >
            <option>Bouquets</option>
            <option>Hampers</option>
            <option>Polaroids</option>
            <option>Frames</option>
            <option>Personalised Gifts</option>
          </select>
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the product"
            rows={4}
            style={inputStyle}
          />
        </label>

        <label>
          Product Image (maximum 5 MB)
          <input
            id="product-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            required
            style={{ ...inputStyle, padding: 10 }}
          />
        </label>

        {message && (
          <p role="status" style={{ color: "#702b43" }}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 14,
            background: "#702b43",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Saving Product..." : "Save Product"}
        </button>
      </form>
    </main>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: 12,
  marginTop: 7,
  border: "1px solid #ddd",
  borderRadius: 7,
  boxSizing: "border-box" as const,
};