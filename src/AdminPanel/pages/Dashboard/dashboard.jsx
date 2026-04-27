

// // DashboardPage.jsx
// import React, { useState, useEffect } from 'react'
// import StatCard from './StatCard'
// import LineChart from './LineChart'
// import DoughnutChart from './DoughnutChart'
// import DashboardFilter from './DashboardFilter'
// import './dashboard.css'
// import { baseUrls } from "../../../Authentication/BASE_URL"

// export default function DashboardPage() {
//   const [dashboardData, setDashboardData] = useState(null)
//   const [yearlyData, setYearlyData]       = useState({})
//   const [loading, setLoading]             = useState(true)
//   const [error, setError]                 = useState(null)
//   const [years, setYears]                 = useState([])
//   const [currentYear, setCurrentYear]     = useState(new Date().getFullYear())
//   const [filteredStats, setFilteredStats] = useState(null)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const response = await fetch(`${baseUrls}/dashboard`)
//         const result   = await response.json()
//         if (result.success) {
//           setDashboardData(result.data)
//           setYears(result.years)
//           setCurrentYear(result.currentYear)
//           setYearlyData(result.yearly)
//         } else {
//           setError('Failed to fetch data')
//         }
//       } catch (err) {
//         setError('Error fetching dashboard data')
//         console.error(err)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [])

//   // Helper: Check if a date is within range
//   function isDateInRange(dateStr, from, to) {
//     const date = new Date(dateStr)
//     return date >= from && date <= to
//   }

//   // Calculate filtered stats based on date range
//   function calcFilteredStats(from, to) {
//     const statuses = ['newOrder', 'proposal', 'negotiation', 'closedWon', 'closedLoss']
    
//     const counts  = {}
//     const amounts = {}
//     statuses.forEach(s => { counts[s] = 0; amounts[s] = 0 })

//     let filteredUsers       = 0
//     let filteredAvailable   = 0
//     let filteredUnavailable = 0

//     // Loop through all years in yearlyData
//     Object.keys(yearlyData).forEach(year => {
//       const yd = yearlyData[year]
//       if (!yd) return

//       // Process Orders Count - iterate through daily data
//       statuses.forEach(status => {
//         const monthlyData = yd.monthlyOrders?.[status] || []
//         monthlyData.forEach(monthData => {
//           const days = monthData.days || []
//           days.forEach(dayData => {
//             if (isDateInRange(dayData.date, from, to)) {
//               counts[status] += (dayData.count || 0)
//             }
//           })
//         })
//       })

//       // Process Orders Amount - iterate through daily data
//       statuses.forEach(status => {
//         const monthlyData = yd.monthlyOrderAmounts?.[status] || []
//         monthlyData.forEach(monthData => {
//           const days = monthData.days || []
//           days.forEach(dayData => {
//             if (isDateInRange(dayData.date, from, to)) {
//               amounts[status] += (dayData.totalAmount || 0)
//             }
//           })
//         })
//       })

//       // Process Users - iterate through daily data
//       const monthlyUsers = yd.monthlyUsers || []
//       monthlyUsers.forEach(monthData => {
//         const days = monthData.days || []
//         days.forEach(dayData => {
//           if (isDateInRange(dayData.date, from, to)) {
//             filteredUsers += (dayData.count || 0)
//           }
//         })
//       })

//       // Process Vehicles Available
//       const availableVehicles = yd.monthlyVehicles?.available || []
//       availableVehicles.forEach(monthData => {
//         const days = monthData.days || []
//         days.forEach(dayData => {
//           if (isDateInRange(dayData.date, from, to)) {
//             filteredAvailable += (dayData.count || 0)
//           }
//         })
//       })

//       // Process Vehicles Unavailable
//       const unavailableVehicles = yd.monthlyVehicles?.unavailable || []
//       unavailableVehicles.forEach(monthData => {
//         const days = monthData.days || []
//         days.forEach(dayData => {
//           if (isDateInRange(dayData.date, from, to)) {
//             filteredUnavailable += (dayData.count || 0)
//           }
//         })
//       })
//     })

//     return { counts, amounts, filteredUsers, filteredAvailable, filteredUnavailable }
//   }

//   function handleFilterApply(mode, from, to) {
//     if (!from || !to) {
//       setFilteredStats(null)
//       return
//     }
//     setFilteredStats(calcFilteredStats(from, to))
//   }

//   function buildStats() {
//     if (!dashboardData) return []

//     const useFiltered = filteredStats !== null
//     const fs = filteredStats

//     const atCounts  = dashboardData.orders?.pipelineStatusCounts  || {}
//     const atAmounts = dashboardData.orders?.pipelineStatusAmounts || {}
//     const atUsers   = dashboardData.users?.verifiedUsers || 0
//     const atLive    = dashboardData.vehicles?.availability?.availableCount   || 0
//     const atOffline = dashboardData.vehicles?.availability?.unavailableCount || 0

//     return [
//       {
//         key:     'users',
//         label:   'Users',
//         value:   useFiltered ? fs.filteredUsers : atUsers,
//         accent:  '#3b82f6',
//         iconBg:  'rgba(59,130,246,0.1)',
//         trendUp: true,
//       },
//       {
//         key:         'won',
//         label:       'Closed Won',
//         value:       useFiltered ? fs.counts.closedWon   : (atCounts.closedWon  || 0),
//         totalAmount: useFiltered ? fs.amounts.closedWon  : (atAmounts.closedWon?.totalAmount  || 0),
//         accent:  '#22c55e',
//         iconBg:  'rgba(34,197,94,0.1)',
//         trendUp: true,
//       },
//       {
//         key:         'loss',
//         label:       'Closed Loss',
//         value:       useFiltered ? fs.counts.closedLoss  : (atCounts.closedLoss || 0),
//         totalAmount: useFiltered ? fs.amounts.closedLoss : (atAmounts.closedLoss?.totalAmount || 0),
//         accent:  '#ef4444',
//         iconBg:  'rgba(239,68,68,0.1)',
//         trendUp: false,
//       },
//       {
//         key:         'newOrder',
//         label:       'New Order',
//         value:       useFiltered ? fs.counts.newOrder    : (atCounts.newOrder   || 0),
//         totalAmount: useFiltered ? fs.amounts.newOrder   : (atAmounts.newOrder?.totalAmount   || 0),
//         accent:  '#f59e0b',
//         iconBg:  'rgba(245,158,11,0.1)',
//         trendUp: true,
//       },
//       {
//         key:         'negotiation',
//         label:       'Negotiation',
//         value:       useFiltered ? fs.counts.negotiation : (atCounts.negotiation || 0),
//         totalAmount: useFiltered ? fs.amounts.negotiation: (atAmounts.negotiation?.totalAmount || 0),
//         accent:  '#8b5cf6',
//         iconBg:  'rgba(139,92,246,0.1)',
//         trendUp: true,
//       },
//       {
//         key:       'vehicles',
//         label:     'Vehicles',
//         isVehicle: true,
//         live:    useFiltered ? fs.filteredAvailable   : atLive,
//         offline: useFiltered ? fs.filteredUnavailable : atOffline,
//         accent:  '#0ea5e9',
//         iconBg:  'rgba(14,165,233,0.1)',
//       },
//     ]
//   }

//   const chartConfigs = [
//     {
//       title:          'Order Pipeline',
//       subtitle:       'Monthly order status breakdown',
//       color:          '#22c55e',
//       datasets: [
//         { key: 'newOrder',    label: 'New Order',   color: '#f59e0b' },
//         { key: 'proposal',    label: 'Proposal',    color: '#8b5cf6' },
//         { key: 'negotiation', label: 'Negotiation', color: '#3b82f6' },
//         { key: 'closedWon',   label: 'Closed Won',  color: '#22c55e' },
//         { key: 'closedLoss',  label: 'Closed Loss', color: '#ef4444' },
//       ],
//       totalSuffix:    'orders',
//       animDelay:      0.35,
//       isMultiDataset: true,
//     },
//     {
//       title:          'Product Enquiry',
//       subtitle:       'Monthly product enquiry count',
//       color:          '#3b82f6',
//       legendLabel:    'Product Enquiries',
//       fetchDataKey:   'monthlyProductEnquiry',
//       totalSuffix:    'enquiries',
//       animDelay:      0.45,
//       isMultiDataset: false,
//     },
//     {
//       title:          'Contact Enquiry',
//       subtitle:       'Monthly contact enquiry count',
//       color:          '#a855f7',
//       legendLabel:    'Contact Enquiries',
//       fetchDataKey:   'monthlyEnquiry',
//       totalSuffix:    'enquiries',
//       animDelay:      0.55,
//       isMultiDataset: false,
//     },
//   ]

//   if (loading) return (
//     <div className="dashboard-content">
//       <div className="loading-container">Loading dashboard...</div>
//     </div>
//   )
//   if (error) return (
//     <div className="dashboard-content">
//       <div className="error-container">{error}</div>
//     </div>
//   )
//   if (!dashboardData) return null

//   const stats = buildStats()

//   return (
//     <div className="dashboard-content">
//       <section>
//         <p className="section-label">Key Metrics</p>

//         <DashboardFilter onFilterApply={handleFilterApply} />

//         <div className="metrics-row">
//           <div className="metrics-cards">
//             <div className="stats-grid">
//               {stats.map((stat, i) => (
//                 <StatCard key={stat.key} stat={stat} index={i} />
//               ))}
//             </div>
//           </div>
//           <div className="metrics-donut">
//             <DoughnutChart stats={stats} />
//           </div>
//         </div>
//       </section>

//       <section className="charts-section">
//         {chartConfigs.map(config => (
//           <LineChart
//             key={config.title}
//             {...config}
//             yearlyData={yearlyData}
//             years={years}
//             currentYear={currentYear}
//           />
//         ))}
//       </section>
//     </div>
//   )
// }


// DashboardPage.jsx
import React, { useState, useEffect } from 'react'
import StatCard from './StatCard'
import LineChart from './LineChart'
import DoughnutChart from './DoughnutChart'
import DashboardFilter from './DashboardFilter'
import './dashboard.css'
import { baseUrls } from "../../../Authentication/BASE_URL"

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null)
  const [yearlyData, setYearlyData]       = useState({})
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [years, setYears]                 = useState([])
  const [currentYear, setCurrentYear]     = useState(new Date().getFullYear())
  const [filteredStats, setFilteredStats] = useState(null)
  
  // ADD THIS: State to track if initial filter is applied
  const [initialFilterApplied, setInitialFilterApplied] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${baseUrls}/dashboard`)
        const result   = await response.json()
        if (result.success) {
          setDashboardData(result.data)
          setYears(result.years)
          setCurrentYear(result.currentYear)
          setYearlyData(result.yearly)
        } else {
          setError('Failed to fetch data')
        }
      } catch (err) {
        setError('Error fetching dashboard data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ADD THIS: Apply default 30-day filter when yearlyData is loaded
  useEffect(() => {
    if (Object.keys(yearlyData).length > 0 && !initialFilterApplied) {
      // Set default to last 30 days
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      
      const from = new Date(today)
      from.setDate(today.getDate() - 30)
      from.setHours(0, 0, 0, 0)
      
      const filtered = calcFilteredStats(from, today)
      setFilteredStats(filtered)
      setInitialFilterApplied(true)
    }
  }, [yearlyData])

  // Helper: Check if a date is within range
  function isDateInRange(dateStr, from, to) {
    const date = new Date(dateStr)
    return date >= from && date <= to
  }

  // Calculate filtered stats based on date range
  function calcFilteredStats(from, to) {
    const statuses = ['newOrder', 'proposal', 'negotiation', 'closedWon', 'closedLoss']
    
    const counts  = {}
    const amounts = {}
    statuses.forEach(s => { counts[s] = 0; amounts[s] = 0 })

    let filteredUsers       = 0
    let filteredAvailable   = 0
    let filteredUnavailable = 0

    // Loop through all years in yearlyData
    Object.keys(yearlyData).forEach(year => {
      const yd = yearlyData[year]
      if (!yd) return

      // Process Orders Count - iterate through daily data
      statuses.forEach(status => {
        const monthlyData = yd.monthlyOrders?.[status] || []
        monthlyData.forEach(monthData => {
          const days = monthData.days || []
          days.forEach(dayData => {
            if (isDateInRange(dayData.date, from, to)) {
              counts[status] += (dayData.count || 0)
            }
          })
        })
      })

      // Process Orders Amount - iterate through daily data
      statuses.forEach(status => {
        const monthlyData = yd.monthlyOrderAmounts?.[status] || []
        monthlyData.forEach(monthData => {
          const days = monthData.days || []
          days.forEach(dayData => {
            if (isDateInRange(dayData.date, from, to)) {
              amounts[status] += (dayData.totalAmount || 0)
            }
          })
        })
      })

      // Process Users - iterate through daily data
      const monthlyUsers = yd.monthlyUsers || []
      monthlyUsers.forEach(monthData => {
        const days = monthData.days || []
        days.forEach(dayData => {
          if (isDateInRange(dayData.date, from, to)) {
            filteredUsers += (dayData.count || 0)
          }
        })
      })

      // Process Vehicles Available
      const availableVehicles = yd.monthlyVehicles?.available || []
      availableVehicles.forEach(monthData => {
        const days = monthData.days || []
        days.forEach(dayData => {
          if (isDateInRange(dayData.date, from, to)) {
            filteredAvailable += (dayData.count || 0)
          }
        })
      })

      // Process Vehicles Unavailable
      const unavailableVehicles = yd.monthlyVehicles?.unavailable || []
      unavailableVehicles.forEach(monthData => {
        const days = monthData.days || []
        days.forEach(dayData => {
          if (isDateInRange(dayData.date, from, to)) {
            filteredUnavailable += (dayData.count || 0)
          }
        })
      })
    })

    return { counts, amounts, filteredUsers, filteredAvailable, filteredUnavailable }
  }

  function handleFilterApply(mode, from, to) {
    if (!from || !to) {
      setFilteredStats(null)
      return
    }
    setFilteredStats(calcFilteredStats(from, to))
  }

  function buildStats() {
    if (!dashboardData) return []

    const useFiltered = filteredStats !== null
    const fs = filteredStats

    const atCounts  = dashboardData.orders?.pipelineStatusCounts  || {}
    const atAmounts = dashboardData.orders?.pipelineStatusAmounts || {}
    const atUsers   = dashboardData.users?.verifiedUsers || 0
    const atLive    = dashboardData.vehicles?.availability?.availableCount   || 0
    const atOffline = dashboardData.vehicles?.availability?.unavailableCount || 0

    return [
      {
        key:     'users',
        label:   'Users',
        value:   useFiltered ? fs.filteredUsers : atUsers,
        accent:  '#3b82f6',
        iconBg:  'rgba(59,130,246,0.1)',
        trendUp: true,
      },
      {
        key:         'won',
        label:       'Closed Won',
        value:       useFiltered ? fs.counts.closedWon   : (atCounts.closedWon  || 0),
        totalAmount: useFiltered ? fs.amounts.closedWon  : (atAmounts.closedWon?.totalAmount  || 0),
        accent:  '#22c55e',
        iconBg:  'rgba(34,197,94,0.1)',
        trendUp: true,
      },
      {
        key:         'loss',
        label:       'Closed Loss',
        value:       useFiltered ? fs.counts.closedLoss  : (atCounts.closedLoss || 0),
        totalAmount: useFiltered ? fs.amounts.closedLoss : (atAmounts.closedLoss?.totalAmount || 0),
        accent:  '#ef4444',
        iconBg:  'rgba(239,68,68,0.1)',
        trendUp: false,
      },
      {
        key:         'newOrder',
        label:       'New Order',
        value:       useFiltered ? fs.counts.newOrder    : (atCounts.newOrder   || 0),
        totalAmount: useFiltered ? fs.amounts.newOrder   : (atAmounts.newOrder?.totalAmount   || 0),
        accent:  '#f59e0b',
        iconBg:  'rgba(245,158,11,0.1)',
        trendUp: true,
      },
      {
        key:         'negotiation',
        label:       'Negotiation',
        value:       useFiltered ? fs.counts.negotiation : (atCounts.negotiation || 0),
        totalAmount: useFiltered ? fs.amounts.negotiation: (atAmounts.negotiation?.totalAmount || 0),
        accent:  '#8b5cf6',
        iconBg:  'rgba(139,92,246,0.1)',
        trendUp: true,
      },
      {
        key:       'vehicles',
        label:     'Vehicles',
        isVehicle: true,
        live:    useFiltered ? fs.filteredAvailable   : atLive,
        offline: useFiltered ? fs.filteredUnavailable : atOffline,
        accent:  '#0ea5e9',
        iconBg:  'rgba(14,165,233,0.1)',
      },
    ]
  }

  const chartConfigs = [
    {
      title:          'Order Pipeline',
      subtitle:       'Monthly order status breakdown',
      color:          '#22c55e',
      datasets: [
        { key: 'newOrder',    label: 'New Order',   color: '#f59e0b' },
        { key: 'proposal',    label: 'Proposal',    color: '#8b5cf6' },
        { key: 'negotiation', label: 'Negotiation', color: '#3b82f6' },
        { key: 'closedWon',   label: 'Closed Won',  color: '#22c55e' },
        { key: 'closedLoss',  label: 'Closed Loss', color: '#ef4444' },
      ],
      totalSuffix:    'orders',
      animDelay:      0.35,
      isMultiDataset: true,
    },
    {
      title:          'Product Enquiry',
      subtitle:       'Monthly product enquiry count',
      color:          '#3b82f6',
      legendLabel:    'Product Enquiries',
      fetchDataKey:   'monthlyProductEnquiry',
      totalSuffix:    'enquiries',
      animDelay:      0.45,
      isMultiDataset: false,
    },
    {
      title:          'Contact Enquiry',
      subtitle:       'Monthly contact enquiry count',
      color:          '#a855f7',
      legendLabel:    'Contact Enquiries',
      fetchDataKey:   'monthlyEnquiry',
      totalSuffix:    'enquiries',
      animDelay:      0.55,
      isMultiDataset: false,
    },
  ]

  if (loading) return (
    <div className="dashboard-content">
      <div className="loading-container">Loading dashboard...</div>
    </div>
  )
  if (error) return (
    <div className="dashboard-content">
      <div className="error-container">{error}</div>
    </div>
  )
  if (!dashboardData) return null

  const stats = buildStats()

  return (
    <div className="dashboard-content">
      <section>
        <p className="section-label">Key Metrics</p>

        {/* MODIFIED: Pass initialActiveMode prop to DashboardFilter */}
        <DashboardFilter 
          onFilterApply={handleFilterApply} 
          initialActiveMode="1m"
        />

        <div className="metrics-row">
          <div className="metrics-cards">
            <div className="stats-grid">
              {stats.map((stat, i) => (
                <StatCard key={stat.key} stat={stat} index={i} />
              ))}
            </div>
          </div>
          <div className="metrics-donut">
            <DoughnutChart stats={stats} />
          </div>
        </div>
      </section>

      <section className="charts-section">
        {chartConfigs.map(config => (
          <LineChart
            key={config.title}
            {...config}
            yearlyData={yearlyData}
            years={years}
            currentYear={currentYear}
          />
        ))}
      </section>
    </div>
  )
}