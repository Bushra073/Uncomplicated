import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

import {
  UserRound,
  ChevronDown,
  LayoutDashboard,
  Compass,
  FolderOpen,
  Bookmark,
  LogOut,
  ArrowUpRight,
} from 'lucide-react'

export default function LandingNavbar() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()

  const links = [
    { label: 'My Dashboard', route: '/dashboard', icon: LayoutDashboard },
    { label: 'Explore Procedures', route: '/procedures', icon: Compass },
    { label: 'Document Hub', route: '/documents', icon: FolderOpen },
    { label: 'Knowledge Shelf', route: '/knowledge', icon: Bookmark },
  ]

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="relative z-[100] mx-auto max-w-7xl px-5 pt-5 md:px-10">
      <nav className="flex items-center justify-between gap-4 rounded-full border border-white/80 bg-white/45 px-4 py-3 shadow-sm backdrop-blur-xl md:px-6">

        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#164C49] font-serif text-2xl italic text-white">
            u.
          </span>

          <span className="hidden text-xs font-bold tracking-[0.12em] text-[#164C49] sm:block">
            UNCOMPLICATED
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-[#164C49]/75 md:flex">
          <a href="#why" className="transition hover:text-[#164C49]">
            The idea
          </a>

          <a href="#features" className="transition hover:text-[#164C49]">
            Explore features
          </a>
        </div>

        {token ? (
          <div className="dropdown dropdown-end">
            <button
              type="button"
              tabIndex={0}
              aria-label="Open account menu"
              className="flex cursor-pointer items-center gap-2 rounded-full border border-[#164C49]/10 bg-white/60 p-1.5 pr-3 text-[#164C49]"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#164C49] text-white">
                <UserRound size={18} />
              </span>

              <ChevronDown size={14} />
            </button>

            <div
              tabIndex={0}
              className="dropdown-content mt-4 w-72 max-w-[85vw] rounded-[1.75rem] border border-white bg-[#F5F7F3] p-3 shadow-xl"
            >
              <div className="rounded-2xl bg-[#164C49]/5 p-4">
                <p className="truncate font-semibold text-[#164C49]">
                  {user?.full_name || user?.name || 'My Account'}
                </p>

                <p className="mt-1 truncate text-xs text-[#164C49]/60">
                  {user?.email}
                </p>
              </div>

              <ul className="menu mt-2 w-full gap-1 p-0">
                {links.map(({ label, route, icon: Icon }) => (
                  <li key={route}>
                    <Link
                      to={route}
                      className="flex items-center gap-3 rounded-xl p-3 text-sm text-[#164C49]"
                    >
                      <Icon size={17} />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 flex w-full items-center gap-3 rounded-xl border-t border-[#164C49]/10 p-3 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={17} />
                Log out
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-[#164C49]"
            >
              Log in
            </Link>

            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full bg-[#164C49] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#397C76]"
            >
              Sign up
              <ArrowUpRight size={15} />
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}