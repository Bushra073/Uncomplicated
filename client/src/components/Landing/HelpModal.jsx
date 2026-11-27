import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

import {
  X,
  Route,
  FolderOpen,
  Bookmark,
  ArrowRight,
  LayoutDashboard,
  CircleHelp,
} from 'lucide-react'

export default function HelpModal({ children }) {
  const dialogRef = useRef(null)
  const navigate = useNavigate()
  const { token } = useAuth()

  const open = () => dialogRef.current?.showModal()
  const close = () => dialogRef.current?.close()

  const goTo = (path) => {
    close()
    navigate(path)
  }

  const features = [
    {
      icon: Route,
      number: '01',
      title: 'Procedure Navigator',
      description:
        'Not sure how to renew a passport, correct your NID or apply for a scholarship? Find a guide, check the requirements, understand the steps and track your progress.',
      action: 'Explore procedures',
      path: '/procedures',
      color: 'bg-[#E3EDDA]',
    },
    {
      icon: FolderOpen,
      number: '02',
      title: 'Personal Document Hub',
      description:
        'Keep important documents organized in one place. Add document details, upload files and keep track of expiry dates and upcoming renewals.',
      action: 'Organize documents',
      path: '/documents',
      color: 'bg-[#F1E2D5]',
    },
    {
      icon: Bookmark,
      number: '03',
      title: 'Saved Knowledge Shelf',
      description:
        'Save helpful articles, videos, reels and tutorials. Organize them into collections and connect useful resources to your ongoing procedures.',
      action: 'Explore knowledge shelf',
      path: '/knowledge',
      color: 'bg-[#E3E5F1]',
    },
  ]

  return (
    <>
      {children(open)}

      <dialog
        ref={dialogRef}
        className="modal backdrop:bg-[#103B37]/50 backdrop:backdrop-blur-sm"
      >
        <div className="modal-box max-h-[88dvh] w-[94%] max-w-3xl rounded-[2rem] bg-[#F8F9F3] p-0 text-[#164C49] shadow-2xl">

          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#103B37] to-[#28665B] p-6 text-white md:p-8">

            <button
              type="button"
              onClick={close}
              aria-label="Close help"
              className="btn btn-circle btn-sm absolute right-4 top-4 border-white/20 bg-white/10 text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#DDEBA8]">
              <CircleHelp size={16} />
              Getting started
            </div>

            <h2 className="mt-4 font-serif text-3xl md:text-4xl">
              Welcome to Uncomplicated.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#C4D9CE]">
              Your personal space for figuring out unfamiliar
              procedures, organizing important documents and
              keeping useful information within reach.
              You don't need to know everything before you begin.
            </p>
          </div>

          <div className="space-y-5 p-5 md:p-7">

            <div>
              <h3 className="font-serif text-2xl">
                Three tools. One simpler life.
              </h3>

              <p className="mt-1 text-sm opacity-70">
                Here's what you can do and where to start.
              </p>
            </div>

            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <div
                  key={feature.number}
                  className="flex gap-4 rounded-2xl border border-[#164C49]/10 bg-white/70 p-4 shadow-sm"
                >
                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${feature.color}`}>
                    <Icon size={23} strokeWidth={1.5} />
                  </div>

                  <div className="flex-1">
                    <span className="text-[10px] tracking-widest opacity-50">
                      {feature.number}
                    </span>

                    <h4 className="font-semibold">
                      {feature.title}
                    </h4>

                    <p className="mt-1 text-sm leading-relaxed opacity-80">
                      {feature.description}
                    </p>

                    <button
                      type="button"
                      onClick={() => goTo(
                        feature.path === '/procedures' || token
                          ? feature.path
                          : '/login'
                      )}
                      className="mt-3 inline-flex cursor-pointer items-center gap-2 text-xs font-semibold hover:underline"
                    >
                      {feature.action}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )
            })}

            {/* Beginner walkthrough */}
            <div className="rounded-2xl bg-[#E8EFE4] p-5">
              <h3 className="font-serif text-xl">
                Not sure where to begin?
              </h3>

              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
                <li>Browse procedures and choose what you need help with.</li>
                <li>Read the guide, eligibility and document requirements.</li>
                <li>Create an account to start and track your procedure.</li>
                <li>Organize the documents you need in your Document Hub.</li>
                <li>Save helpful information in your Knowledge Shelf.</li>
                <li>Return to your dashboard to continue where you left off.</li>
              </ol>
            </div>

            <p className="text-xs leading-relaxed opacity-65">
              Uncomplicated provides guidance and organization
              tools. It does not submit official applications
              or verify documents on your behalf. Always confirm
              requirements with the relevant official authority.
            </p>

            <div className="flex flex-wrap gap-3 border-t border-[#164C49]/10 pt-4">

              <button
                type="button"
                onClick={() => goTo(token ? '/dashboard' : '/login')}
                className="btn rounded-full border-none bg-[#164C49] px-6 text-white hover:bg-[#103B37]"
              >
                <LayoutDashboard size={17} />
                {token ? 'My dashboard' : 'Create an account / Login'}
              </button>

              <button
                type="button"
                onClick={() => goTo('/procedures')}
                className="btn btn-outline rounded-full border-[#164C49]/30 text-[#164C49]"
              >
                Browse as a guest
                <ArrowRight size={16} />
              </button>

            </div>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close help">close</button>
        </form>
      </dialog>
    </>
  )
}