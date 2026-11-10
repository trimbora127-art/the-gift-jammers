"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Product = {
  id: string | number;
  name: string;
  price: number;
  category: string;
  image: string;
  isPolaroid?: boolean;
};

type CartItem = Product & {
  quantity: number;
};

const products: Product[] = [
  // POLAROIDS
  {
    id: 1,
    name: "Small Polaroid Prints",
    price: 3,
    category: "Polaroids",
    image: "/products/small-polaroid.jpg",
    isPolaroid: true,
  },
  {
    id: 2,
    name: "Medium Polaroid Prints",
    price: 6,
    category: "Polaroids",
    image: "/products/medium-polaroid.jpg",
    isPolaroid: true,
  },
  {
    id: 3,
    name: "Large Polaroid Prints",
    price: 8,
    category: "Polaroids",
    image: "/products/large-polaroid.jpg",
    isPolaroid: true,
  },

  // PHOTO FRAMES
  {
    id: 4,
    name: "Photo Collage Frame",
    price: 329,
    category: "Photo Frames",
    image: "/products/photo-collage-frame-329.jpg",
  },
  {
    id: 5,
    name: "Square Photo Frame",
    price: 110,
    category: "Photo Frames",
    image: "/products/square-photo-frame-110.jpg",
  },
  {
    id: 6,
    name: "6 × 4 Photo Frame",
    price: 250,
    category: "Photo Frames",
    image: "/products/6x4-photo-frame-250.jpg",
  },
  {
    id: 7,
    name: "Wooden Photo Frame",
    price: 350,
    category: "Photo Frames",
    image: "/products/wooden-photo-frame-350.jpg",
  },

  // BOUQUETS
  {
    id: 8,
    name: "Red Rose Bouquet",
    price: 750,
    category: "Bouquets",
    image: "/products/red-rose-bouquet-750.jpg",
  },
  {
    id: 9,
    name: "Teddy Bouquet",
    price: 529,
    category: "Bouquets",
    image: "/products/teddy-bouquet-529.jpg",
  },
  {
    id: 10,
    name: "15 Pics Bouquet",
    price: 350,
    category: "Bouquets",
    image: "/products/15-pics-bouquet-350.jpg",
  },
  {
    id: 11,
    name: "20 Pics with Chocolate Bouquet",
    price: 400,
    category: "Bouquets",
    image: "/products/20-pics-with-chocolate-400.jpg",
  },
  {
    id: 12,
    name: "Custom Bouquet for Your Girl",
    price: 800,
    category: "Bouquets",
    image: "/products/custom-bouquet-for-your-girl-800.jpg",
  },
  {
    id: 18,
    name: "Clip Bouquet",
    price: 599,
    category: "Bouquets",
    image: "/products/clip-bouquet-599.jpg",
  },
  {
    id: 19,
    name: "Polaroid Bouquet with Ribbon Flower",
    price: 370,
    category: "Bouquets",
    image: "/products/polaroid-bouquet-with-ribbon-flower-370.jpg",
  },
  {
    id: 20,
    name: "Mini Bouquet",
    price: 59,
    category: "Bouquets",
    image: "/products/mini-bouquet-59.jpg",
  },
  {
    id: 21,
    name: "Hot Wheels Bouquet",
    price: 1100,
    category: "Bouquets",
    image: "/products/hot-wheels-bouquet-1100.jpg",
  },

  // HAMPERS
  {
    id: 13,
    name: "Birthday Hamper Bag",
    price: 800,
    category: "Hampers",
    image: "/products/birthday-hamper-bag-800.jpg",
  },
  {
    id: 14,
    name: "Polaroid Clips & Lights Hamper Box",
    price: 150,
    category: "Hampers",
    image: "/products/polaroid-clips-lights-hamper-box-150.jpg",
  },
  {
    id: 15,
    name: "Teddy, Chocolates, Flowers & Studs Hamper",
    price: 2400,
    category: "Hampers",
    image: "/products/teddy-chocolate-flowers-studs-hamper-2400.jpg",
  },
  {
    id: 16,
    name: "Hoodie Hamper Box",
    price: 2150,
    category: "Hampers",
    image: "/products/hoodie-hamper-box-2150.jpg",
  },
  {
    id: 22,
    name: "Hamper with Titan Watch",
    price: 5500,
    category: "Hampers",
    image: "/products/hamper-with-titan-watch-5500.jpg",
  },
  {
    id: 23,
    name: "T-Shirt Hamper",
    price: 2000,
    category: "Hampers",
    image: "/products/t-shirt-hamper-2000.jpg",
  },
  {
    id: 24,
    name: "Customized Hamper",
    price: 2800,
    category: "Hampers",
    image: "/products/customized-hamper-2800.jpg",
  },
  {
    id: 25,
    name: "Mega Combo Hamper",
    price: 2000,
    category: "Hampers",
    image: "/products/mega-combo-hamper-2000.jpg",
  },

  // PERSONALISED GIFTS
  {
    id: 17,
    name: "Customised Magazine",
    price: 210,
    category: "Personalised Gifts",
    image: "/products/customised-magazine-210.jpg",
  },
  {
    id: 26,
    name: "Birthday Card",
    price: 150,
    category: "Personalised Gifts",
    image: "/products/birthday-card-150.jpg",
  },
];

const categories = [
  "All",
  "Polaroids",
  "Photo Frames",
  "Bouquets",
  "Hampers",
  "Personalised Gifts",
];

const WHATSAPP_NUMBER = "9487041090";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>(products);
  const [orderLoading, setOrderLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // LOAD ADMIN PRODUCTS FROM FIREBASE
  useEffect(() => {
    const productsQuery = query(
      collection(db, "products"),
      where("active", "==", true)
    );

    const unsubscribe = onSnapshot(
      productsQuery,
      (snapshot) => {
        const firebaseProducts: Product[] = snapshot.docs
          .map((doc) => {
            const data = doc.data();

            if (
              typeof data.name !== "string" ||
              typeof data.category !== "string" ||
              typeof data.imageUrl !== "string" ||
              !data.imageUrl ||
              !Number.isFinite(Number(data.price))
            ) {
              return null;
            }

            return {
              id: doc.id,
              name: data.name,
              price: Number(data.price),
              category: data.category,
              image: data.imageUrl,
              isPolaroid: data.category === "Polaroids",
            };
          })
          .filter((product): product is Product => product !== null);

        setAllProducts(
          [...products, ...firebaseProducts].sort(
            (a, b) => a.price - b.price
          )
        );
      },
      (error) => {
        console.error("Error loading Firebase products:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const sortedProducts = [...allProducts].sort(
    (a, b) => a.price - b.price
  );

  const filteredProducts =
    selectedCategory === "All"
      ? sortedProducts
      : sortedProducts.filter(
          (product) => product.category === selectedCategory
        );

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function addToCart(product: Product) {
    const startingQuantity = product.isPolaroid ? 15 : 1;

    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + startingQuantity,
              }
            : item
        );
      }

      return [
        ...currentCart,
        { ...product, quantity: startingQuantity },
      ];
    });

    setCheckoutError("");
    setShowCart(true);
  }

  function increaseQuantity(id: string | number) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(id: string | number) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id: string | number) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  }

  // SAVE ORDER TO FIRESTORE AND THEN OPEN WHATSAPP
  async function placeOrder() {
    if (cart.length === 0 || orderLoading) return;

    setCheckoutError("");
    setOrderLoading(true);

    const orderItems = cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    const orderTotal = cartTotal;

    const orderDetails = orderItems
      .map(
        (item) =>
          `${item.name} - ${item.quantity} x ₹${item.price} = ₹${
            item.quantity * item.price
          }`
      )
      .join("\n");

    const message =
      `Hello The Gift Jammers! I would like to place an order.\n\n` +
      `${orderDetails}\n\n` +
      `Total: ₹${orderTotal}\n\n` +
      `Please share the next steps.`;

    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    // Open a blank tab immediately to avoid popup blocking.
    const whatsappWindow = window.open("about:blank", "_blank");

    try {
      await addDoc(collection(db, "orders"), {
        items: orderItems,
        total: orderTotal,
        status: "Pending",
        createdAt: serverTimestamp(),
        source: "website",
      });

      // Open WhatsApp only after Firebase successfully saves the order.
      if (whatsappWindow) {
        whatsappWindow.location.href = whatsappURL;
      } else {
        window.location.href = whatsappURL;
      }

      setCart([]);
      setShowCart(false);
    } catch (error) {
      console.error("Error saving order:", error);

      if (whatsappWindow) {
        whatsappWindow.close();
      }

      setCheckoutError(
        "Your order could not be saved. Please check your internet connection and try again."
      );
    } finally {
      setOrderLoading(false);
    }
  }

  return (
    <main className="products-page">
      <div className="announcement">
        Every Gift Tells a Story ❤️
      </div>

      <header className="site-header">
        <a href="/" className="brand">
          THE GIFT JAMMERS
          <span>Thoughtful Gifts, Beautiful Memories</span>
        </a>

        <nav>
          <a href="/">Home</a>
          <a href="/products">Shop</a>
          <button
            className="cart-button"
            onClick={() => setShowCart(!showCart)}
          >
            🛍️ Cart ({cartCount})
          </button>
        </nav>
      </header>

      <section className="page-hero">
        <p className="eyebrow">A LITTLE SOMETHING SPECIAL</p>
        <h1>Our Gift Collection</h1>
        <p>
          Find something thoughtful for every person and every occasion.
        </p>
      </section>

      <section className="shop-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MADE WITH LOVE</p>
            <h2>Explore Our Products</h2>
          </div>

          <button
            className="cart-button mobile-cart"
            onClick={() => setShowCart(!showCart)}
          >
            🛍️ Cart ({cartCount})
          </button>
        </div>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "filter active"
                  : "filter"
              }
            >
              {category}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />
              </div>

              <div className="product-info">
                <span className="product-category">
                  {product.category}
                </span>

                <h3>{product.name}</h3>

                <p className="product-price">
                  ₹{product.price}
                  {product.isPolaroid && (
                    <span> / print</span>
                  )}
                </p>

                {product.isPolaroid && (
                  <p className="minimum-note">
                    Minimum order: 15 prints per size
                  </p>
                )}

                <button
                  className="add-button"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart +
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {showCart && (
        <div
          className="cart-overlay"
          onClick={() => !orderLoading && setShowCart(false)}
        >
          <aside
            className="cart-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cart-heading">
              <div>
                <p className="eyebrow">YOUR SELECTION</p>
                <h2>Your Cart</h2>
              </div>

              <button
                className="close-button"
                onClick={() => setShowCart(false)}
                disabled={orderLoading}
                aria-label="Close cart"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <span>🛍️</span>
                <h3>Your cart is empty</h3>
                <p>Add something lovely to get started!</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.image} alt={item.name} />

                      <div className="cart-item-details">
                        <h3>{item.name}</h3>
                        <p>₹{item.price} each</p>

                        <div className="quantity-controls">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            disabled={
                              orderLoading ||
                              (item.isPolaroid
                                ? item.quantity <= 15
                                : item.quantity <= 1)
                            }
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() => increaseQuantity(item.id)}
                            disabled={orderLoading}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {item.isPolaroid && (
                          <small>Minimum 15 prints per size</small>
                        )}

                        <button
                          className="remove-button"
                          onClick={() => removeFromCart(item.id)}
                          disabled={orderLoading}
                        >
                          Remove
                        </button>
                      </div>

                      <strong>
                        ₹{item.price * item.quantity}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="total-row">
                    <span>Total</span>
                    <strong>₹{cartTotal}</strong>
                  </div>

                  <p>
                    Delivery charges, if applicable, will be confirmed
                    separately.
                  </p>

                  {checkoutError && (
                    <p className="checkout-error" role="alert">
                      {checkoutError}
                    </p>
                  )}

                  <button
                    className="checkout-button"
                    onClick={placeOrder}
                    disabled={orderLoading}
                  >
                    {orderLoading
                      ? "Saving Your Order..."
                      : "Order via WhatsApp →"}
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      <footer className="site-footer">
        <h2>THE GIFT JAMMERS</h2>
        <p>Every Gift Tells a Story.</p>
        <p>Coimbatore · Shipping across India</p>
        <a href="mailto:thegiftjammers@gmail.com">
          thegiftjammers@gmail.com
        </a>
        <p className="copyright">
          © 2026 The Gift Jammers. All rights reserved.
        </p>
      </footer>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .products-page {
          min-height: 100vh;
          background: #fff9f5;
          color: #171717;
          font-family: Arial, Helvetica, sans-serif;
        }

        .announcement {
          background: #b63132;
          color: white;
          text-align: center;
          padding: 10px;
          font-size: 13px;
          letter-spacing: 1px;
        }

        .site-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 22px 7%;
          background: #fff;
          border-bottom: 1px solid #f0e5df;
          gap: 20px;
        }

        .brand {
          font-size: 20px;
          font-weight: 900;
          letter-spacing: 2px;
          color: #b63132;
          text-decoration: none;
        }

        .brand span {
          display: block;
          font-size: 10px;
          color: #79513c;
          font-weight: 400;
          letter-spacing: 1px;
          margin-top: 5px;
        }

        nav {
          display: flex;
          align-items: center;
          gap: 25px;
        }

        nav a {
          color: #171717;
          text-decoration: none;
          font-size: 14px;
        }

        .cart-button {
          border: 0;
          background: #b63132;
          color: white;
          padding: 12px 19px;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 600;
        }

        .page-hero {
          text-align: center;
          padding: 75px 20px;
          background: linear-gradient(135deg, #f9e9df, #fff9f5);
        }

        .eyebrow {
          color: #b63132;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
        }

        .page-hero h1 {
          font-family: Georgia, serif;
          font-size: clamp(38px, 6vw, 65px);
          margin: 15px 0;
          color: #29201d;
        }

        .page-hero > p:last-child {
          color: #79513c;
          font-size: 15px;
        }

        .shop-section {
          max-width: 1400px;
          padding: 65px 7%;
          margin: auto;
        }

        .section-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-heading h2 {
          font-family: Georgia, serif;
          font-size: 34px;
          margin-top: 8px;
        }

        .mobile-cart {
          display: none;
        }

        .category-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 30px 0;
        }

        .filter {
          border: 1px solid #dfc9bc;
          background: transparent;
          color: #79513c;
          padding: 10px 19px;
          border-radius: 30px;
          cursor: pointer;
          transition: 0.25s;
        }

        .filter:hover,
        .filter.active {
          background: #b63132;
          color: white;
          border-color: #b63132;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 25px;
        }

        .product-card {
          background: white;
          border-radius: 13px;
          overflow: hidden;
          border: 1px solid #f0e5df;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 35px rgba(80, 40, 20, 0.1);
        }

        .product-image {
          width: 100%;
          aspect-ratio: 1 / 1;
          background: #f5eae3;
          overflow: hidden;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .product-card:hover .product-image img {
          transform: scale(1.06);
        }

        .product-info {
          padding: 17px;
        }

        .product-category {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #b63132;
          font-weight: 700;
        }

        .product-info h3 {
          font-size: 16px;
          line-height: 1.4;
          min-height: 44px;
          margin: 9px 0;
        }

        .product-price {
          font-size: 19px;
          font-weight: 800;
          color: #b63132;
          margin: 8px 0;
        }

        .product-price span {
          font-size: 12px;
          font-weight: 400;
          color: #79513c;
        }

        .minimum-note {
          font-size: 11px;
          color: #79513c;
          margin: 8px 0;
        }

        .add-button {
          width: 100%;
          background: #171717;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 5px;
          margin-top: 10px;
          cursor: pointer;
          transition: 0.25s;
        }

        .add-button:hover {
          background: #b63132;
        }

        .cart-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: flex-end;
        }

        .cart-panel {
          background: #fff9f5;
          width: 100%;
          max-width: 470px;
          height: 100%;
          padding: 25px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .cart-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eadbd1;
          padding-bottom: 18px;
        }

        .cart-heading h2 {
          font-family: Georgia, serif;
          margin: 5px 0;
        }

        .close-button {
          border: 0;
          background: #f0e1d8;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          cursor: pointer;
        }

        .empty-cart {
          text-align: center;
          margin: auto;
          color: #79513c;
        }

        .empty-cart span {
          font-size: 45px;
        }

        .cart-items {
          overflow-y: auto;
          flex: 1;
          padding: 15px 0;
        }

        .cart-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 15px 0;
          border-bottom: 1px solid #eadbd1;
        }

        .cart-item > img {
          width: 75px;
          height: 75px;
          object-fit: cover;
          border-radius: 8px;
        }

        .cart-item-details {
          flex: 1;
          min-width: 0;
        }

        .cart-item-details h3 {
          font-size: 13px;
          margin: 0 0 5px;
        }

        .cart-item-details p {
          font-size: 12px;
          color: #79513c;
          margin: 4px 0;
        }

        .cart-item > strong {
          font-size: 13px;
          white-space: nowrap;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 9px 0;
        }

        .quantity-controls button {
          width: 27px;
          height: 27px;
          border: 1px solid #dfc9bc;
          background: white;
          border-radius: 5px;
          cursor: pointer;
          font-size: 17px;
        }

        .quantity-controls button:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .quantity-controls span {
          font-size: 13px;
          font-weight: 700;
        }

        .cart-item-details small {
          display: block;
          font-size: 10px;
          color: #79513c;
        }

        .remove-button {
          border: 0;
          background: transparent;
          color: #b63132;
          font-size: 11px;
          padding: 5px 0;
          cursor: pointer;
        }

        .cart-footer {
          border-top: 1px solid #eadbd1;
          padding-top: 18px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          font-size: 19px;
          font-weight: 800;
        }

        .cart-footer > p {
          font-size: 11px;
          color: #79513c;
          line-height: 1.5;
        }

        .checkout-error {
          color: #b63132 !important;
          font-size: 12px !important;
          font-weight: 600;
        }

        .checkout-button {
          width: 100%;
          background: #b63132;
          color: white;
          border: 0;
          padding: 15px;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 10px;
        }

        .checkout-button:hover {
          background: #8f2425;
        }

        .checkout-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .site-footer {
          background: #171717;
          color: white;
          text-align: center;
          padding: 50px 20px;
        }

        .site-footer h2 {
          color: #f2c5ae;
          letter-spacing: 3px;
        }

        .site-footer p,
        .site-footer a {
          color: #e6d7cf;
          font-size: 13px;
          line-height: 1.8;
        }

        .site-footer a {
          text-decoration: none;
        }

        .copyright {
          margin-top: 25px;
          opacity: 0.6;
        }

        @media (max-width: 1000px) {
          .product-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .site-header {
            padding: 17px 5%;
          }

          .brand {
            font-size: 15px;
          }

          .brand span {
            font-size: 8px;
          }

          nav {
            gap: 12px;
          }

          nav a {
            font-size: 12px;
          }

          nav .cart-button {
            display: none;
          }

          .mobile-cart {
            display: block;
            font-size: 11px;
            padding: 10px 13px;
          }

          .page-hero {
            padding: 55px 18px;
          }

          .shop-section {
            padding: 45px 5%;
          }

          .section-heading h2 {
            font-size: 26px;
          }

          .category-filters {
            gap: 8px;
          }

          .filter {
            padding: 9px 13px;
            font-size: 11px;
          }

          .product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }

          .product-info {
            padding: 12px;
          }

          .product-info h3 {
            font-size: 13px;
            min-height: 38px;
          }

          .product-price {
            font-size: 17px;
          }

          .add-button {
            font-size: 12px;
            padding: 11px 5px;
          }

          .cart-panel {
            padding: 18px;
          }
        }
      `}</style>
    </main>
  );
}