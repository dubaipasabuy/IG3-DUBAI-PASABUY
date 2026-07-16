import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Plus,
  Minus,
  X,
  CheckCircle2,
  Store,
  ArrowLeft,
  Sparkles,
  Loader2,
  Lock,
  Package,
  Truck,
  Clock,
  Pencil,
  Trash2,
  Save,
  Upload,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap');
`;

// NOTE: this is a simple client-side gate for a casual demo shop, not real
// security — anyone who reads the code can see this password. If you deploy
// this for real orders, swap it for a proper login on a real backend.
const ADMIN_PASSWORD = "sweettreats123";

const STATUS_FLOW = ["Received", "Packed", "Sent"];
const STATUS_STYLE = {
  Received: { bg: "#FFF3D6", fg: "#8A6656", icon: Clock },
  Packed: { bg: "#DCEBFF", fg: "#2A5D9F", icon: Package },
  Sent: { bg: "#CFF5E7", fg: "#1E6B54", icon: Truck },
};

const CATEGORY_ICONS = {
  "Tea & Coffee": "☕",
  "Sauces & Pantry": "🌶️",
  "Chips & Snacks": "🥔",
  "Candy & Gummies": "🍬",
  "Chocolate & Biscuits": "🍫",
};

const TINTS = ["#FFE1EE", "#E7FBEA", "#FDF0FF", "#FFF6DC", "#F3E3D3", "#FBEAD9", "#EFE0DA", "#FBEBD0", "#FFF3D6", "#FFE3DC", "#FFE9D2", "#FFF3C4"];

const RAW_SEED = [
  // Tea & Coffee
  ["Tea & Coffee", "Hillway Karak Chai Masala with Ginger 20+4 Sachets"],
  ["Tea & Coffee", "Hillway Karak Chai Masala with Ginger 20 Sachets"],
  ["Tea & Coffee", "Alitea Signature Ginger Tea 12 Sachets"],
  ["Tea & Coffee", "Alitea Signature Ginger Tea 3-in-1 20+5 Sachets"],
  ["Tea & Coffee", "Alicafe Instant Coffee with Essence of Ginseng"],
  ["Tea & Coffee", "Alicafe Italian Roast 3-in-1 30 Sachets"],
  ["Tea & Coffee", "Alicafe French Roast Salted Caramel Latte 10 Sachets"],
  ["Tea & Coffee", "Alicafe French Roast Skinny Latte 10 Sachets"],
  ["Tea & Coffee", "Hillway Karak Chai Cardamom 20+4 Sachets"],
  ["Tea & Coffee", "Hillway Karak Chai Cardamom 20 Sachets"],
  // Sauces & Pantry
  ["Sauces & Pantry", "Heinz Corned Beef Special Offer 340g"],
  ["Sauces & Pantry", "Tabasco Sriracha 300g"],
  ["Sauces & Pantry", "Tabasco Hot Sauce Salsa Picante & Buffalo Style 250ml"],
  ["Sauces & Pantry", "Sriracha Hot Chilli Sauce 455ml"],
  ["Sauces & Pantry", "Nando's Peri-Peri Sauce (XX Hot, Extra Hot, Hot, Medium, Garlic, Wild Herb, Honey & Soy, Mozambican Paprika, Mild)"],
  // Chips & Snacks
  ["Chips & Snacks", "Krokant with Almonds 500g"],
  ["Chips & Snacks", "Carameo 500g"],
  ["Chips & Snacks", "Furor Glazed Candy with Soft Caramel, Nougat & Peanuts 500g"],
  ["Chips & Snacks", "Ruffles Original / Cheddar & Sour Cream"],
  ["Chips & Snacks", "Doritos Sweet Chili Pepper"],
  ["Chips & Snacks", "Doritos Flamin' Hot"],
  ["Chips & Snacks", "Lay's Mexican, Saudi, Brazilian, French"],
  // Candy & Gummies
  ["Candy & Gummies", "Hershey's Choco Bites Cookies 'n Cream"],
  ["Candy & Gummies", "Reese's Dipped Pretzels"],
  ["Candy & Gummies", "Galaxy Dates Assorted"],
  ["Candy & Gummies", "Warheads Jelly Beans / Wedgies"],
  ["Candy & Gummies", "Warheads Cubes"],
  ["Candy & Gummies", "Warheads Cubes Sour Berry Mix"],
  ["Candy & Gummies", "Alien Sour Space Gummies Strawberry/Blueberry 100g"],
  ["Candy & Gummies", "Sour Smog Balls 85g"],
  ["Candy & Gummies", "Toxic Waste Sour Candy 48g"],
  ["Candy & Gummies", "Warheads Tongue Splash Strawberry/Blue Raspberry 40g"],
  ["Candy & Gummies", "4D Vegan Gummy Blocks 65g"],
  ["Candy & Gummies", "Peelerz Gummy Peach/Mango/Banana 65g"],
  // Chocolate & Biscuits
  ["Chocolate & Biscuits", "Reese's Mini Unwrapped"],
  ["Chocolate & Biscuits", "Reese's Miniature Cups"],
  ["Chocolate & Biscuits", "Tiffany Break Time 10 Packs"],
  ["Chocolate & Biscuits", "Nutella Biscuits"],
  ["Chocolate & Biscuits", "Les Tablettes Pocket Chocolat au Lait"],
  ["Chocolate & Biscuits", "Les Tablettes Goût Noisette (Hazelnut)"],
  ["Chocolate & Biscuits", "Les Tablettes au Chocolat Blanc"],
  ["Chocolate & Biscuits", "Les Tablettes Coeur au Lait"],
  ["Chocolate & Biscuits", "Nestlé Choco Trio"],
  ["Chocolate & Biscuits", "Kinder Kinderini 250g"],
  ["Chocolate & Biscuits", "Barni Choco-Hazelnut / Chocolate / Milk"],
  ["Chocolate & Biscuits", "Kinder Cards 256g"],
  ["Chocolate & Biscuits", "Kinder Duo 150g"],
  ["Chocolate & Biscuits", "Nutella & Go with Breadsticks"],
  ["Chocolate & Biscuits", "Bahlsen Waffeletten Mini Choco Wafer Rolls 130g"],
  ["Chocolate & Biscuits", "Bahlsen Hazelnut Cream & Choc 100g"],
  ["Chocolate & Biscuits", "Lindt Salted Caramel 100g"],
  ["Chocolate & Biscuits", "Lindt Dark Smooth Dark Chocolate 80g"],
  ["Chocolate & Biscuits", "Lindt Pistachio 100g"],
  ["Chocolate & Biscuits", "Walker's Shortbread Thistle Rounds 150g"],
  ["Chocolate & Biscuits", "Venice Assorted 90g"],
  ["Chocolate & Biscuits", "KitKat Chunky Loaded Choco Fudge Brownie / Caramel Sundae"],
  ["Chocolate & Biscuits", "KitKat Caramel Crisp"],
  ["Chocolate & Biscuits", "KitKat Classic 120g"],
  ["Chocolate & Biscuits", "Galaxy Fusion Peach Cacao / Raspberry Meringue / Sea Salt 100g"],
  ["Chocolate & Biscuits", "Galaxy Fusion Peach Cacao / Sea Salt / Dark Chocolate 35g"],
  ["Chocolate & Biscuits", "Terry's Chocolate Orange 200g"],
  ["Chocolate & Biscuits", "Galaxy Flutes 24x Flutes"],
  ["Chocolate & Biscuits", "Galaxy Ripple"],
  ["Chocolate & Biscuits", "Galaxy Cookie Crumble 180g"],
  ["Chocolate & Biscuits", "Galaxy Smooth Milk 36g x 5"],
  ["Chocolate & Biscuits", "Galaxy Smooth Dark 5 x 40g"],
  ["Chocolate & Biscuits", "Galaxy Smooth White 5 x 38g"],
  ["Chocolate & Biscuits", "Ovalmaltine Petit Beurre Noir"],
  ["Chocolate & Biscuits", "Ovalmaltine Crunchy Biscuit"],
  ["Chocolate & Biscuits", "Ovalmaltine Crunchy"],
  ["Chocolate & Biscuits", "KitKat Pops"],
  ["Chocolate & Biscuits", "KitKat Miniatures Mango Mania / Strawberry Fiesta"],
  ["Chocolate & Biscuits", "Kinder Schoko-Bons Crispy Family Bag 16"],
  ["Chocolate & Biscuits", "Kinder Schoko-Bons Crispy Party Bag 30"],
  ["Chocolate & Biscuits", "Kinder Schoko-Bons 125g"],
  ["Chocolate & Biscuits", "Kinder Schoko-Bons 225g"],
  ["Chocolate & Biscuits", "Kinder Schoko-Bons White 200g"],
  ["Chocolate & Biscuits", "Kinder Tronky"],
  ["Chocolate & Biscuits", "Nutella Biscuits 304g"],
];

const SEED_PRODUCTS = RAW_SEED.map(([cat, name], i) => ({
  id: `p${i + 1}`,
  cat,
  name,
  desc: "",
  price: 10,
  icon: CATEGORY_ICONS[cat] || "🛍️",
  tint: TINTS[i % TINTS.length],
  image: "",
}));

function formatMoney(n) {
  return `₱${Number(n).toFixed(2)}`;
}

// Reads an image file, downsizes it, and returns a compressed base64 data URL
// so we can store real uploaded photos without blowing past storage limits.
function compressImageFile(file, maxDim = 320, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not load image"));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// Logo as an inline component so it scales cleanly at any size
function Logo({ className }) {
  return (
    <svg className={className} viewBox="0 0 440 180" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" strokeLinecap="round">
        <path d="M 60 78 A 100 100 0 0 1 260 78" stroke="#a8d5e8" strokeWidth="7" />
        <path d="M 78 78 A 82 82 0 0 1 242 78" stroke="#7189c4" strokeWidth="7" />
        <path d="M 96 78 A 64 64 0 0 1 224 78" stroke="#f2b872" strokeWidth="7" />
        <path d="M 114 78 A 46 46 0 0 1 206 78" stroke="#e8a288" strokeWidth="7" />
        <path d="M 132 78 A 28 28 0 0 1 188 78" stroke="#a8d5e8" strokeWidth="7" />
        <path d="M 150 78 A 10 10 0 0 1 170 78" stroke="#7189c4" strokeWidth="7" />
      </g>
      <text x="160" y="140" fontFamily="'Comic Sans MS', 'Segoe Print', cursive" fontWeight="700" fontSize="62" fill="#2fae5a" textAnchor="middle" letterSpacing="1">
        IG3
      </text>
      <text x="160" y="165" fontFamily="Georgia, 'Times New Roman', serif" fontSize="15" fill="#7a5fc0" textAnchor="middle" letterSpacing="3">
        DUBAI PASABUY
      </text>
    </svg>
  );
}

export default function IG3DubaiPasabuy() {
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState({}); // id -> qty
  const [cartOpen, setCartOpen] = useState(false);
  const [view, setView] = useState("shop"); // shop | checkout | confirmation | admin
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", notes: "" });
  const [formErrors, setFormErrors] = useState({});
  const [orders, setOrders] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminError, setAdminError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ name: "", price: "", cat: "", image: "" });
  const [newProduct, setNewProduct] = useState({ name: "", price: "", cat: "Candy & Gummies", icon: "🛍️", image: "" });
  const [productSaveWarning, setProductSaveWarning] = useState(false);
  const [adminTab, setAdminTab] = useState("products"); // products | orders
  const [uploadingId, setUploadingId] = useState(null); // "edit" | "new" | null while compressing an image
  const [uploadError, setUploadError] = useState("");
  const [zoomImage, setZoomImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  function openZoom(src) {
    if (!src) return;
    setZoomImage(src);
    setZoomLevel(1);
  }
  function closeZoom() {
    setZoomImage(null);
    setZoomLevel(1);
  }
  function zoomIn() {
    setZoomLevel((z) => Math.min(z + 0.5, 4));
  }
  function zoomOut() {
    setZoomLevel((z) => Math.max(z - 0.5, 1));
  }

  async function handleImageUpload(file, target) {
    setUploadError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      return;
    }
    setUploadingId(target);
    try {
      const dataUrl = await compressImageFile(file);
      if (target === "edit") {
        setEditDraft((d) => ({ ...d, image: dataUrl }));
      } else {
        setNewProduct((n) => ({ ...n, image: dataUrl }));
      }
    } catch (e) {
      setUploadError("Couldn't process that image — try a different photo.");
    } finally {
      setUploadingId(null);
    }
  }

  useEffect(() => {
    loadOrders();
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const result = await window.storage.get("products", true);
      if (result && result.value) {
        const parsed = JSON.parse(result.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        } else {
          await persistProducts(SEED_PRODUCTS);
        }
      } else {
        await persistProducts(SEED_PRODUCTS);
      }
    } catch (e) {
      // no products saved yet — seed them
      await persistProducts(SEED_PRODUCTS);
    } finally {
      setProductsLoaded(true);
    }
  }

  async function persistProducts(nextProducts) {
    setProducts(nextProducts);
    try {
      const result = await window.storage.set("products", JSON.stringify(nextProducts), true);
      if (!result) setProductSaveWarning(true);
      else setProductSaveWarning(false);
    } catch (err) {
      setProductSaveWarning(true);
    }
  }

  async function loadOrders() {
    setLoadingOrders(true);
    try {
      const result = await window.storage.get("orders", true);
      if (result && result.value) {
        setOrders(JSON.parse(result.value));
      }
    } catch (e) {
      // key probably doesn't exist yet — that's fine, treat as empty shop
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }

  const categoriesFromProducts = Array.from(new Set(products.map((p) => p.cat)));
  const CATEGORIES = ["All", ...categoriesFromProducts];

  const items = products.filter((p) => category === "All" || p.cat === category);
  const cartEntries = Object.entries(cart).filter(([, qty]) => qty > 0);
  const cartCount = cartEntries.reduce((sum, [, qty]) => sum + qty, 0);
  const cartTotal = cartEntries.reduce((sum, [id, qty]) => {
    const p = products.find((pp) => pp.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);

  function addToCart(id) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }
  function decFromCart(id) {
    setCart((c) => {
      const next = { ...c, [id]: Math.max(0, (c[id] || 0) - 1) };
      return next;
    });
  }
  function removeFromCart(id) {
    setCart((c) => ({ ...c, [id]: 0 }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "We need a name for the order ticket.";
    if (!form.phone.trim() && !form.email.trim()) errs.contact = "Add a phone or email so we can reach you.";
    if (!form.address.trim()) errs.address = "Where should this stash get delivered?";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function placeOrder(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const orderItems = cartEntries.map(([id, qty]) => {
      const p = products.find((pp) => pp.id === id);
      return { id, name: p ? p.name : id, price: p ? p.price : 0, qty };
    });
    const newOrder = {
      id: `IG3-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      customer: { ...form },
      items: orderItems,
      total: cartTotal,
      status: "Received",
    };
    try {
      const nextOrders = [...orders, newOrder];
      const result = await window.storage.set("orders", JSON.stringify(nextOrders), true);
      if (result) {
        setOrders(nextOrders);
      } else {
        setStorageWarning(true);
      }
    } catch (err) {
      setStorageWarning(true);
    } finally {
      setLastOrder(newOrder);
      setCart({});
      setCartOpen(false);
      setView("confirmation");
      setSaving(false);
    }
  }

  function startNewOrder() {
    setForm({ name: "", phone: "", email: "", address: "", notes: "" });
    setFormErrors({});
    setLastOrder(null);
    setView("shop");
  }

  function openAdmin() {
    setView("admin");
    setAdminError("");
    if (adminAuthed) {
      loadOrders();
      loadProducts();
    }
  }

  function handleAdminLogin(e) {
    e.preventDefault();
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setAdminAuthed(true);
      setAdminError("");
      setAdminPasswordInput("");
      loadOrders();
      loadProducts();
    } else {
      setAdminError("That's not it — try again.");
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    const nextOrders = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    setOrders(nextOrders); // optimistic update
    try {
      const result = await window.storage.set("orders", JSON.stringify(nextOrders), true);
      if (!result) setStorageWarning(true);
    } catch (err) {
      setStorageWarning(true);
    }
  }

  function startEditProduct(p) {
    setEditingId(p.id);
    setEditDraft({ name: p.name, price: String(p.price), cat: p.cat, image: p.image || "" });
  }

  async function saveEditProduct(id) {
    const priceNum = parseFloat(editDraft.price);
    const nextProducts = products.map((p) =>
      p.id === id
        ? {
            ...p,
            name: editDraft.name.trim() || p.name,
            price: isNaN(priceNum) ? p.price : priceNum,
            cat: editDraft.cat.trim() || p.cat,
            image: editDraft.image.trim(),
          }
        : p
    );
    await persistProducts(nextProducts);
    setEditingId(null);
  }

  async function deleteProduct(id) {
    const nextProducts = products.filter((p) => p.id !== id);
    await persistProducts(nextProducts);
  }

  async function addNewProduct() {
    if (!newProduct.name.trim()) return;
    const priceNum = parseFloat(newProduct.price);
    const item = {
      id: `p${Date.now()}`,
      cat: newProduct.cat.trim() || "Candy & Gummies",
      name: newProduct.name.trim(),
      desc: "",
      price: isNaN(priceNum) ? 10 : priceNum,
      icon: newProduct.icon.trim() || CATEGORY_ICONS[newProduct.cat] || "🛍️",
      tint: TINTS[products.length % TINTS.length],
      image: newProduct.image.trim(),
    };
    await persistProducts([...products, item]);
    setNewProduct({ name: "", price: "", cat: newProduct.cat, icon: "🛍️", image: "" });
  }

  return (
    <div className="min-h-screen" style={{ background: "#FFF8EF", fontFamily: "Nunito, sans-serif", color: "#5C3A2E" }}>
      <style>{FONTS}</style>

      {/* Header */}
      <header className="sticky top-0 z-30" style={{ background: "#FFF8EF", borderBottom: "3px dashed #F3B6CE" }}>
        <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
          <button
            onClick={() => setView("shop")}
            className="flex items-center gap-2"
            style={{ fontFamily: "Baloo 2, sans-serif" }}
          >
            <Logo className="h-10 sm:h-12 w-auto" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={openAdmin}
              className="hidden sm:flex items-center gap-1 text-sm font-bold px-3 py-2 rounded-full"
              style={{ color: "#5C3A2E", background: "#FFD976" }}
            >
              <Store className="w-4 h-4" /> Behind the Counter
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-1 text-sm font-bold px-3 py-2 rounded-full"
              style={{ background: "#FF6FA5", color: "white" }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Goodie Bag</span>
              {cartCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 rounded-full text-xs font-extrabold w-5 h-5 flex items-center justify-center"
                  style={{ background: "#E8433A", color: "white" }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {view === "shop" && (
        <main>
          {/* Hero */}
          <section className="max-w-5xl mx-auto px-4 pt-10 pb-6 text-center">
            <div
              className="inline-block rotate-2 px-4 py-1 rounded-full text-xs font-extrabold mb-4"
              style={{ background: "#CFF5E7", color: "#1E6B54" }}
            >
              PACKED FRESH FROM DUBAI
            </div>
            <h1
              className="text-4xl sm:text-5xl font-extrabold leading-tight mb-3"
              style={{ fontFamily: "Baloo 2, sans-serif", color: "#5C3A2E" }}
            >
              Snacks, sweets &amp; treats,
              <br />
              <span style={{ color: "#FF6FA5" }}>straight from Dubai.</span>
            </h1>
            <p className="max-w-md mx-auto text-base" style={{ color: "#8A6656" }}>
              Pick your favorites, tell us where to send them, and we'll tuck your
              order ticket right into the bag.
            </p>
          </section>

          {/* Category tabs */}
          <div className="max-w-5xl mx-auto px-4 flex gap-2 justify-center flex-wrap mb-6">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="px-4 py-2 rounded-full text-sm font-bold border-2 transition"
                style={
                  category === c
                    ? { background: "#5C3A2E", color: "#FFF8EF", borderColor: "#5C3A2E" }
                    : { background: "transparent", color: "#5C3A2E", borderColor: "#E8C7B0" }
                }
              >
                {c}
              </button>
            ))}
          </div>

          {!productsLoaded && (
            <div className="flex items-center justify-center gap-2 text-sm py-10" style={{ color: "#8A6656" }}>
              <Loader2 className="w-4 h-4 animate-spin" /> Loading the shelves...
            </div>
          )}

          {/* Product grid */}
          {productsLoaded && (
            <div className="max-w-5xl mx-auto px-4 pb-16 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {items.map((p, i) => (
                <div
                  key={p.id}
                  className={`rounded-3xl p-4 flex flex-col ${i % 2 === 0 ? "rotate-1" : "-rotate-1"}`}
                  style={{ background: p.tint, border: "2px solid rgba(92,58,46,0.15)" }}
                >
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded-xl mb-2 cursor-zoom-in"
                      style={{ background: "white" }}
                      onClick={() => openZoom(p.image)}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <div className="text-4xl mb-2">{p.icon}</div>
                  )}
                  <h3 className="font-extrabold text-sm mb-1" style={{ fontFamily: "Baloo 2, sans-serif" }}>
                    {p.name}
                  </h3>
                  <p className="text-xs mb-3 flex-1" style={{ color: "#8A6656" }}>
                    {p.cat}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm">{formatMoney(p.price)}</span>
                    {cart[p.id] > 0 ? (
                      <div className="flex items-center gap-1 rounded-full px-1 py-1" style={{ background: "white" }}>
                        <button onClick={() => decFromCart(p.id)} className="w-6 h-6 flex items-center justify-center rounded-full" style={{ background: "#F3E3D3" }}>
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{cart[p.id]}</span>
                        <button onClick={() => addToCart(p.id)} className="w-6 h-6 flex items-center justify-center rounded-full" style={{ background: "#FF6FA5", color: "white" }}>
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(p.id)}
                        className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-full"
                        style={{ background: "#5C3A2E", color: "#FFF8EF" }}
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {view === "checkout" && (
        <main className="max-w-md mx-auto px-4 py-8">
          <button onClick={() => setView("shop")} className="flex items-center gap-1 text-sm font-bold mb-4" style={{ color: "#8A6656" }}>
            <ArrowLeft className="w-4 h-4" /> Back to shop
          </button>
          <div className="rounded-3xl p-6" style={{ background: "white", border: "2px dashed #F3B6CE" }}>
            <h2 className="text-2xl font-extrabold mb-1" style={{ fontFamily: "Baloo 2, sans-serif" }}>
              Fill out your ticket
            </h2>
            <p className="text-xs mb-4" style={{ color: "#8A6656" }}>
              This is how we know whose goodie bag is whose.
            </p>

            <div className="rounded-2xl p-3 mb-4 text-sm" style={{ background: "#FFF3D6" }}>
              {cartEntries.map(([id, qty]) => {
                const p = products.find((pp) => pp.id === id);
                if (!p) return null;
                return (
                  <div key={id} className="flex justify-between py-1">
                    <span>{p.icon} {p.name} × {qty}</span>
                    <span className="font-bold">{formatMoney(p.price * qty)}</span>
                  </div>
                );
              })}
              <div className="flex justify-between pt-2 mt-2 font-extrabold" style={{ borderTop: "1px solid #E8C7B0" }}>
                <span>Total</span>
                <span>{formatMoney(cartTotal)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold block mb-1">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 text-sm border-2"
                  style={{ borderColor: formErrors.name ? "#E8433A" : "#E8C7B0" }}
                  placeholder="Who's this bag for?"
                />
                {formErrors.name && <p className="text-xs mt-1" style={{ color: "#E8433A" }}>{formErrors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold block mb-1">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl px-3 py-2 text-sm border-2"
                    style={{ borderColor: formErrors.contact ? "#E8433A" : "#E8C7B0" }}
                    placeholder="(555) 555-5555"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">Email</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl px-3 py-2 text-sm border-2"
                    style={{ borderColor: formErrors.contact ? "#E8433A" : "#E8C7B0" }}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              {formErrors.contact && <p className="text-xs -mt-2" style={{ color: "#E8433A" }}>{formErrors.contact}</p>}
              <div>
                <label className="text-xs font-bold block mb-1">Delivery address</label>
                <input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 text-sm border-2"
                  style={{ borderColor: formErrors.address ? "#E8433A" : "#E8C7B0" }}
                  placeholder="Street, city, zip"
                />
                {formErrors.address && <p className="text-xs mt-1" style={{ color: "#E8433A" }}>{formErrors.address}</p>}
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Notes (optional)</label>
                <input
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 text-sm border-2"
                  style={{ borderColor: "#E8C7B0" }}
                  placeholder="Leave at the door, allergy note, etc."
                />
              </div>
              <button
                onClick={placeOrder}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 font-extrabold py-3 rounded-full mt-2"
                style={{ background: "#E8433A", color: "white" }}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {saving ? "Sealing your bag..." : `Place order · ${formatMoney(cartTotal)}`}
              </button>
            </div>
          </div>
        </main>
      )}

      {view === "confirmation" && lastOrder && (
        <main className="max-w-md mx-auto px-4 py-10 text-center">
          <div className="rounded-3xl p-6 rotate-1" style={{ background: "#CFF5E7", border: "3px dashed #1E6B54" }}>
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2" style={{ color: "#1E6B54" }} />
            <h2 className="text-2xl font-extrabold mb-1" style={{ fontFamily: "Baloo 2, sans-serif" }}>
              Sealed with sugar!
            </h2>
            <p className="text-sm mb-2" style={{ color: "#1E6B54" }}>
              Order <span className="font-extrabold">#{lastOrder.id}</span> is on the list, {lastOrder.customer.name}.
            </p>
            <div
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold mb-4"
              style={{ background: STATUS_STYLE[lastOrder.status].bg, color: STATUS_STYLE[lastOrder.status].fg }}
            >
              {lastOrder.status}
            </div>
            <div className="rounded-2xl p-3 text-left text-sm" style={{ background: "white" }}>
              {lastOrder.items.map((it) => (
                <div key={it.id} className="flex justify-between py-1">
                  <span>{it.name} × {it.qty}</span>
                  <span className="font-bold">{formatMoney(it.price * it.qty)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 mt-2 font-extrabold" style={{ borderTop: "1px solid #E8C7B0" }}>
                <span>Total</span>
                <span>{formatMoney(lastOrder.total)}</span>
              </div>
            </div>
            {storageWarning && (
              <p className="text-xs mt-3" style={{ color: "#8A6656" }}>
                Heads up — this order was saved for this session but couldn't reach shared storage.
              </p>
            )}
          </div>
          <button
            onClick={startNewOrder}
            className="mt-6 font-extrabold px-5 py-3 rounded-full"
            style={{ background: "#5C3A2E", color: "#FFF8EF" }}
          >
            Start another order
          </button>
        </main>
      )}

      {view === "admin" && !adminAuthed && (
        <main className="max-w-sm mx-auto px-4 py-16">
          <button onClick={() => setView("shop")} className="flex items-center gap-1 text-sm font-bold mb-6" style={{ color: "#8A6656" }}>
            <ArrowLeft className="w-4 h-4" /> Back to shop
          </button>
          <div className="rounded-3xl p-6 text-center" style={{ background: "white", border: "2px dashed #F3B6CE" }}>
            <Lock className="w-8 h-8 mx-auto mb-2" style={{ color: "#5C3A2E" }} />
            <h2 className="text-xl font-extrabold mb-1" style={{ fontFamily: "Baloo 2, sans-serif" }}>
              Staff only
            </h2>
            <p className="text-xs mb-4" style={{ color: "#8A6656" }}>
              Enter the counter password to see who's ordering.
            </p>
            <div className="space-y-2">
              <input
                type="password"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdminLogin(e)}
                className="w-full rounded-xl px-3 py-2 text-sm border-2 text-center"
                style={{ borderColor: adminError ? "#E8433A" : "#E8C7B0" }}
                placeholder="Password"
                autoFocus
              />
              {adminError && <p className="text-xs" style={{ color: "#E8433A" }}>{adminError}</p>}
              <button onClick={handleAdminLogin} className="w-full font-extrabold py-2 rounded-full" style={{ background: "#5C3A2E", color: "#FFF8EF" }}>
                Unlock
              </button>
            </div>
          </div>
        </main>
      )}

      {view === "admin" && adminAuthed && (
        <main className="max-w-3xl mx-auto px-4 py-8">
          <button onClick={() => setView("shop")} className="flex items-center gap-1 text-sm font-bold mb-4" style={{ color: "#8A6656" }}>
            <ArrowLeft className="w-4 h-4" /> Back to shop
          </button>
          <h2 className="text-2xl font-extrabold mb-4" style={{ fontFamily: "Baloo 2, sans-serif" }}>
            Behind the counter
          </h2>

          {/* Admin tab switcher */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setAdminTab("products")}
              className="flex-1 flex items-center justify-center gap-2 text-sm font-extrabold px-4 py-3 rounded-2xl border-2"
              style={
                adminTab === "products"
                  ? { background: "#5C3A2E", color: "#FFF8EF", borderColor: "#5C3A2E" }
                  : { background: "white", color: "#5C3A2E", borderColor: "#E8C7B0" }
              }
            >
              <Package className="w-4 h-4" /> Manage Products
            </button>
            <button
              onClick={() => setAdminTab("orders")}
              className="flex-1 flex items-center justify-center gap-2 text-sm font-extrabold px-4 py-3 rounded-2xl border-2"
              style={
                adminTab === "orders"
                  ? { background: "#5C3A2E", color: "#FFF8EF", borderColor: "#5C3A2E" }
                  : { background: "white", color: "#5C3A2E", borderColor: "#E8C7B0" }
              }
            >
              <Truck className="w-4 h-4" /> Order Tickets
              {orders.length > 0 && (
                <span
                  className="rounded-full text-[10px] font-extrabold w-5 h-5 flex items-center justify-center"
                  style={{ background: adminTab === "orders" ? "white" : "#FFD976", color: "#5C3A2E" }}
                >
                  {orders.length}
                </span>
              )}
            </button>
          </div>

          {/* Product management */}
          {adminTab === "products" && (
          <div className="rounded-3xl p-5" style={{ background: "white", border: "2px solid #E8C7B0" }}>
            <h3 className="text-lg font-extrabold mb-1" style={{ fontFamily: "Baloo 2, sans-serif" }}>
              Manage products
            </h3>
            <p className="text-xs mb-3" style={{ color: "#8A6656" }}>
              Edit a name, price, or photo link, remove an item, or add something new. Changes save for everyone.
            </p>
            {productSaveWarning && (
              <p className="text-xs mb-2" style={{ color: "#E8433A" }}>
                Heads up — the last product change couldn't reach shared storage. Try again.
              </p>
            )}

            <div className="max-h-96 overflow-y-auto space-y-2 mb-4">
              {products.map((p) => (
                <div key={p.id} className="rounded-xl p-2" style={{ background: p.tint }}>
                  {editingId === p.id ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" style={{ background: "white" }} onError={(e) => { e.target.style.display = "none"; }} />
                        ) : (
                          <span className="text-xl">{p.icon}</span>
                        )}
                        <input
                          value={editDraft.name}
                          onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                          className="flex-1 rounded-lg px-2 py-1 text-xs border"
                          style={{ borderColor: "#E8C7B0" }}
                          placeholder="Name"
                        />
                        <input
                          value={editDraft.cat}
                          onChange={(e) => setEditDraft({ ...editDraft, cat: e.target.value })}
                          className="w-24 rounded-lg px-2 py-1 text-xs border"
                          style={{ borderColor: "#E8C7B0" }}
                          placeholder="Category"
                        />
                        <input
                          value={editDraft.price}
                          onChange={(e) => setEditDraft({ ...editDraft, price: e.target.value })}
                          className="w-14 rounded-lg px-2 py-1 text-xs border"
                          style={{ borderColor: "#E8C7B0" }}
                          placeholder="Price"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        {editDraft.image && (
                          <img src={editDraft.image} alt="" className="w-8 h-8 rounded-lg object-cover" style={{ background: "white" }} />
                        )}
                        <input
                          value={editDraft.image}
                          onChange={(e) => setEditDraft({ ...editDraft, image: e.target.value })}
                          className="flex-1 rounded-lg px-2 py-1 text-xs border"
                          style={{ borderColor: "#E8C7B0" }}
                          placeholder="Photo URL (optional)"
                        />
                        <label
                          className="flex items-center gap-1 text-[10px] font-bold px-2 py-1.5 rounded-lg cursor-pointer"
                          style={{ background: "#FFD976", color: "#5C3A2E" }}
                        >
                          {uploadingId === "edit" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                          Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e.target.files && e.target.files[0], "edit")}
                          />
                        </label>
                        <button onClick={() => saveEditProduct(p.id)} className="p-1.5 rounded-lg" style={{ background: "#1E6B54" }}>
                          <Save className="w-4 h-4" style={{ color: "white" }} />
                        </button>
                      </div>
                      {uploadError && <p className="text-[10px]" style={{ color: "#E8433A" }}>{uploadError}</p>}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover" style={{ background: "white" }} onError={(e) => { e.target.style.display = "none"; }} />
                      ) : (
                        <span className="text-xl">{p.icon}</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{p.name}</p>
                        <p className="text-[10px]" style={{ color: "#8A6656" }}>{p.cat} · {formatMoney(p.price)}{!p.image && " · no photo yet"}</p>
                      </div>
                      <button onClick={() => startEditProduct(p)} className="p-1 rounded-lg" style={{ background: "white" }}>
                        <Pencil className="w-4 h-4" style={{ color: "#5C3A2E" }} />
                      </button>
                      <button onClick={() => deleteProduct(p.id)} className="p-1 rounded-lg" style={{ background: "white" }}>
                        <Trash2 className="w-4 h-4" style={{ color: "#E8433A" }} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-xl p-3" style={{ background: "#FFF8EF", border: "1px dashed #E8C7B0" }}>
              <p className="text-xs font-bold mb-2">Add a new product</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="col-span-2 rounded-lg px-2 py-1.5 text-xs border"
                  style={{ borderColor: "#E8C7B0" }}
                  placeholder="Product name"
                />
                <input
                  value={newProduct.cat}
                  onChange={(e) => setNewProduct({ ...newProduct, cat: e.target.value })}
                  className="rounded-lg px-2 py-1.5 text-xs border"
                  style={{ borderColor: "#E8C7B0" }}
                  placeholder="Category"
                />
                <input
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="rounded-lg px-2 py-1.5 text-xs border"
                  style={{ borderColor: "#E8C7B0" }}
                  placeholder="Price"
                />
                <input
                  value={newProduct.icon}
                  onChange={(e) => setNewProduct({ ...newProduct, icon: e.target.value })}
                  className="rounded-lg px-2 py-1.5 text-xs border"
                  style={{ borderColor: "#E8C7B0" }}
                  placeholder="Emoji icon (e.g. 🍫)"
                />
                <div className="flex items-center gap-2">
                  {newProduct.image && (
                    <img src={newProduct.image} alt="" className="w-8 h-8 rounded-lg object-cover" style={{ background: "white" }} />
                  )}
                  <label
                    className="flex-1 flex items-center justify-center gap-1 text-[11px] font-bold px-2 py-1.5 rounded-lg cursor-pointer"
                    style={{ background: "#FFD976", color: "#5C3A2E" }}
                  >
                    {uploadingId === "new" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                    Upload photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files && e.target.files[0], "new")}
                    />
                  </label>
                </div>
              </div>
              {uploadError && <p className="text-[10px] mb-2" style={{ color: "#E8433A" }}>{uploadError}</p>}
              <input
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                className="w-full rounded-lg px-2 py-1.5 text-xs border mb-2"
                style={{ borderColor: "#E8C7B0" }}
                placeholder="...or paste a photo URL instead"
              />
              <button onClick={addNewProduct} className="w-full font-extrabold py-2 rounded-full text-xs" style={{ background: "#5C3A2E", color: "#FFF8EF" }}>
                Add product
              </button>
            </div>
          </div>
          )}

          {/* Orders */}
          {adminTab === "orders" && (
          <div>
          <p className="text-xs mb-4" style={{ color: "#8A6656" }}>
            This list is shared and visible to anyone who unlocks this page.
          </p>

          {loadingOrders && (
            <div className="flex items-center gap-2 text-sm" style={{ color: "#8A6656" }}>
              <Loader2 className="w-4 h-4 animate-spin" /> Loading tickets...
            </div>
          )}

          {!loadingOrders && orders.length === 0 && (
            <div className="rounded-3xl p-8 text-center" style={{ background: "#FFF3D6" }}>
              <p className="font-bold">No orders yet.</p>
              <p className="text-xs mt-1" style={{ color: "#8A6656" }}>Once someone checks out, their ticket shows up here.</p>
            </div>
          )}

          <div className="space-y-3">
            {orders
              .slice()
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((o) => (
                <div key={o.id} className="rounded-2xl p-4" style={{ background: "white", border: "2px solid #E8C7B0" }}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-extrabold">{o.customer.name}</p>
                      <p className="text-xs" style={{ color: "#8A6656" }}>
                        {[o.customer.phone, o.customer.email].filter(Boolean).join(" · ")}
                      </p>
                      <p className="text-xs" style={{ color: "#8A6656" }}>{o.customer.address}</p>
                      {o.customer.notes && (
                        <p className="text-xs italic mt-1" style={{ color: "#8A6656" }}>"{o.customer.notes}"</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold" style={{ color: "#8A6656" }}>#{o.id}</p>
                      <p className="text-xs" style={{ color: "#8A6656" }}>{new Date(o.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-sm" style={{ borderTop: "1px dashed #E8C7B0" }}>
                    {o.items.map((it) => (
                      <div key={it.id} className="flex justify-between py-1">
                        <span>{it.name} × {it.qty}</span>
                        <span>{formatMoney(it.price * it.qty)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-extrabold pt-1">
                      <span>Total</span>
                      <span>{formatMoney(o.total)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-3 pt-3" style={{ borderTop: "1px dashed #E8C7B0" }}>
                    <span
                      className="flex items-center gap-1 text-xs font-extrabold px-2 py-1 rounded-full"
                      style={{ background: STATUS_STYLE[o.status || "Received"].bg, color: STATUS_STYLE[o.status || "Received"].fg }}
                    >
                      {(() => {
                        const Icon = STATUS_STYLE[o.status || "Received"].icon;
                        return <Icon className="w-3 h-3" />;
                      })()}
                      {o.status || "Received"}
                    </span>
                    <div className="flex gap-1">
                      {STATUS_FLOW.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateOrderStatus(o.id, s)}
                          disabled={(o.status || "Received") === s}
                          className="text-xs font-bold px-2 py-1 rounded-full disabled:opacity-30"
                          style={{ background: "#FFF8EF", color: "#5C3A2E", border: "1px solid #E8C7B0" }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          </div>
          )}
        </main>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-40 flex justify-end" style={{ background: "rgba(92,58,46,0.4)" }} onClick={() => setCartOpen(false)}>
          <div
            className="w-full sm:w-96 h-full p-5 flex flex-col"
            style={{ background: "#FFF8EF" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-extrabold" style={{ fontFamily: "Baloo 2, sans-serif" }}>
                Your goodie bag
              </h3>
              <button onClick={() => setCartOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {cartEntries.length === 0 ? (
              <p className="text-sm flex-1" style={{ color: "#8A6656" }}>
                Nothing in here yet — go grab something sweet.
              </p>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2">
                {cartEntries.map(([id, qty]) => {
                  const p = products.find((pp) => pp.id === id);
                  if (!p) return null;
                  return (
                    <div key={id} className="flex items-center gap-2 rounded-xl p-2" style={{ background: p.tint }}>
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-xl" style={{ background: "white" }} onError={(e) => { e.target.style.display = "none"; }} />
                      ) : (
                        <span className="text-2xl">{p.icon}</span>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-bold">{p.name}</p>
                        <p className="text-xs" style={{ color: "#8A6656" }}>{formatMoney(p.price)} each</p>
                      </div>
                      <button onClick={() => decFromCart(id)} className="w-6 h-6 flex items-center justify-center rounded-full" style={{ background: "white" }}>
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{qty}</span>
                      <button onClick={() => addToCart(id)} className="w-6 h-6 flex items-center justify-center rounded-full" style={{ background: "white" }}>
                        <Plus className="w-3 h-3" />
                      </button>
                      <button onClick={() => removeFromCart(id)} className="ml-1">
                        <X className="w-4 h-4" style={{ color: "#8A6656" }} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="pt-4" style={{ borderTop: "2px dashed #E8C7B0" }}>
              <div className="flex justify-between font-extrabold mb-3">
                <span>Total</span>
                <span>{formatMoney(cartTotal)}</span>
              </div>
              <button
                disabled={cartEntries.length === 0}
                onClick={() => {
                  setCartOpen(false);
                  setView("checkout");
                }}
                className="w-full font-extrabold py-3 rounded-full disabled:opacity-40"
                style={{ background: "#FF6FA5", color: "white" }}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="text-center text-xs py-8" style={{ color: "#B79684" }}>
        IG3 Dubai Pasabuy · snacks, sweets &amp; treats · demo shop
      </footer>
      {/* Photo zoom lightbox */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(30,20,15,0.85)" }}
          onClick={closeZoom}
        >
          <div className="relative max-w-full max-h-full overflow-auto" onClick={(e) => e.stopPropagation()}>
            <img
              src={zoomImage}
              alt="Zoomed product"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "center center",
                transition: "transform 0.15s ease-out",
                maxWidth: "80vw",
                maxHeight: "70vh",
                borderRadius: "1rem",
                background: "white",
              }}
            />
          </div>
          <div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full px-3 py-2"
            style={{ background: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={zoomOut} disabled={zoomLevel <= 1} className="w-9 h-9 flex items-center justify-center rounded-full disabled:opacity-30" style={{ background: "#F3E3D3" }}>
              <ZoomOut className="w-4 h-4" style={{ color: "#5C3A2E" }} />
            </button>
            <span className="text-xs font-bold w-10 text-center" style={{ color: "#5C3A2E" }}>{Math.round(zoomLevel * 100)}%</span>
            <button onClick={zoomIn} disabled={zoomLevel >= 4} className="w-9 h-9 flex items-center justify-center rounded-full disabled:opacity-30" style={{ background: "#F3E3D3" }}>
              <ZoomIn className="w-4 h-4" style={{ color: "#5C3A2E" }} />
            </button>
            <button onClick={closeZoom} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: "#E8433A" }}>
              <X className="w-4 h-4" style={{ color: "white" }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}