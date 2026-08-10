import React from "react";

export default function StitchDivider({ className = "", label }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="flex-1 border-t border-dotted border-accent/60" />
      {label && <span className="label-caps text-accent/80 whitespace-nowrap">{label}</span>}
      <span className="flex-1 border-t border-dotted border-accent/60" />
    </div>
  );
}