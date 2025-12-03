import React from "react";

export default function SectionHeading({ title, subtitle }) {
  return (
    <div className="text-center space-y-2">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
      {subtitle && <p className="text-slate-600">{subtitle}</p>}
    </div>
  );
}