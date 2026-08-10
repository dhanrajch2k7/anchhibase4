const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState, useMemo } from "react";

import ProductCard from "@/components/ProductCard";
import StitchDivider from "@/components/StitchDivider";
import { Search } from "lucide-react";

const CATEGORIES = ["All", "Bridal", "Groom", "Engagement", "Festive", "Accessories"];

const FALLBACK_PRODUCTS = [
  {
    id: "fb-1",
    name: "Noor Lehenga",
    category: "Bridal",
    embroidery_type: "Zardosi & Dabka",
    fabric: "Raw silk",
    color: "Crimson & Gold",
    price_range: "On request",
    craftsmanship_hours: 540,
    is_statement: true,
    image_url: "/images/bcf98c731_generated_image.png",
    detail_images: ["/images/6b0ae03a2_generated_image.png"],
  },
  {
    id: "fb-2",
    name: "Virasat Sherwani",
    category: "Groom",
    embroidery_type: "Gota patti",
    fabric: "Ivory silk",
    color: "Ivory & Gold",
    price_range: "On request",
    craftsmanship_hours: 220,
    is_statement: false,
    image_url: "/images/bee6d4591_generated_image.png",
    detail_images: ["/images/6b0ae03a2_generated_image.png"],
  },
  {
    id: "fb-3",
    name: "Roshni Lehenga",
    category: "Festive",
    embroidery_type: "Aari & mirror",
    fabric: "Chiffon & silk",
    color: "Saffron & Teal",
    price_range: "On request",
    craftsmanship_hours: 310,
    is_statement: false,
    image_url: "/images/d3b28e7ac_generated_image.png",
    detail_images: ["/images/6b0ae03a2_generated_image.png"],
  },
  {
    id: "fb-4",
    name: "Bahaar Anarkali",
    category: "Engagement",
    embroidery_type: "Gota patti",
    fabric: "Georgette",
    color: "Blush & Gold",
    price_range: "On request",
    craftsmanship_hours: 180,
    is_statement: false,
    image_url: "/images/8304248bd_generated_image.png",
    detail_images: ["/images/6b0ae03a2_generated_image.png"],
  },
  {
    id: "fb-5",
    name: "Zardozi Dupatta",
    category: "Accessories",
    embroidery_type: "Zardosi border",
    fabric: "Net & silk",
    color: "Deep red",
    price_range: "On request",
    craftsmanship_hours: 90,
    is_statement: false,
    image_url: "/images/6b0ae03a2_generated_image.png",
    detail_images: [],
  },
];

export default function Showroom() {
  const [products, setProducts] = useState([]);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const ps = await db.entities.Product.list("-created_date", 60);
        if (ps && ps.length) setProducts(ps);
      } catch (e) {}
    })();
  }, []);

  const list = products.length ? products : FALLBACK_PRODUCTS;

  const filtered = useMemo(() => {
    return list.filter((p) => {
      const okCat = cat === "All" || p.category === cat;
      const okQ = !q.trim() || (p.name + " " + (p.embroidery_type || "") + " " + (p.color || "")).toLowerCase().includes(q.toLowerCase());
      return okCat && okQ;
    });
  }, [list, cat, q]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="px-5 pt-14 pb-8">
        <div className="mx-auto max-w-7xl">
          <StitchDivider label="The Showroom" className="mb-6 max-w-xs" />
          <h1 className="display-hero text-5xl sm:text-7xl mb-3">A catalogue of craft</h1>
          <p className="text-muted-foreground max-w-xl">
            Wander our digital atelier. Long-press any piece to see the artisan's handwork up close.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-14 z-30 bg-background/90 backdrop-blur-md border-y border-border/60">
        <div className="mx-auto max-w-7xl px-5 py-3 flex items-center gap-3">
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 w-max">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`label-caps px-4 py-2 rounded-full whitespace-nowrap transition-colors focus-gold ${
                    cat === c ? "bg-secondary text-silk" : "bg-muted text-muted-foreground hover:text-secondary"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="relative hidden sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="pl-9 pr-3 py-2 rounded-full border border-border bg-card text-sm focus-gold w-44"
            />
          </div>
        </div>
      </section>

      {/* Masonry grid */}
      <section className="px-5 py-10">
        <div className="mx-auto max-w-7xl">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">No pieces found in this mood.</p>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}