import React from "react";

export default function Navbar() {
  return (
    <nav className="border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="font-bold text-xl">VoteSystem</div>
        </div>
      </div>
    </nav>
  );
}