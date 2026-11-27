import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import HelpModal from './Landing/HelpModal'

import {
  Menu,
  X,
  House,
  LayoutDashboard,
  Route,
  FolderOpen,
  Bookmark,
  CircleHelp,
  ChevronRight,
} from 'lucide-react'

function FloatingDashboard() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [expanded, setExpanded] = useState(false)
  const menuRef = useRef(null)

  const pages = [
    {
      label: 'Home',
      icon: House,
      path: '/',
    },
    {
      label: token ? 'My Dashboard' : 'Login / Sign up',
      icon: LayoutDashboard,
      path: token ? '/dashboard' : '/login',
    },
    {
      label: 'Procedure Navigator',
      icon: Route,
      path: '/procedures',
    },
    {
      label: 'Document Hub',
      icon: FolderOpen,
      path: '/documents',
      protected: true,
    },
    {
      label: 'Knowledge Shelf',
      icon: Bookmark,
      path: '/knowledge',
      protected: true,
    },
  ]

  useEffect(() => {
    setExpanded(false)
  }, [location.pathname])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setExpanded(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setExpanded(false)
      }
    }

    document.addEventListener('pointerdown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const goTo = (page) => {
    setExpanded(false)

    if (page.protected && !token) {
      navigate('/login')
    } else {
      navigate(page.path)
    }
  }

  return (
    <div
      ref={menuRef}
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6"
    >

      <HelpModal>
        {(openHelp) => (
          <>
            {expanded && (
              <div
                id="quick-navigation"
                className="w-64 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-3xl border border-white/80 bg-[#F8FAF5]/95 p-3 shadow-2xl backdrop-blur-xl max-h-[70dvh]"
              >

                {/* Menu heading */}
                <div className="border-b border-[#164C49]/10 px-3 pb-3 pt-2">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#72948E]">
                    Your personal space
                  </span>

                  <h3 className="mt-1 font-serif text-xl text-[#103B37]">
                    Quick navigation
                  </h3>
                </div>

                {/* Navigation links */}
                <div className="mt-2 space-y-1">

                  {pages.map((page) => {
                    const Icon = page.icon

                    const isActive =
                      location.pathname === page.path ||
                      (
                        page.path !== '/' &&
                        location.pathname.startsWith(
                          `${page.path}/`
                        )
                      ) ||
                      (
                        page.path === '/procedures' &&
                        location.pathname.startsWith(
                          '/my-procedures/'
                        )
                      )

                    return (
                      <button
                        key={page.path}
                        type="button"
                        onClick={() => goTo(page)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-[#164C49] text-white'
                            : 'text-[#164C49] hover:bg-[#E3EDE4]'
                        }`}
                      >
                        <Icon size={18} strokeWidth={1.7} />

                        <span className="flex-1">
                          {page.label}
                        </span>

                        <ChevronRight
                          size={14}
                          className="opacity-50"
                        />
                      </button>
                    )
                  })}

                </div>

                {/* Help */}
                <div className="mt-2 border-t border-[#164C49]/10 pt-2">

                  <button
                    type="button"
                    onClick={() => {
                      setExpanded(false)
                      openHelp()
                    }}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-[#164C49] transition-colors hover:bg-[#E3EDE4]"
                  >
                    <CircleHelp size={18} />

                    <span className="flex-1">
                      Help & Getting Started
                    </span>

                    <ChevronRight size={14} />
                  </button>

                </div>

              </div>
            )}
          </>
        )}
      </HelpModal>

      {/* Expand / collapse button */}
      <button
        type="button"
        onClick={() => setExpanded((previous) => !previous)}
        aria-label={expanded ? 'Close navigation' : 'Open navigation'}
        aria-expanded={expanded}
        aria-controls={expanded ? 'quick-navigation' : undefined}
        title={expanded ? 'Close navigation' : 'Quick navigation'}
        className="grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-white/30 bg-[#103B37] text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-[#28665B] active:scale-95 md:h-14 md:w-14"
      >
        {expanded ? (
          <X size={23} strokeWidth={1.8} />
        ) : (
          <Menu size={23} strokeWidth={1.8} />
        )}
      </button>

    </div>
  )
}

export default FloatingDashboard