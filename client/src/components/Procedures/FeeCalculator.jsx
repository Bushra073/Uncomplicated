import { useState } from 'react'

import {
  Calculator,
  Wallet,
  Plus,
  Trash2,
  ReceiptText,
  Clock3,
  BookOpen,
  ArrowUpRight,
  Info,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

import { getCategoryTheme } from './categoryThemes'
import { getProcedurePricing } from './procedurePricing'
import { getExpenseTemplate } from './expenseTemplates'

function money(value) {
  return `৳${Number(value).toLocaleString('en-BD', {
    maximumFractionDigits: 2,
  })}`
}

function amount(value) {
  const number = Number(value)
  return Number.isFinite(number) && number >= 0
    ? number
    : 0
}

function createExpenses(procedure, hasPricing) {
  return getExpenseTemplate(procedure.title)
    .filter(name =>
      !hasPricing || name !== 'Application fee'
    )
    .map((name, index) => ({
      id: index + 1,
      name,
      cost: '',
    }))
}

export default function FeeCalculator({ procedure }) {
  const theme = getCategoryTheme(procedure.category_id)
  const pricing = getProcedurePricing(procedure)

  const [expenses, setExpenses] = useState(() =>
    createExpenses(procedure, Boolean(pricing))
  )

  const [budget, setBudget] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  const [pages, setPages] = useState(
    pricing?.plans[0]?.pages || 48
  )

  const [validity, setValidity] = useState(
    pricing?.plans[0]?.validity || 5
  )

  const [delivery, setDelivery] = useState('regular')

  const selectedPlan = pricing?.plans.find(
    plan =>
      plan.pages === pages &&
      plan.validity === validity
  )

  const officialFee = selectedPlan?.[delivery] || 0

  const additionalExpenses = expenses.reduce(
    (sum, item) => sum + amount(item.cost),
    0
  )

  const total = officialFee + additionalExpenses

  const hasBudget = budget !== ''

  const remaining = amount(budget) - total

  const budgetPercentage =
    amount(budget) > 0
      ? Math.min((total / amount(budget)) * 100, 100)
      : total > 0 ? 100 : 0

  const pageOptions = [
    ...new Set(pricing?.plans.map(plan => plan.pages) || []),
  ]

  const validityOptions = [
    ...new Set(
      pricing?.plans
        .filter(plan => plan.pages === pages)
        .map(plan => plan.validity) || []
    ),
  ]

  const inputStyle =
    'input input-bordered w-full rounded-xl border-white/80 bg-white/70 text-sm'

  function updateExpense(id, field, value) {
    setExpenses(previous =>
      previous.map(item =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    )
  }

  function addExpense() {
    setExpenses(previous => [
      ...previous,
      {
        id: crypto.randomUUID(),
        name: '',
        cost: '',
      },
    ])
  }

  function removeExpense(id) {
    setExpenses(previous =>
      previous.filter(item => item.id !== id)
    )
  }

  function resetPlanner() {
    setExpenses(createExpenses(procedure, Boolean(pricing)))
    setBudget('')
    setPages(pricing?.plans[0]?.pages || 48)
    setValidity(pricing?.plans[0]?.validity || 5)
    setDelivery('regular')
  }

  function changePages(value) {
    const selectedPages = Number(value)

    setPages(selectedPages)

    const available = pricing.plans.filter(
      plan => plan.pages === selectedPages
    )

    if (!available.some(plan => plan.validity === validity)) {
      setValidity(available[0].validity)
    }
  }

  return (
    <section
      className="rounded-[2rem] border border-white/70 bg-white/40 p-5 shadow-lg backdrop-blur-xl md:p-7"
      style={{ color: theme.colors.dark }}
    >

      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">

        <div className="flex items-center gap-4">
          <div
            className="rounded-2xl p-3 shadow-md"
            style={{
              backgroundColor: theme.colors.dark,
              color: theme.colors.accent,
            }}
          >
            <Calculator size={27} />
          </div>

          <div>
            <p className="text-[10px] font-semibold tracking-widest opacity-60">
              YOUR PERSONAL EXPENSE PLANNER
            </p>

            <h2 className="mt-1 font-serif text-3xl">
              Make every taka count.
            </h2>

            <p className="mt-1 text-sm opacity-70">
              Plan your expenses before getting started.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetPlanner}
          className="btn btn-sm rounded-full border-white/70 bg-white/50 normal-case"
          style={{ color: theme.colors.dark }}
        >
          <RotateCcw size={15} />
          Reset planner
        </button>

      </div>

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[1.3fr_1fr]">

        {/* Expense inputs */}
        <div className="space-y-5">

          {/* Passport fee calculator */}
          {pricing && (
            <div
              className="rounded-3xl border border-white/70 p-5"
              style={{
                backgroundColor: theme.colors.secondary,
              }}
            >
              <h3 className="font-serif text-xl">
                Passport application fee
              </h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">

                <label className="text-xs font-medium">
                  Pages

                  <select
                    value={pages}
                    onChange={e => changePages(e.target.value)}
                    className={`${inputStyle} mt-2`}
                  >
                    {pageOptions.map(value => (
                      <option key={value} value={value}>
                        {value} pages
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-xs font-medium">
                  Validity

                  <select
                    value={validity}
                    onChange={e =>
                      setValidity(Number(e.target.value))
                    }
                    className={`${inputStyle} mt-2`}
                  >
                    {validityOptions.map(value => (
                      <option key={value} value={value}>
                        {value} years
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-xs font-medium">
                  Delivery

                  <select
                    value={delivery}
                    onChange={e => setDelivery(e.target.value)}
                    className={`${inputStyle} mt-2`}
                  >
                    <option value="regular">Regular</option>
                    <option value="express">Express</option>
                    <option value="superExpress">
                      Super Express
                    </option>
                  </select>
                </label>

              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl bg-white/50 p-4">

                <span className="text-sm font-medium">
                  Stored application fee
                </span>

                <strong className="font-serif text-2xl">
                  {money(officialFee)}
                </strong>

              </div>

            </div>
          )}

          {/* Personal budget */}
          <div className="rounded-3xl border border-white/70 bg-white/50 p-5">

            <div className="mb-3 flex items-center gap-2">
              <Wallet size={21} />

              <h3 className="font-serif text-xl">
                Set your budget
              </h3>
            </div>

            <label className="text-xs opacity-70">
              How much are you planning to spend?

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter your budget in BDT"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className={`${inputStyle} mt-3`}
              />
            </label>

          </div>

          {/* Expense items */}
          <div className="rounded-3xl border border-white/70 bg-white/50 p-5">

            <h3 className="font-serif text-xl">
              Your expenses
            </h3>

            <p className="mt-2 text-xs leading-relaxed opacity-65">
              Enter estimated or confirmed amounts in BDT.
              Remove items that do not apply to you.
            </p>

            <div className="mt-5 space-y-3">

              {expenses.map(item => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-2 sm:flex-nowrap"
                >

                  <input
                    type="text"
                    aria-label="Expense name"
                    placeholder="Expense name"
                    value={item.name}
                    onChange={e =>
                      updateExpense(
                        item.id,
                        'name',
                        e.target.value
                      )
                    }
                    className={`${inputStyle} min-w-0 flex-1`}
                  />

                  <div className="relative w-28">

                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-60">
                      ৳
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      aria-label={`Cost of ${item.name || 'expense'}`}
                      placeholder="0"
                      value={item.cost}
                      onChange={e =>
                        updateExpense(
                          item.id,
                          'cost',
                          e.target.value
                        )
                      }
                      className={`${inputStyle} pl-7`}
                    />

                  </div>

                  <button
                    type="button"
                    aria-label={`Remove ${item.name || 'expense'}`}
                    onClick={() => removeExpense(item.id)}
                    className="btn btn-ghost btn-square text-red-500 hover:bg-red-100"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>
              ))}

              {!expenses.length && (
                <p className="py-3 text-sm opacity-60">
                  No additional expenses added.
                </p>
              )}

            </div>

            <button
              type="button"
              onClick={addExpense}
              className="btn mt-5 w-full rounded-xl border-dashed normal-case"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.primary,
                color: theme.colors.dark,
              }}
            >
              <Plus size={18} />
              Add another expense
            </button>

          </div>

        </div>

        {/* Dynamic expense summary */}
        <div className="lg:sticky lg:top-6">

          <div
            className="relative isolate overflow-hidden rounded-[2rem] p-6 text-white shadow-xl"
            style={{
              background: `linear-gradient(
                145deg,
                ${theme.colors.primary},
                ${theme.colors.dark}
              )`,
            }}
          >

            <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#ffffff50_1px,transparent_1px)] bg-[length:8px_8px]" />

            <div className="relative">

              <div className="flex items-center justify-between">

                <ReceiptText
                  size={32}
                  style={{ color: theme.colors.accent }}
                />

                <span className="text-[10px] tracking-widest opacity-70">
                  LIVE EXPENSE SUMMARY
                </span>

              </div>

              <p className="mt-7 text-sm opacity-70">
                Total estimated expenses
              </p>

              <p
                aria-live="polite"
                className="mt-2 break-words font-serif text-4xl md:text-5xl"
                style={{ color: theme.colors.accent }}
              >
                {money(total)}
              </p>

              <div className="my-6 border-t border-dashed border-white/30" />

              <div className="space-y-3 text-sm">

                {pricing && (
                  <div className="flex justify-between gap-3">
                    <span className="opacity-70">
                      Stored application fee
                    </span>

                    <span>{money(officialFee)}</span>
                  </div>
                )}

                {expenses
                  .filter(item => amount(item.cost) > 0)
                  .map(item => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-3"
                    >
                      <span className="min-w-0 break-words opacity-75">
                        {item.name || 'Custom expense'}
                      </span>

                      <span className="shrink-0">
                        {money(amount(item.cost))}
                      </span>
                    </div>
                  ))}

              </div>

              {hasBudget && (
                <div className="mt-6 border-t border-white/20 pt-5">

                  <div className="flex justify-between text-sm">
                    <span className="opacity-70">
                      Your budget
                    </span>

                    <span>{money(amount(budget))}</span>
                  </div>

                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/20">

                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${budgetPercentage}%`,
                        backgroundColor:
                          remaining < 0
                            ? '#FCA5A5'
                            : theme.colors.accent,
                      }}
                    />

                  </div>

                  <div className="mt-5 rounded-2xl border border-white/20 bg-white/10 p-4">

                    <div className="flex items-center gap-2 text-sm">

                      {remaining >= 0
                        ? <CheckCircle2 size={19} />
                        : <AlertCircle size={19} />}

                      {remaining >= 0
                        ? 'Remaining budget'
                        : 'Budget shortfall'}

                    </div>

                    <p
                      className="mt-2 font-serif text-3xl"
                      style={{
                        color:
                          remaining >= 0
                            ? theme.colors.accent
                            : '#FCA5A5',
                      }}
                    >
                      {money(Math.abs(remaining))}
                    </p>

                    <p className="mt-2 text-xs leading-relaxed opacity-70">
                      {remaining >= 0
                        ? 'Your entered expenses are within your budget.'
                        : 'Consider increasing your budget or reviewing your expenses.'}
                    </p>

                  </div>

                </div>
              )}

              {!hasBudget && (
                <p className="mt-5 text-xs leading-relaxed opacity-65">
                  Set a personal budget to see how much
                  money you have remaining.
                </p>
              )}

              <p className="mt-5 text-xs leading-relaxed opacity-65">
                Unentered expenses are not included in this total.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Original fee information */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/70 bg-white/50">

        <button
          type="button"
          aria-expanded={showDetails}
          onClick={() => setShowDetails(previous => !previous)}
          className="flex w-full items-center gap-3 p-5 text-left"
        >
          <BookOpen size={21} />

          <span className="flex-1 font-semibold">
            Read the original fee information
          </span>

          <span>{showDetails ? '−' : '+'}</span>
        </button>

        {showDetails && (
          <div className="border-t border-current/10 p-5">

            <p className="whitespace-pre-wrap text-sm leading-loose">
              {procedure.fees_information ||
                'Fee information is not available yet.'}
            </p>

          </div>
        )}

      </div>

      {/* Processing time */}
      <div
        className="mt-4 flex items-start gap-4 rounded-2xl p-5"
        style={{
          backgroundColor: theme.colors.secondary,
        }}
      >
        <Clock3 size={25} className="shrink-0" />

        <div>
          <h3 className="font-semibold">
            Estimated processing time
          </h3>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
            {procedure.processing_time ||
              'Processing time is not available yet.'}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2 text-xs leading-relaxed opacity-70">

        <Info size={17} className="shrink-0" />

        <p>
          This planner is for personal budgeting.
          Suggested expense categories are not mandatory
          charges. Verify official fees before paying.
          Your estimates are not saved permanently.
        </p>

      </div>

      {procedure.official_link && (
        <a
          href={procedure.official_link}
          target="_blank"
          rel="noreferrer"
          className="btn btn-sm mt-5 rounded-full border-0 normal-case text-white"
          style={{
            backgroundColor: theme.colors.dark,
          }}
        >
          Verify official fees
          <ArrowUpRight size={16} />
        </a>
      )}

    </section>
  )
}