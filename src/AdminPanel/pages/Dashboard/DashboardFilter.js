

// import React, { useState, useRef, useEffect } from 'react'
// import './dashboard.css'

// // ── Mini Calendar Picker ──────────────────────────────────────────────────────
// function CalendarPicker({ value, onChange, label, minDate, maxDate }) {
//   const [open, setOpen] = useState(false)
//   const [viewYear, setViewYear]   = useState(() => value ? value.getFullYear() : new Date().getFullYear())
//   const [viewMonth, setViewMonth] = useState(() => value ? value.getMonth() : new Date().getMonth())
//   const [showYearList, setShowYearList] = useState(false)
//   const ref = useRef(null)

//   // Close on outside click
//   useEffect(() => {
//     function handler(e) {
//       if (ref.current && !ref.current.contains(e.target)) {
//         setOpen(false)
//         setShowYearList(false)
//       }
//     }
//     document.addEventListener('mousedown', handler)
//     return () => document.removeEventListener('mousedown', handler)
//   }, [])

//   const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
//   const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa']

//   // Days in month
//   function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate() }
//   // First weekday of month (0=Sun)
//   function firstDay(y, m)    { return new Date(y, m, 1).getDay() }

//   function isSameDay(a, b) {
//     return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
//   }

//   function isDisabled(d) {
//     const t = new Date(viewYear, viewMonth, d)
//     if (minDate && t < minDate) return true
//     if (maxDate && t > maxDate) return true
//     return false
//   }

//   function selectDay(d) {
//     const chosen = new Date(viewYear, viewMonth, d)
//     onChange(chosen)
//     setOpen(false)
//     setShowYearList(false)
//   }

//   function prevMonth() {
//     if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
//     else setViewMonth(m => m - 1)
//   }
//   function nextMonth() {
//     if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
//     else setViewMonth(m => m + 1)
//   }

//   function formatDisplay(d) {
//     if (!d) return 'DD-MM-YYYY'
//     const dd = String(d.getDate()).padStart(2,'0')
//     const mm = String(d.getMonth()+1).padStart(2,'0')
//     const yy = d.getFullYear()
//     return `${dd}-${mm}-${yy}`
//   }

//   const totalDays   = daysInMonth(viewYear, viewMonth)
//   const startOffset = firstDay(viewYear, viewMonth)
//   const cells       = []
//   for (let i = 0; i < startOffset; i++) cells.push(null)
//   for (let d = 1; d <= totalDays; d++) cells.push(d)

//   // Year list: current year ± 5
//   const yearRange = []
//   const cy = new Date().getFullYear()
//   for (let y = cy - 5; y <= cy + 2; y++) yearRange.push(y)

//   return (
//     <div className="cal-wrap" ref={ref}>
//       <label className="filter-date-label">{label}</label>
//       <button
//         type="button"
//         className={`cal-trigger ${open ? 'cal-trigger--open' : ''} ${value ? 'cal-trigger--set' : ''}`}
//         onClick={() => { setOpen(o => !o); setShowYearList(false) }}
//       >
//         <span className="cal-icon">📅</span>
//         <span className="cal-value">{formatDisplay(value)}</span>
//         <span className="cal-arrow">{open ? '▲' : '▼'}</span>
//       </button>

//       {open && (
//         <div className="cal-dropdown">
//           {/* Header */}
//           <div className="cal-header">
//             <button type="button" className="cal-nav" onClick={prevMonth}>‹</button>
//             <div className="cal-title-row">
//               <button
//                 type="button"
//                 className="cal-month-btn"
//                 onClick={() => setShowYearList(y => !y)}
//               >
//                 {MONTHS[viewMonth]} {viewYear} {showYearList ? '▲' : '▼'}
//               </button>
//             </div>
//             <button type="button" className="cal-nav" onClick={nextMonth}>›</button>
//           </div>

//           {/* Year list */}
//           {showYearList && (
//             <div className="cal-year-list">
//               {yearRange.map(y => (
//                 <button
//                   key={y}
//                   type="button"
//                   className={`cal-year-item ${y === viewYear ? 'cal-year-item--active' : ''}`}
//                   onClick={() => { setViewYear(y); setShowYearList(false) }}
//                 >
//                   {y}
//                 </button>
//               ))}
//             </div>
//           )}

//           {!showYearList && (
//             <>
//               {/* Day headers */}
//               <div className="cal-grid">
//                 {DAYS.map(d => <div key={d} className="cal-day-hdr">{d}</div>)}
//                 {cells.map((d, i) => d === null
//                   ? <div key={`e-${i}`} />
//                   : (
//                     <button
//                       key={d}
//                       type="button"
//                       disabled={isDisabled(d)}
//                       className={[
//                         'cal-day',
//                         isSameDay(value, new Date(viewYear, viewMonth, d)) ? 'cal-day--selected' : '',
//                         isDisabled(d) ? 'cal-day--disabled' : '',
//                       ].join(' ')}
//                       onClick={() => selectDay(d)}
//                     >
//                       {d}
//                     </button>
//                   )
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// // ── Main Filter Component ─────────────────────────────────────────────────────
// export default function DashboardFilter({ onFilterApply }) {
//   const [activeMode, setActiveMode] = useState(null)
//   const [fromDate, setFromDate]     = useState(null)
//   const [toDate, setToDate]         = useState(null)
//   const [dateError, setDateError]   = useState('')

//   function handlePreset(mode) {
//     setDateError('')

//     // If clicking the same preset that's already active, deactivate it
//     if (activeMode === mode) {
//       setActiveMode(null)
//       setFromDate(null)
//       setToDate(null)
//       onFilterApply(null, null, null)
//       return
//     }

//     const today = new Date()
//     today.setHours(23, 59, 59, 999) // End of today
    
//     let from, to
    
//     if (mode === '1m') {
//       // Last 1 month = 30 days
//       from = new Date(today)
//       from.setDate(today.getDate() - 30)
//       from.setHours(0, 0, 0, 0)
//       to = today
      
//       setFromDate(from)
//       setToDate(to)
//       setActiveMode('1m')
//       onFilterApply('1m', from, to)
      
//     } else if (mode === '2m') {
//       // Last 2 months = 60 days
//       from = new Date(today)
//       from.setDate(today.getDate() - 60)
//       from.setHours(0, 0, 0, 0)
//       to = today
      
//       setFromDate(from)
//       setToDate(to)
//       setActiveMode('2m')
//       onFilterApply('2m', from, to)
      
//     } else if (mode === 'custom') {
//       // When clicking Custom button, only set mode but don't clear dates
//       // This allows user to modify existing custom range
//       setActiveMode('custom')
//     }
//   }

//   function handleApply() {
//     setDateError('')
    
//     if (!fromDate || !toDate) {
//       setDateError('Please select both From and To dates.')
//       return
//     }
    
//     // Set time boundaries for proper date comparison
//     const from = new Date(fromDate)
//     from.setHours(0, 0, 0, 0)
    
//     const to = new Date(toDate)
//     to.setHours(23, 59, 59, 999)
    
//     if (from > to) {
//       setDateError('"From" date must be before "To" date.')
//       return
//     }
    
//     // Keep custom mode active
//     setActiveMode('custom')
//     onFilterApply('custom', from, to)
//   }

//   function handleClear() {
//     setActiveMode(null)
//     setFromDate(null)
//     setToDate(null)
//     setDateError('')
//     onFilterApply(null, null, null)
//   }

//   // When user manually changes dates in custom mode, keep custom mode active
//   function handleFromDateChange(date) {
//     setFromDate(date)
//     setActiveMode('custom')
//   }

//   function handleToDateChange(date) {
//     setToDate(date)
//     setActiveMode('custom')
//   }

//   return (
//     <div className="dashboard-filter">
//       <div className="filter-btn-group">
//         <button
//           className={`filter-btn ${activeMode === '1m' ? 'filter-btn--active' : ''}`}
//           onClick={() => handlePreset('1m')}
//         >
//           Last 1 Month
//         </button>
//         <button
//           className={`filter-btn ${activeMode === '2m' ? 'filter-btn--active' : ''}`}
//           onClick={() => handlePreset('2m')}
//         >
//           Last 2 Months
//         </button>
//         <button
//           className={`filter-btn ${activeMode === 'custom' ? 'filter-btn--active' : ''}`}
//           onClick={() => handlePreset('custom')}
//         >
//           Custom
//         </button>

//         {activeMode && (
//           <button className="filter-clear-btn" onClick={handleClear}>
//             Clear
//           </button>
//         )}
//       </div>

//       {activeMode === 'custom' && (
//         <div className="filter-custom-row">
//           <CalendarPicker
//             label="From"
//             value={fromDate}
//             onChange={handleFromDateChange}
//             maxDate={toDate || undefined}
//           />
//           <span className="filter-date-sep">→</span>
//           <CalendarPicker
//             label="To"
//             value={toDate}
//             onChange={handleToDateChange}
//             minDate={fromDate || undefined}
//           />
//           <button className="filter-apply-btn" onClick={handleApply}>
//             Apply
//           </button>
//         </div>
//       )}

//       {dateError && <p className="filter-error">{dateError}</p>}
//     </div>
//   )
// }

// DashboardFilter.jsx - Updated version
import React, { useState, useRef, useEffect } from 'react'
import './dashboard.css'

// ── Mini Calendar Picker ──────────────────────────────────────────────────────
function CalendarPicker({ value, onChange, label, minDate, maxDate }) {
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear]   = useState(() => value ? value.getFullYear() : new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(() => value ? value.getMonth() : new Date().getMonth())
  const [showYearList, setShowYearList] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
        setShowYearList(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa']

  // Days in month
  function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate() }
  // First weekday of month (0=Sun)
  function firstDay(y, m)    { return new Date(y, m, 1).getDay() }

  function isSameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  }

  function isDisabled(d) {
    const t = new Date(viewYear, viewMonth, d)
    if (minDate && t < minDate) return true
    if (maxDate && t > maxDate) return true
    return false
  }

  function selectDay(d) {
    const chosen = new Date(viewYear, viewMonth, d)
    onChange(chosen)
    setOpen(false)
    setShowYearList(false)
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function formatDisplay(d) {
    if (!d) return 'DD-MM-YYYY'
    const dd = String(d.getDate()).padStart(2,'0')
    const mm = String(d.getMonth()+1).padStart(2,'0')
    const yy = d.getFullYear()
    return `${dd}-${mm}-${yy}`
  }

  const totalDays   = daysInMonth(viewYear, viewMonth)
  const startOffset = firstDay(viewYear, viewMonth)
  const cells       = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= totalDays; d++) cells.push(d)

  // Year list: current year ± 5
  const yearRange = []
  const cy = new Date().getFullYear()
  for (let y = cy - 5; y <= cy + 2; y++) yearRange.push(y)

  return (
    <div className="cal-wrap" ref={ref}>
      <label className="filter-date-label">{label}</label>
      <button
        type="button"
        className={`cal-trigger ${open ? 'cal-trigger--open' : ''} ${value ? 'cal-trigger--set' : ''}`}
        onClick={() => { setOpen(o => !o); setShowYearList(false) }}
      >
        <span className="cal-icon">📅</span>
        <span className="cal-value">{formatDisplay(value)}</span>
        <span className="cal-arrow">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="cal-dropdown">
          {/* Header */}
          <div className="cal-header">
            <button type="button" className="cal-nav" onClick={prevMonth}>‹</button>
            <div className="cal-title-row">
              <button
                type="button"
                className="cal-month-btn"
                onClick={() => setShowYearList(y => !y)}
              >
                {MONTHS[viewMonth]} {viewYear} {showYearList ? '▲' : '▼'}
              </button>
            </div>
            <button type="button" className="cal-nav" onClick={nextMonth}>›</button>
          </div>

          {/* Year list */}
          {showYearList && (
            <div className="cal-year-list">
              {yearRange.map(y => (
                <button
                  key={y}
                  type="button"
                  className={`cal-year-item ${y === viewYear ? 'cal-year-item--active' : ''}`}
                  onClick={() => { setViewYear(y); setShowYearList(false) }}
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          {!showYearList && (
            <>
              {/* Day headers */}
              <div className="cal-grid">
                {DAYS.map(d => <div key={d} className="cal-day-hdr">{d}</div>)}
                {cells.map((d, i) => d === null
                  ? <div key={`e-${i}`} />
                  : (
                    <button
                      key={d}
                      type="button"
                      disabled={isDisabled(d)}
                      className={[
                        'cal-day',
                        isSameDay(value, new Date(viewYear, viewMonth, d)) ? 'cal-day--selected' : '',
                        isDisabled(d) ? 'cal-day--disabled' : '',
                      ].join(' ')}
                      onClick={() => selectDay(d)}
                    >
                      {d}
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Filter Component ─────────────────────────────────────────────────────
// MODIFIED: Added initialActiveMode prop
export default function DashboardFilter({ onFilterApply, initialActiveMode = null }) {
  const [activeMode, setActiveMode] = useState(initialActiveMode)
  const [fromDate, setFromDate]     = useState(null)
  const [toDate, setToDate]         = useState(null)
  const [dateError, setDateError]   = useState('')
  
  // ADD THIS: Initialize with default dates if initialActiveMode is '1m'
  useEffect(() => {
    if (initialActiveMode === '1m') {
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      
      const from = new Date(today)
      from.setDate(today.getDate() - 30)
      from.setHours(0, 0, 0, 0)
      
      setFromDate(from)
      setToDate(today)
      setActiveMode('1m')
      
      // Notify parent about initial filter
      if (onFilterApply) {
        onFilterApply('1m', from, today)
      }
    }
  }, [initialActiveMode])

  function handlePreset(mode) {
    setDateError('')

    // If clicking the same preset that's already active, deactivate it
    if (activeMode === mode) {
      setActiveMode(null)
      setFromDate(null)
      setToDate(null)
      onFilterApply(null, null, null)
      return
    }

    const today = new Date()
    today.setHours(23, 59, 59, 999) // End of today
    
    let from, to
    
    if (mode === '1m') {
      // Last 1 month = 30 days
      from = new Date(today)
      from.setDate(today.getDate() - 30)
      from.setHours(0, 0, 0, 0)
      to = today
      
      setFromDate(from)
      setToDate(to)
      setActiveMode('1m')
      onFilterApply('1m', from, to)
      
    } else if (mode === '2m') {
      // Last 2 months = 60 days
      from = new Date(today)
      from.setDate(today.getDate() - 60)
      from.setHours(0, 0, 0, 0)
      to = today
      
      setFromDate(from)
      setToDate(to)
      setActiveMode('2m')
      onFilterApply('2m', from, to)
      
    } else if (mode === 'custom') {
      // When clicking Custom button, only set mode but don't clear dates
      // This allows user to modify existing custom range
      setActiveMode('custom')
    }
  }

  function handleApply() {
    setDateError('')
    
    if (!fromDate || !toDate) {
      setDateError('Please select both From and To dates.')
      return
    }
    
    // Set time boundaries for proper date comparison
    const from = new Date(fromDate)
    from.setHours(0, 0, 0, 0)
    
    const to = new Date(toDate)
    to.setHours(23, 59, 59, 999)
    
    if (from > to) {
      setDateError('"From" date must be before "To" date.')
      return
    }
    
    // Keep custom mode active
    setActiveMode('custom')
    onFilterApply('custom', from, to)
  }

  function handleClear() {
    setActiveMode(null)
    setFromDate(null)
    setToDate(null)
    setDateError('')
    onFilterApply(null, null, null)
  }

  // When user manually changes dates in custom mode, keep custom mode active
  function handleFromDateChange(date) {
    setFromDate(date)
    setActiveMode('custom')
  }

  function handleToDateChange(date) {
    setToDate(date)
    setActiveMode('custom')
  }

  return (
    <div className="dashboard-filter">
      <div className="filter-btn-group">
        <button
          className={`filter-btn ${activeMode === '1m' ? 'filter-btn--active' : ''}`}
          onClick={() => handlePreset('1m')}
        >
          Last 1 Month
        </button>
        <button
          className={`filter-btn ${activeMode === '2m' ? 'filter-btn--active' : ''}`}
          onClick={() => handlePreset('2m')}
        >
          Last 2 Months
        </button>
        <button
          className={`filter-btn ${activeMode === 'custom' ? 'filter-btn--active' : ''}`}
          onClick={() => handlePreset('custom')}
        >
          Custom
        </button>

        {activeMode && (
          <button className="filter-clear-btn" onClick={handleClear}>
            Clear
          </button>
        )}
      </div>

      {activeMode === 'custom' && (
        <div className="filter-custom-row">
          <CalendarPicker
            label="From"
            value={fromDate}
            onChange={handleFromDateChange}
            maxDate={toDate || undefined}
          />
          <span className="filter-date-sep">→</span>
          <CalendarPicker
            label="To"
            value={toDate}
            onChange={handleToDateChange}
            minDate={fromDate || undefined}
          />
          <button className="filter-apply-btn" onClick={handleApply}>
            Apply
          </button>
        </div>
      )}

      {dateError && <p className="filter-error">{dateError}</p>}
    </div>
  )
}