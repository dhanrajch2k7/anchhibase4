import React from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { Home as HomeIcon, LayoutGrid, Gem, Mail } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: HomeIcon, end: true },
  { to: "/showroom", label: "Showroom", icon: LayoutGrid, end: false },
  { to: "/about", label: "Atelier", icon: Gem, end: false },
  { to: "/inquiry", label: "Inquire", icon: Mail, end: false },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal brand bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-5 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="display-hero text-2xl tracking-tight text-secondary">Anchhi</span>
            <span className="hidden sm:inline label-caps text-muted-foreground group-hover:text-accent transition-colors">Threads of Heritage</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-7">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `label-caps transition-colors focus-gold ${
                    isActive ? "text-secondary" : "text-muted-foreground hover:text-secondary"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 pb-24">
        <Outlet />
      </main>

      {/* Floating bottom navigation — mobile-first app feel */}
      <nav className="fixed bottom-0 inset-x-0 z-40 sm:hidden">
        <div className="mx-3 mb-3 rounded-full bg-secondary/95 backdrop-blur-md border border-gold/30 shadow-2xl">
          <div className="grid grid-cols-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex flex-col items-center justify-center py-3 gap-0.5 transition-colors focus-gold rounded-full ${
                      isActive ? "text-gold" : "text-silk/70"
                    }`
                  }
                >
                  <Icon size={20} strokeWidth={1.6} />
                  <span className="text-[0.6rem] tracking-wider uppercase">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}