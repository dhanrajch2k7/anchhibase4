const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

const occasions = ["Wedding", "Engagement", "Reception", "Mehendi / Sangeet", "Festive", "Other"];
const timelines = ["Under 1 month", "1-3 months", "3-6 months", "6+ months"];

function OptionTile({ label, sub, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-5 rounded-sm border transition-all focus-gold ${
        selected
          ? "border-accent bg-accent/10 shadow-[0_0_0_2px_hsl(var(--accent))]"
          : "border-border hover:border-accent/60 hover:bg-muted/50"
      }`}
    >
      <span className="display-hero text-xl text-secondary block">{label}</span>
      {sub && <span className="text-muted-foreground text-sm">{sub}</span>}
    </button>
  );
}

export default function InquiryStepper({ prefillProduct, onComplete }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    occasion: "Wedding",
    timeline: "3-6 months",
    product_id: prefillProduct?.id || "",
    product_name: prefillProduct?.name || "",
    client_name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);

  const total = 4;
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setSubmitting(true);
    try {
      const ref = "ANH-" + Math.random().toString(36).slice(2, 7).toUpperCase();
      await db.entities.Inquiry.create({ ...form, reference_number: ref });
      setDone(ref);
      onComplete && onComplete(ref);
    } catch (e) {
      setSubmitting(false);
      alert("Something went wrong sending your inquiry. Please try again.");
    }
  };

  if (done) {
    return <SuccessState reference={done} />;
  }

  const canNext =
    step === 0 ||
    step === 1 ||
    (step === 2) ||
    (step === 3 && form.client_name.trim() && /\S+@\S+\.\S+/.test(form.email));

  return (
    <div className="max-w-xl mx-auto px-5 py-10">
      {/* progress stitch */}
      <div className="flex items-center gap-2 mb-10">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-accent" : "bg-border"}`}
          />
        ))}
      </div>

      <div className="min-h-[18rem]">
        {step === 0 && (
          <div className="animate-fade-up">
            <span className="label-caps text-accent">Step One</span>
            <h2 className="display-hero text-4xl mt-2 mb-1">Which occasion are we celebrating?</h2>
            <p className="text-muted-foreground mb-6">Every thread is woven for a moment. Tell us yours.</p>
            <div className="grid gap-3">
              {occasions.map((o) => (
                <OptionTile key={o} label={o} selected={form.occasion === o} onClick={() => set("occasion", o)} />
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-up">
            <span className="label-caps text-accent">Step Two</span>
            <h2 className="display-hero text-4xl mt-2 mb-1">What is your timeline?</h2>
            <p className="text-muted-foreground mb-6">Bespoke pieces take time. We plan the craft around your date.</p>
            <div className="grid grid-cols-2 gap-3">
              {timelines.map((t) => (
                <OptionTile key={t} label={t} selected={form.timeline === t} onClick={() => set("timeline", t)} />
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-up">
            <span className="label-caps text-accent">Step Three</span>
            <h2 className="display-hero text-4xl mt-2 mb-1">The piece in mind</h2>
            <p className="text-muted-foreground mb-6">A specific silhouette, or an open heart?</p>
            {prefillProduct ? (
              <div className="p-5 rounded-sm border border-accent bg-accent/10 mb-4">
                <span className="label-caps text-gold">Selected</span>
                <p className="display-hero text-2xl mt-1">{prefillProduct.name}</p>
                <p className="text-muted-foreground text-sm">{prefillProduct.embroidery_type} · {prefillProduct.color}</p>
                <button className="label-caps text-accent mt-3 underline" onClick={() => { set("product_id", ""); set("product_name", ""); }}>
                  Inquire about something else
                </button>
              </div>
            ) : (
              <textarea
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder="Describe the silhouette, colours, or feeling you're dreaming of…"
                rows={5}
                className="w-full p-4 rounded-sm border border-border bg-card focus-gold resize-none"
              />
            )}
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-up">
            <span className="label-caps text-accent">Step Four</span>
            <h2 className="display-hero text-4xl mt-2 mb-1">Where do we send the invitation?</h2>
            <p className="text-muted-foreground mb-6">Our atelier will reach out personally to begin your consultation.</p>
            <div className="grid gap-4">
              <input
                value={form.client_name}
                onChange={(e) => set("client_name", e.target.value)}
                placeholder="Your name"
                className="w-full p-4 rounded-sm border border-border bg-card focus-gold"
              />
              <input
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                type="email"
                placeholder="Email"
                className="w-full p-4 rounded-sm border border-border bg-card focus-gold"
              />
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="Phone (optional)"
                className="w-full p-4 rounded-sm border border-border bg-card focus-gold"
              />
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => (step === 0 ? navigate(-1) : setStep((s) => s - 1))}
          className="flex items-center gap-2 label-caps text-muted-foreground hover:text-secondary focus-gold p-2"
        >
          <ArrowLeft size={16} /> Back
        </button>
        {step < total - 1 ? (
          <button
            disabled={!canNext}
            onClick={() => setStep((s) => s + 1)}
            className="flex items-center gap-2 px-6 py-3 rounded-sm bg-secondary text-silk label-caps disabled:opacity-40 hover:bg-primary transition-colors focus-gold"
          >
            Continue <ArrowRight size={16} />
          </button>
        ) : (
          <button
            disabled={!canNext || submitting}
            onClick={submit}
            className="flex items-center gap-2 px-6 py-3 rounded-sm bg-primary text-silk label-caps hover:opacity-90 transition-opacity focus-gold"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            {submitting ? "Sending" : "Send Inquiry"}
          </button>
        )}
      </div>
    </div>
  );
}

function SuccessState({ reference }) {
  const threads = Array.from({ length: 18 });
  return (
    <div className="relative max-w-xl mx-auto px-5 py-16 text-center overflow-hidden">
      {/* Falling gold thread */}
      {threads.map((_, i) => (
        <span
          key={i}
          className="absolute top-0 w-px bg-gradient-to-b from-transparent via-gold to-transparent animate-thread-fall"
          style={{
            left: `${(i * 5.5 + 4) % 100}%`,
            height: `${40 + (i % 4) * 30}px`,
            animationDelay: `${(i % 7) * 0.18}s`,
            opacity: 0.7,
          }}
        />
      ))}
      <div className="relative animate-fade-up">
        <span className="label-caps text-accent">Inquiry Received</span>
        <h2 className="display-hero text-5xl mt-3 mb-4">Threads woven, awaiting you.</h2>
        <p className="text-muted-foreground max-w-sm mx-auto mb-8">
          Our atelier has received your request. A member of the Anchhi team will reach out personally within two working days.
        </p>
        <div className="inline-block border border-dotted border-accent rounded-sm px-6 py-4">
          <span className="label-caps text-muted-foreground block">Your reference</span>
          <span className="display-hero text-3xl gold-text mt-1">{reference}</span>
        </div>
        <div className="mt-10">
          <a href="/" className="label-caps text-secondary underline underline-offset-4 focus-gold">Return to the showroom</a>
        </div>
      </div>
    </div>
  );
}