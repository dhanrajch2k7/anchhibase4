import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { ZoomIn, X } from "lucide-react";

export default function ProductCard({ product, index = 0 }) {
  const [zoomed, setZoomed] = useState(false);
  const pressTimer = useRef(null);
  const isStatement = product.is_statement;
  const macro = (product.detail_images && product.detail_images[0]) || product.image_url;

  const startPress = () => {
    pressTimer.current = setTimeout(() => setZoomed(true), 380);
  };
  const cancelPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  return (
    <>
      <Link
        to={`/piece/${product.id}`}
        className={`group block break-inside-avoid mb-5 focus-gold rounded-sm ${isStatement ? "sm:col-span-2" : ""}`}
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div
          className="relative overflow-hidden mask-angular bg-secondary cursor-pointer"
          onPointerDown={startPress}
          onPointerUp={cancelPress}
          onPointerLeave={cancelPress}
        >
          <Image
            src={product.image_url}
            alt={`${product.color} ${product.embroidery_type || ""} on ${product.fabric || "fabric"} — ${product.name}`}
            className={`w-full ${isStatement ? "h-[26rem] sm:h-[34rem]" : "h-[22rem]"} object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105 animate-slow-zoom`}
            fittingType="fill"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/85 via-secondary/10 to-transparent opacity-80" />
          <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between">
            <div>
              <span className="label-caps text-gold/90">{product.category}</span>
              <h3 className="display-hero text-silk text-2xl mt-1">{product.name}</h3>
              {product.embroidery_type && (
                <p className="text-silk/70 text-sm mt-0.5 italic">{product.embroidery_type}</p>
              )}
            </div>
            <span className="shrink-0 ml-3 grid place-items-center w-9 h-9 rounded-full bg-gold/90 text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn size={16} strokeWidth={2} />
            </span>
          </div>
          {product.is_statement && (
            <span className="absolute top-3 left-3 label-caps text-[0.6rem] bg-gold text-secondary px-2.5 py-1 rounded-sm">
              Statement
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <span className="text-muted-foreground text-sm">{product.color}</span>
          {product.price_range && (
            <span className="label-caps text-secondary">{product.price_range}</span>
          )}
        </div>
      </Link>

      {/* Macro craft zoom overlay */}
      {zoomed && (
        <div
          className="fixed inset-0 z-[60] bg-secondary/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-fade-in"
          onClick={() => setZoomed(false)}
        >
          <button
            className="absolute top-5 right-5 text-silk/80 hover:text-gold focus-gold rounded-full p-2"
            onClick={() => setZoomed(false)}
            aria-label="Close craft view"
          >
            <X size={26} />
          </button>
          <span className="label-caps text-gold mb-4">The Craft · {product.embroidery_type || "Detail"}</span>
          <Image
            src={macro}
            alt={`Macro detail of ${product.name} embroidery`}
            className="w-full max-w-2xl h-[60vh] rounded-sm object-cover"
            fittingType="fill"
          />
          {product.craftsmanship_hours ? (
            <p className="text-silk/80 mt-5 text-center max-w-md">
              <span className="gold-text font-semibold">{product.craftsmanship_hours} hours</span> of handwork by our master karigars.
            </p>
          ) : null}
        </div>
      )}
    </>
  );
}