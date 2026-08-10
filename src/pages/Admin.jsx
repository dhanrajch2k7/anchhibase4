const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from "react";

import { Image } from "@/components/ui/image";
import { Loader2, Plus, Pencil, Trash2, Mail, Check, Lock, Package, Inbox } from "lucide-react";

const CATEGORIES = ["Bridal", "Groom", "Engagement", "Festive", "Accessories"];

export default function Admin() {
  const [tab, setTab] = useState("pieces");
  const [authed, setAuthed] = useState(null); // null = checking

  useEffect(() => {
    (async () => {
      try {
        const me = await db.auth.me();
        setAuthed(me && me.role === "admin");
      } catch (e) {
        setAuthed(false);
      }
    })();
  }, []);

  if (authed === null) {
    return <div className="min-h-[60vh] grid place-items-center"><Loader2 className="animate-spin text-accent" /></div>;
  }

  if (!authed) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-5 text-center">
        <div>
          <Lock className="mx-auto text-accent mb-4" size={32} />
          <h1 className="display-hero text-4xl mb-3">Private Atelier Access</h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            This is the Anchhi team workspace. Only authorised members can manage the catalogue and inquiries here.
          </p>
          <a href="/" className="inline-block mt-6 label-caps text-secondary underline underline-offset-4">Return to showroom</a>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in px-5 py-10 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-8 border-b border-border pb-3">
        <TabBtn active={tab === "pieces"} onClick={() => setTab("pieces")} icon={Package}>Pieces</TabBtn>
        <TabBtn active={tab === "inquiries"} onClick={() => setTab("inquiries")} icon={Inbox}>Inquiries</TabBtn>
      </div>
      {tab === "pieces" ? <PiecesManager /> : <InquiriesManager />}
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 label-caps border-b-2 transition-colors focus-gold ${
        active ? "border-accent text-secondary" : "border-transparent text-muted-foreground hover:text-secondary"
      }`}
    >
      <Icon size={15} /> {children}
    </button>
  );
}

/* ----------------- PIECES ----------------- */
function PiecesManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const ps = await db.entities.Product.list("-created_date", 100);
      setItems(ps || []);
    } catch (e) {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Remove this piece from the showroom?")) return;
    await db.entities.Product.delete(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="display-hero text-3xl">{items.length} pieces</h2>
        <button onClick={() => setEditing({ category: "Bridal", is_statement: false, detail_images: [] })} className="flex items-center gap-2 px-4 py-2 rounded-sm bg-secondary text-silk label-caps hover:bg-primary focus-gold">
          <Plus size={15} /> Add piece
        </button>
      </div>

      {loading ? <Loader2 className="animate-spin text-accent" /> : (
        <div className="grid gap-4">
          {items.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-3 border border-border rounded-sm">
              {p.image_url && <Image src={p.image_url} alt={p.name} className="w-16 h-20 object-cover rounded-sm" fittingType="fill" />}
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-lg">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.category} · {p.embroidery_type || "—"} · {p.color || "—"}</p>
              </div>
              <button onClick={() => setEditing(p)} className="p-2 hover:text-accent focus-gold"><Pencil size={16} /></button>
              <button onClick={() => remove(p.id)} className="p-2 hover:text-destructive focus-gold"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}

      {editing && <PieceForm initial={editing} onClose={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function PieceForm({ initial, onClose }) {
  const [f, setF] = useState(initial);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      const { file_url } = await db.integrations.Core.UploadFile({ file });
      set("image_url", file_url);
    } catch (e) {}
    setSaving(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...f, detail_images: (f.detail_images || []).filter(Boolean) };
      if (f.id) await db.entities.Product.update(f.id, payload);
      else await db.entities.Product.create(payload);
      onClose();
    } catch (e) {
      alert("Could not save: " + (e.message || "error"));
      setSaving(false);
    }
  };

  const field = "w-full p-2.5 rounded-sm border border-border bg-card text-sm focus-gold";

  return (
    <div className="fixed inset-0 z-[60] bg-secondary/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-6" onClick={onClose}>
      <div className="bg-background w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-sm p-5" onClick={(e) => e.stopPropagation()}>
        <h3 className="display-hero text-2xl mb-4">{f.id ? "Edit piece" : "New piece"}</h3>
        <div className="grid gap-3">
          <input className={field} placeholder="Piece name" value={f.name || ""} onChange={(e) => set("name", e.target.value)} />
          <select className={field} value={f.category} onChange={(e) => set("category", e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <textarea className={field} placeholder="Description" rows={3} value={f.description || ""} onChange={(e) => set("description", e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <input className={field} placeholder="Fabric" value={f.fabric || ""} onChange={(e) => set("fabric", e.target.value)} />
            <input className={field} placeholder="Embroidery" value={f.embroidery_type || ""} onChange={(e) => set("embroidery_type", e.target.value)} />
            <input className={field} placeholder="Colour" value={f.color || ""} onChange={(e) => set("color", e.target.value)} />
            <input className={field} type="number" placeholder="Hours" value={f.craftsmanship_hours || ""} onChange={(e) => set("craftsmanship_hours", Number(e.target.value))} />
            <input className={field} placeholder="Price range" value={f.price_range || ""} onChange={(e) => set("price_range", e.target.value)} />
            <label className="flex items-center gap-2 mt-1">
              <input type="checkbox" checked={!!f.is_statement} onChange={(e) => set("is_statement", e.target.checked)} />
              <span className="text-sm">Statement piece</span>
            </label>
          </div>
          <div>
            <span className="label-caps text-muted-foreground block mb-1">Main image</span>
            <input type="file" accept="image/*" onChange={onFile} className="text-sm" />
            {f.image_url && <Image src={f.image_url} alt="preview" className="w-full h-40 object-cover mt-2 rounded-sm" fittingType="fill" />}
            <input className={field + " mt-2"} placeholder="…or paste image URL" value={f.image_url || ""} onChange={(e) => set("image_url", e.target.value)} />
          </div>
          <div>
            <span className="label-caps text-muted-foreground block mb-1">Detail images (one URL per line)</span>
            <textarea
              className={field}
              rows={3}
              value={(f.detail_images || []).join("\n")}
              onChange={(e) => set("detail_images", e.target.value.split("\n"))}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 label-caps text-muted-foreground hover:text-secondary focus-gold">Cancel</button>
          <button onClick={save} disabled={saving} className="px-4 py-2 rounded-sm bg-primary text-silk label-caps hover:opacity-90 focus-gold disabled:opacity-50">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------- INQUIRIES ----------------- */
function InquiriesManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const list = await db.entities.Inquiry.list("-created_date", 100);
      setItems(list || []);
    } catch (e) {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    await db.entities.Inquiry.update(id, { status });
    load();
  };

  const statusColor = { new: "bg-accent/20 text-accent", contacted: "bg-primary/15 text-primary", closed: "bg-muted text-muted-foreground" };

  return (
    <div>
      <h2 className="display-hero text-3xl mb-5">{items.length} inquiries</h2>
      {loading ? <Loader2 className="animate-spin text-accent" /> : items.length === 0 ? (
        <p className="text-muted-foreground">No inquiries yet.</p>
      ) : (
        <div className="grid gap-3">
          {items.map((i) => (
            <div key={i.id} className="p-4 border border-border rounded-sm">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <span className="font-heading text-lg">{i.client_name}</span>
                  {i.product_name && <span className="text-muted-foreground text-sm"> · re: {i.product_name}</span>}
                  <span className={`ml-2 label-caps px-2 py-0.5 rounded-full text-[0.6rem] ${statusColor[i.status] || ""}`}>{i.status}</span>
                </div>
                {i.reference_number && <span className="label-caps text-muted-foreground text-[0.6rem]">{i.reference_number}</span>}
              </div>
              <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1">
                <span><Mail size={12} className="inline mr-1" />{i.email}</span>
                {i.phone && <span>{i.phone}</span>}
                <span>· {i.occasion}</span>
                <span>· {i.timeline}</span>
              </div>
              {i.message && <p className="text-sm mt-2 italic">"{i.message}"</p>}
              <div className="flex gap-2 mt-3">
                {["new", "contacted", "closed"].map((s) => (
                  <button key={s} onClick={() => setStatus(i.id, s)} className={`label-caps px-3 py-1 rounded-full text-[0.6rem] border ${i.status === s ? "bg-secondary text-silk border-secondary" : "border-border text-muted-foreground hover:text-secondary"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}