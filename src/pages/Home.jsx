const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Image } from "@/components/ui/image";
import { ArrowRight, ArrowDown } from "lucide-react";
import StitchDivider from "@/components/StitchDivider";

const FALLBACK_COLLECTIONS = [
  {
    name: "Noor",
    tagline: "The Light of the Bride",
    description: "Crimson silks and zardosi gold — for the one who carries the light of generations.",
    hero_image_url: "/images/bcf98c731_generated_image.png",
    accent_color: "#E34A26",
  },
  {
    name: "Roshni",
    tagline: "Festive Reverie",
    description: "Saffron meets teal in a twirl of celebration — made for the mehendi and the dance floor.",
    hero_image_url: "/images/d3b28e7ac_generated_image.png",
    accent_color: "#D4AF37",
  },
  {
    name: "Virasat",
    tagline: "The Groom's Heritage",
    description: "Ivory sherwanis with architectural collars — heritage worn with a quiet power.",
    hero_image_url: "/images/bee6d4591_generated_image.png",
    accent_color: "#0A2E36",
  },
];

export default function Home() {
  const [collections, setCollections] = useState([]);
  const [active, setActive] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const cols = await db.entities.Collection.list("order", 20);
        if (cols && cols.length) setCollections(cols);
      } catch (e) {}
      try {
        const ps = await db.entities.Product.list("-created_date", 6);
        if (ps) setProducts(ps);
      } catch (e) {}
    })();
  }, []);

  const slides = collections.length ? collections : FALLBACK_COLLECTIONS;

  return (
    <div className="animate-fade-in">
      {/* HERO — full-bleed vertical collection cover */}
      <section className="relative h-[88vh] min-h-[36rem] overflow-hidden bg-secondary">
        {slides.map((c, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-[1.2s] ease-out ${i === active ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={c.hero_image_url}
              alt={`${c.name} collection — ${c.tagline}`}
              className="w-full h-full object-cover"
              fittingType="fill"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/75 to-secondary/40" />
          </div>
        ))}

        {/* Giant semi-transparent collection name overlay */}
        <div className="absolute inset-0 flex items-end pointer-events-none">
          <div className="mx-auto max-w-7xl w-full px-5 pb-28 sm:pb-16">
            <div className="relative">
              <span className="label-caps text-gold block mb-3 animate-fade-up">Anchhi · A Digital Atelier</span>
              <h1 className="display-hero text-silk text-[18vw] sm:text-[12rem] leading-none opacity-95 drop-shadow-[0_3px_12px_rgba(0,0,0,0.55)]">
                {slides[active]?.name}
              </h1>
              <p className="text-silk text-lg sm:text-2xl mt-2 max-w-xl italic font-heading drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                {slides[active]?.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Cover dots / swipe control */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-3 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Collection ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all focus-gold ${i === active ? "bg-gold h-8" : "bg-silk/40"}`}
            />
          ))}
        </div>

        <Link
          to="/showroom"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-silk/70 hover:text-gold animate-fade-in"
        >
          <span className="label-caps">Enter the Showroom</span>
          <ArrowDown size={18} className="animate-bounce" />
        </Link>
      </section>

      {/* BRAND STATEMENT */}
      <section className="py-20 sm:py-28 px-5">
        <div className="mx-auto max-w-3xl text-center">
          <StitchDivider label="Our Philosophy" className="mb-8" />
          <h2 className="display-hero text-4xl sm:text-6xl mb-6">
            We do not make clothes. We <span className="gold-text">weave heirlooms.</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Anchhi is born from the hands of karigars who have carried the needle for generations. Every lehenga, every
            sherwani, is a quiet conversation between heritage and the woman or man who wears it forward. This is couture
            with a soul — stitched slowly, worn forever.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 mt-8 label-caps text-secondary border-b border-dotted border-accent pb-1 hover:text-primary focus-gold"
          >
            Discover the atelier <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* FEATURED COLLECTIONS */}
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="label-caps text-accent">The Collections</span>
              <h2 className="display-hero text-4xl sm:text-5xl mt-1">Curated by mood</h2>
            </div>
            <Link to="/showroom" className="label-caps text-muted-foreground hover:text-secondary focus-gold hidden sm:inline">
              View all →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {slides.map((c, i) => (
              <Link
                key={i}
                to="/showroom"
                className="group relative block h-96 rounded-sm overflow-hidden bg-secondary focus-gold"
              >
                <Image
                  src={c.hero_image_url}
                  alt={`${c.name} — ${c.tagline}`}
                  className="w-full h-full object-cover transition-transform duration-[1.4s] group-hover:scale-110"
                  fittingType="fill"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/65 to-secondary/10" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="label-caps text-gold drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">{c.tagline}</span>
                  <h3 className="display-hero text-silk text-3xl mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">{c.name}</h3>
                  <p className="text-silk/85 text-sm mt-2 line-clamp-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">{c.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* THE VISIONARY — co-founder (stand-out centerpiece) */}
      <section className="relative bg-secondary text-silk py-24 sm:py-32 px-5 heritage-grain overflow-hidden">
        {/* faint oversized backdrop letter */}
        <span aria-hidden="true" className="hidden sm:block absolute -right-10 top-1/2 -translate-y-1/2 display-hero text-[28rem] leading-none text-gold/5 select-none pointer-events-none">N</span>
        <div className="relative mx-auto max-w-7xl grid sm:grid-cols-[auto_1fr] gap-10 sm:gap-16 items-center">
          <div className="mx-auto">
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden border-2 border-gold/50 shadow-2xl">
              <Image
                src="/images/c74e22773_founder.jpg"
                alt="Naresh Kumar, Co-Founder of Anchhi"
                className="w-full h-full object-cover"
                fittingType="fill"
                focalPointX={0.5}
                focalPointY={0.4}
              />
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-gold/50" />
              <span className="label-caps text-gold">Co-Founder</span>
              <span className="h-px w-8 bg-gold/50" />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <span className="label-caps text-gold">The Visionary</span>
            <h2 className="display-hero text-silk text-6xl sm:text-8xl mt-3 mb-5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">Naresh Kumar</h2>
            <p className="text-silk/85 text-lg leading-relaxed max-w-2xl mx-auto sm:mx-0">
              Naresh Kumar envisioned Anchhi as more than a fashion label. With a deep appreciation for timeless
              craftsmanship and refined design, he founded the house to celebrate individuality through luxury couture.
              His vision fuses modern elegance with meticulous artistry — ensuring every collection carries
              sophistication, confidence, and enduring style.
            </p>
            <blockquote className="mt-8 border-l-2 border-gold/60 pl-5 max-w-xl mx-auto sm:mx-0">
              <p className="display-hero gold-text text-3xl sm:text-4xl italic">“A dress must never merely be worn — it must be remembered.”</p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* THE MASTER — artisan */}
      <section className="py-20 sm:py-24 px-5">
        <div className="mx-auto max-w-7xl grid sm:grid-cols-2 gap-10 items-center">
          <div className="relative h-80 sm:h-[30rem] rounded-sm overflow-hidden mask-angular order-2 sm:order-1">
            <Image
              src="/images/6a8004abc_artisan.jpg"
              alt="Mir Irfan, Master of Anchhi"
              className="w-full h-full object-cover"
              fittingType="fill"
              focalPointX={0.5}
              focalPointY={0.35}
            />
          </div>
          <div className="order-1 sm:order-2">
            <StitchDivider label="The Atelier" className="mb-6 max-w-xs" />
            <span className="label-caps text-primary">The Master</span>
            <h2 className="display-hero text-5xl sm:text-7xl mt-3 mb-4 text-secondary">Mir Irfan</h2>
            <span className="label-caps text-muted-foreground block mb-5">Master of the atelier</span>
            <p className="text-secondary leading-relaxed mb-8 max-w-xl">
              With years of experience mastering intricate embroidery, garment construction, and couture finishing
              techniques, Mir Irfan leads the craftsmanship behind every Anchhi creation. His dedication to precision
              and attention to detail ensures each piece embodies the highest standards of luxury tailoring.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="border-l-2 border-primary/40 pl-3">
                <span className="display-hero text-3xl text-primary block">25+</span>
                <span className="label-caps text-muted-foreground text-[0.6rem]">Years of craft</span>
              </div>
              <div className="border-l-2 border-primary/40 pl-3">
                <span className="display-hero text-3xl text-primary block">400h</span>
                <span className="label-caps text-muted-foreground text-[0.6rem]">Per couture piece</span>
              </div>
              <div className="border-l-2 border-primary/40 pl-3">
                <span className="display-hero text-3xl text-primary block">1 of 1</span>
                <span className="label-caps text-muted-foreground text-[0.6rem]">Every garment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CRAFT TEASER */}
      <section className="bg-secondary text-silk py-20 px-5 heritage-grain">
        <div className="mx-auto max-w-7xl grid sm:grid-cols-2 gap-10 items-center">
          <div className="relative h-80 sm:h-[28rem] rounded-sm overflow-hidden mask-angular">
            <Image
              src="/images/64d3208ef_generated_image.png"
              alt="Master karigar embroidering golden zardosi thread by hand"
              className="w-full h-full object-cover animate-slow-zoom"
              fittingType="fill"
            />
          </div>
          <div>
            <span className="label-caps text-gold">The Karigar</span>
            <h2 className="display-hero text-4xl sm:text-5xl mt-2 mb-5">A single piece. Hundreds of hours.</h2>
            <p className="text-silk/80 leading-relaxed mb-6">
              Our master artisans — some of whom have embroidered for four generations — spend up to 600 hours on a
              single bridal piece. Every motif is drawn by hand, every bead set by eye. This is the slow art that no
              machine can mimic.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Stat n="40+" label="Karigars" />
              <Stat n="600hr" label="Per bridal piece" />
              <Stat n="4" label="Generations of craft" />
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 label-caps text-gold border-b border-dotted border-gold/60 pb-1 hover:opacity-80 focus-gold"
            >
              Meet the artisans <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 text-center">
        <StitchDivider className="mb-10 max-w-md mx-auto" />
        <h2 className="display-hero text-4xl sm:text-6xl mb-4">Begin your bespoke journey</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Book a private consultation with the Anchhi atelier. We listen, we sketch, we stitch — for you alone.
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