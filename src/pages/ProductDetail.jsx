const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { Image } from "@/components/ui/image";
import { ArrowLeft, Clock, Layers, Palette, Sparkles, ArrowRight, Loader2 } from "lucide-react";

const FALLBACK = {
  name: "Noor Lehenga",
  category: "Bridal",
  embroidery_type: "Zardosi & Dabka",
  fabric: "Raw silk",
  color: "Crimson & Gold",
  craftsmanship_hours: 540,
  description: "A crimson heirloom. Zardosi vines climb the skirt over 540 hours of handwork, finished with a scalloped gold border. Worn with a sheer dupatta scattered with seed pearls.",
  price_range: "On request",
  image_url: "/images/bcf98c731_generated_image.png",
  detail_images: [
    "/images/6b0ae03a2_generated_image.png",
    "/images/64d3208ef_generated_image.png",
  ],
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!id || id.startsWith("fb-")) {
        setProduct(FALLBACK);
        setLoading(false);
        return;
      }
      try {
        const p = await db.entities.Product.get(id);
        setProduct(p || FALLBACK);
      } catch (e) {
        setProduct(FALLBACK);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <Loader2 className="animate-spin text-accent" size={28} />
      </div>
    );
  }

  const details = product.detail_images && product.detail_images.length ? product.detail_images : [product.image_url];

  return (
    <div className="animate-fade-in pb-28">
      {/* Breadcrumb */}
      <div className="px-5 pt-5">
        <Link to="/showroom" className="inline-flex items-center gap-2 label-caps text-muted-foreground hover:text-secondary focus-gold">
          <ArrowLeft size={15} /> Showroom
        </Link>
      </div>

      {/* ACT I — THE SILHOUETTE */}
      <section className="relative h-[70vh] min-h-[30rem] mt-4 bg-secondary overflow-hidden">
        <Image src={product.image_url} alt={product.name} className="w-full h-full object-cover" fittingType="fill" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-8">
          <div className="mx-auto max-w-7xl">
            <span className="label-caps text-gold">{product.category} · {product.collection_name || "Anchhi"}</span>
            <h1 className="display-hero text-silk text-6xl sm:text-8xl mt-2">{product.name}</h1>
            {product.price_range && <span className="label-caps text-silk/70 mt-2 block">{product.price_range}</span>}
          </div>
        </div>
      </section>

      {/* Story line */}
      <section className="px-5 py-12">
        <div className="mx-auto max-w-2xl">
          <p className="text-xl leading-relaxed text-secondary font-heading italic">{product.description}</p>
        </div>
      </section>

      {/* ACT II — THE CRAFT (artisan strip) */}
      <section className="bg-secondary text-silk py-16">
        <div className="mx-auto max-w-7xl px-5">
          <span className="label-caps text-gold">Act II · The Craft</span>
          <h2 className="display-hero text-4xl sm:text-5xl mt-2 mb-8">Woven by the karigar's hand</h2>

          {/* Spec grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <Spec icon={Clock} label="Hours" value={product.craftsmanship_hours ? `${product.craftsmanship_hours}h` : "—"} />
            <Spec icon={Layers} label="Fabric" value={product.fabric || "—"} />
            <Spec icon={Sparkles} label="Technique" value={product.embroidery_type || "—"} />
            <Spec icon={Palette} label="Colour" value={product.color || "—"} />
          </div>

          {/* Horizontal artisan strip */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5">
            {details.map((img, i) => (
              <div key={i} className="relative shrink-0 w-72 h-96 rounded-sm overflow-hidden mask-angular">
                <Image src={img} alt={`${product.name} detail ${i + 1}`} className="w-full h-full object-cover" fittingType="fill" />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
                <span className="absolute bottom-3 left-3 label-caps text-gold">{i === 0 ? "The handwork" : `Detail ${i + 1}`}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACT III — THE LEGACY (fixed background) */}
      <section className="relative h-[80vh] min-h-[32rem] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={details[details.length - 1]}
            alt={`${product.name} styled in a heritage setting`}
            className="w-full h-full object-cover"
            fittingType="fill"
          />
          <div className="absolute inset-0 bg-secondary/55" />
        </div>
        <div className="relative mx-auto max-w-2xl px-5 text-center text-silk">
          <span className="label-caps text-gold">Act III · The Legacy</span>
          <h2 className="display-hero text-4xl sm:text-6xl mt-3 mb-5">Worn for a day, kept for a lifetime.</h2>
          <p className="text-silk/85 text-lg">
            An Anchhi piece does not end with the wedding. It is folded in muslin, passed between hands, and worn again
            by the one who comes after. This is the meaning of heritage.
          </p>
        </div>
      </section>

      {/* Bespoke inquiry bar */}
      <div className="fixed bottom-20 sm:bottom-0 inset-x-0 z-30 sm:relative sm:mt-0">
        <div className="mx-auto max-w-7xl px-5">
          <div className="bg-secondary/95 backdrop-blur-md border border-gold/30 rounded-sm p-4 flex items-center justify-between gap-4 shadow-xl">
            <div className="hidden sm:block">
              <span className="label-caps text-gold">Bespoke Inquiry</span>
              <p className="text-silk/80 text-sm">Make this piece yours — start a private consultation.</p>
            </div>
            <Link
              to={`/inquiry?product=${product.id}&name=${encodeURIComponent(product.name)}`}
              className="flex-1 sm:flex-none text-center px-6 py-3.5 rounded-sm bg-gradient-to-r from-gold to-[#BF9128] text-secondary label-caps hover:opacity-90 transition-opacity focus-gold animate-pulse-gold"
            >
              Request Consultation <ArrowRight size={15} className="inline ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ icon: Icon, label, value }) {
  return (
    <div className="border-l border-dotted border-gold/40 pl-3">
      <Icon size={18} className="text-gold mb-1" strokeWidth={1.6} />
      <span className="label-caps text-silk/50 block text-[0.6rem]">{label}</span>
      <span className="display-hero text-2xl text-silk block">{value}</span>
    </div>
  );
}