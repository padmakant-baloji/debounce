import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, Menu, X } from "lucide-react";
import { clsx } from "clsx";

const routes = [
  { path: "/trailing-debounce", label: "T-Debounce" },
  { path: "/leading-debounce", label: "L-Debounce" },
  { path: "/leading-trailing-debounce", label: "L/T-Debounce" },
  { path: "/leading-throttle", label: "L-Throttle" },
  { path: "/trailing-throttle", label: "T-Throttle" },
  { path: "/leading-trailing-throttle", label: "L/T-Throttle" },
  { path: "/combined-techniques", label: "Combined" },
  { path: "/memory-leak", label: "Memory" },
  { path: "/documentation", label: "Documentation" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-abbyy-gray-50">
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-200",
          scrolled ? "shadow-abbyy" : ""
        )}
      >
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <Link
              to="/"
              className="flex items-center gap-2 text-abbyy-primary hover:text-abbyy-secondary transition-colors shrink-0"
              aria-label="Performance Home"
            >
              <Activity className="w-6 h-6" aria-hidden="true" />
              <span className="font-semibold text-lg whitespace-nowrap">
                Performance
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block mx-4 flex-1">
              <ul className="flex items-center justify-center gap-1">
                {routes.map((route) => (
                  <li key={route.path}>
                    <Link
                      to={route.path}
                      className={clsx(
                        "px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                        location.pathname === route.path
                          ? "bg-abbyy-primary bg-opacity-10 text-abbyy-primary"
                          : "text-abbyy-gray-600 hover:bg-abbyy-gray-100"
                      )}
                    >
                      {route.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md text-abbyy-gray-600 hover:text-abbyy-primary hover:bg-abbyy-gray-100"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={clsx(
              "lg:hidden overflow-hidden transition-all duration-200 ease-in-out",
              isMenuOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <nav className="py-3 border-t border-abbyy-gray-100">
              <ul className="space-y-1">
                {routes.map((route) => (
                  <li key={route.path}>
                    <Link
                      to={route.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={clsx(
                        "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        location.pathname === route.path
                          ? "bg-abbyy-primary bg-opacity-10 text-abbyy-primary"
                          : "text-abbyy-gray-600 hover:bg-abbyy-gray-100"
                      )}
                    >
                      {route.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 pt-28 pb-16">
        {children}
      </main>
    </div>
  );
}
