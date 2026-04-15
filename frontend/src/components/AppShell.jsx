import { NavLink } from "react-router-dom";

const navLinkBase =
  "group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition";

const AppShell = ({ title, right, children }) => {
  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      <div className="flex w-full gap-6 px-4 py-6 md:px-6 lg:px-10">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 md:block">
          <div className="sticky top-6 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
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
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold tracking-tight">
                {title}
              </h1>
            </div>
            <div className="flex items-center gap-2">{right}</div>
          </header>

          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="p-5 md:p-6 lg:p-7">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;

