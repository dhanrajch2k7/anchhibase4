const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import InquiryStepper from "@/components/InquiryStepper";
import StitchDivider from "@/components/StitchDivider";
import { Loader2 } from "lucide-react";

export default function Inquiry() {
  const [params] = useSearchParams();
  const productId = params.get("product");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(!!productId);

  useEffect(() => {
    if (!productId) return;
    (async () => {
      try {
        const p = await db.entities.Product.get(productId);
        setProduct(p);
      } catch (e) {
        // fall back to name param
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  const prefill = product
    ? product
    : params.get("name")
    ? { id: productId || "", name: params.get("name") }
    : null;

  return (
    <div className="animate-fade-in">
      <section className="px-5 pt-14 pb-4 text-center">
        <StitchDivider label="The Inquiry Portal" className="mb-6 max-w-sm mx-auto" />
        <h1 className="display-hero text-5xl sm:text-7xl mb-3">Let's begin a conversation.</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          A few quiet questions, and we'll take it from here. No forms to fear — just a conversation between you and the atelier.
        </p>
      </section>

      {loading ? (
        <div className="min-h-[30vh] grid place-items-center">
          <Loader2 className="animate-spin text-accent" size={26} />
        </div>
      ) : (
        <InquiryStepper prefillProduct={prefill} />
      )}
    </div>
  );
}