const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { ArrowRight } from "lucide-react";
import StitchDivider from "@/components/StitchDivider";

export default function About() {
  return (
    <div className="animate-fade-in">
      {/* Owner / brand story hero */}
      <section className="relative h-[60vh] min-h-[26rem] bg-secondary overflow-hidden">
        <Image
          src="/images/8304248bd_generated_image.png"
          alt="Anchhi atelier — heritage couture"
          className="w-full h-full object-cover opacity-80"
          fittingType="fill"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-10">
          <div className="mx-auto max-w-7xl">
            <span className="label-caps text-gold">The Atelier</span>
            <h1 className="display-hero text-silk text-6xl sm:text-8xl mt-2">Our Story</h1>
          </div>
        </div>
      </section>

      {/* Owner narrative */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-3xl">
          <StitchDivider label="The Founder" className="mb-8" />
          <p className="text-2xl font-heading italic text-secondary leading-relaxed mb-6">
            "I grew up watching my grandmother's wedding lehenga being re-stitched for my mother, and one day, for me.
            That single piece of cloth held three weddings, three lifetimes of memory. Anchhi is my promise to make
            more of them."
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">— Anchhi, Founder & Creative Director</p>
          <p className="text-secondary leading-relaxed">
            What began in a small Lucknow workshop with three karigars and a single zardosi frame is now a atelier of
            over forty artisans, each a keeper of a technique older than the company itself. We design slowly. We
            source honestly. We stitch with the patience of people who know their work will outlive them.
          </p>
        </div>
      </section>

      {/* Artisan section */}
      <section className="bg-secondary text-silk py-20 px-5 heritage-grain">
        <div className="mx-auto max-w-7xl grid sm:grid-cols-2 gap-10 items-center">
          <div className="relative h-96 sm:h-[30rem] rounded-sm overflow-hidden mask-angular">
            <Image
              src="/images/64d3208ef_generated_image.png"
              alt="A master karigar at work"
              className="w-full h-full object-cover animate-slow-zoom"
              fittingType="fill"
            />
          </div>
          <div>
            <span className="label-caps text-gold">Our Karigars</span>
            <h2 className="display-hero text-4xl sm:text-5xl mt-2 mb-5">Hands that remember</h2>
            <p className="text-silk/80 leading-relaxed mb-6">
              Our artisans are not employees — they are partners. Many learned the needle as children, sitting beside a
              parent or grandparent. We honour that lineage with fair, year-round work, healthcare, and a share in
              every piece they sign. When you wear Anchhi, you wear their name.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <Stat n="40+" label="Artisans" />
              <Stat n="4" label="Generations" />
              <Stat n="100%" label="Hand-stitched" />
            </div>
          </div>
        </div>
      </section>

      {/* What we make */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <StitchDivider label="What We Make" className="mb-10 max-w-xs" />
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { t: "Bridal Couture", d: "Lehengas, gowns and anarkalis woven over hundreds of hours for the one day that becomes a memory." },
              { t: "Groom Wear", d: "Sherwanis, bandhgalas and kurta sets with architectural cuts and heritage finishing." },
              { t: "Festive & Engagement", d: "Lighter pieces for the mehendi, the sangeet and the evenings that lead up to the vows." },
            ].map((c) => (
              <div key={c.t} className="p-6 border border-dotted border-accent/50 rounded-sm">
                <h3 className="display-hero text-2xl mb-2">{c.t}</h3>
                <p className="text-muted-foreground leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-24 text-center">
        <h2 className="display-hero text-4xl sm:text-6xl mb-5">Come visit the atelier.</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          By appointment only. Tell us the occasion and we'll prepare a private viewing.
        </p>
        <Link
          to="/inquiry"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-sm bg-primary text-silk label-caps hover:opacity-90 animate-pulse-gold focus-gold"
        >
          Request a Consultation <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}

function Stat({ n, label }) {
  return (
    <div className="border-l border-dotted border-gold/40 pl-3">
      <span className="display-hero text-3xl gold-text block">{n}</span>
      <span className="label-caps text-silk/60 text-[0.6rem]">{label}</span>
    </div>
  );
}