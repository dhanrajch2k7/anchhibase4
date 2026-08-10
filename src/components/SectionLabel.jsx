import React from "react";

export default function SectionLabel({ children, className = "", light = false }) {
  return (
    <span className={`label-caps ${light ? "text-gold" : "text-accent"} ${className}`}>
      {children}
    </span>
  );
}