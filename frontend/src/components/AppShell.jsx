import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const navLinkBase =
  "group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition";

const AppShell = ({ title, right, children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Close drawer on route change (mobile UX)
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileSidebarOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMobileSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileSidebarOpen]);

  const renderSidebarContent = () => (
    <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
      <div className="px-2 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-tight">
              Cal.com Clone
            </div>
            <div className="truncate text-xs text-neutral-500">
              Default workspace
            </div>
          </div>
        </div>
      </div>

      <nav className="mt-2 space-y-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${navLinkBase} ${isActive
              ? "bg-neutral-900 text-white"
              : "text-neutral-700 hover:bg-neutral-100"
            }`
          }
        >
          <span className="truncate">Event types</span>
        </NavLink>

        <NavLink
          to="/availability"
          className={({ isActive }) =>
            `${navLinkBase} ${isActive
              ? "bg-neutral-900 text-white"
              : "text-neutral-700 hover:bg-neutral-100"
            }`
          }
        >
          <span className="truncate">Availability</span>
        </NavLink>

        <NavLink
          to="/overrides"
          className={({ isActive }) =>
            `${navLinkBase} ${isActive
              ? "bg-neutral-900 text-white"
              : "text-neutral-700 hover:bg-neutral-100"
            }`
          }
        >
          <span className="truncate">Date overrides</span>
        </NavLink>

        <NavLink
          to="/bookings"
          className={({ isActive }) =>
            `${navLinkBase} ${isActive
              ? "bg-neutral-900 text-white"
              : "text-neutral-700 hover:bg-neutral-100"
            }`
          }
        >
          <span className="truncate">Bookings</span>
        </NavLink>
      </nav>
    </div>
  );

  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      {/* Mobile sidebar drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${mobileSidebarOpen ? "" : "pointer-events-none"
          }`}
        aria-hidden={!mobileSidebarOpen}
      >
        {/* Backdrop */}
        <button
          type="button"
          className={`absolute inset-0 bg-neutral-900/40 transition-opacity ${mobileSidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close menu"
        />

        {/* Drawer */}
        <div
          className={`absolute left-0 top-0 h-full w-[18.5rem] max-w-[85vw] bg-neutral-50 p-4 transition-transform ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold tracking-tight text-neutral-900">
              Menu
            </div>
            <button
              type="button"
              className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-sm text-neutral-700 hover:bg-neutral-50"
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>
          {renderSidebarContent()}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1600px] gap-6 px-4 py-6 md:px-6 lg:px-10">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-6">
            {renderSidebarContent()}
          </div>
        </aside>

        {/* Main */}
        <main className="flex min-h-[calc(100dvh-3rem)] min-w-0 flex-1 flex-col">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-2.5 py-2 text-neutral-700 shadow-sm hover:bg-neutral-50 md:hidden"
                  onClick={() => setMobileSidebarOpen(true)}
                  aria-label="Open menu"
                >
                  {/* 3-dots icon */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M4.5 8.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM10 8.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM15.5 8.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
                  </svg>
                </button>

                <h1 className="truncate text-xl font-semibold tracking-tight">
                  {title}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">{right}</div>
          </header>

          <div className="flex flex-1 flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="flex-1 p-5 md:p-6 lg:p-7">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;

