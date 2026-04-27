

import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import './dashboard.css'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function DoughnutChart({ stats }) {
  const labels   = stats.map(s => s.label)
  const values   = stats.map(s => s.isVehicle ? (s.live || 0) + (s.offline || 0) : (s.value ?? 0))
  const colors   = stats.map(s => s.accent)
  const bgColors = stats.map(s => s.accent + 'cc')

  const isDark =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme:dark)').matches

  const data = {
    labels,
    datasets: [{
      label:           'Count',
      data:            values,
      backgroundColor: bgColors,
      borderColor:     colors,
      borderWidth:     2,
      hoverOffset:     8,
    }],
  }

  const options = {
    responsive:          true,
    maintainAspectRatio: false,
    cutout:              '65%',
    animation: { duration: 900, easing: 'easeInOutQuart' },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color:         isDark ? '#c2c0b6' : '#374151',
          font:          { size: 12, family: 'DM Sans' },
          padding:       16,
          usePointStyle: true,
          pointStyle:    'circle',
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#1c1c1a' : '#ffffff',
        borderColor:     isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        borderWidth:     1,
        titleColor:      isDark ? '#c2c0b6' : '#374151',
        bodyColor:       isDark ? '#c2c0b6' : '#374151',
        titleFont:       { size: 11, weight: '500', family: 'DM Sans' },
        bodyFont:        { size: 13, weight: '600', family: 'DM Sans' },
        padding:         10,
        cornerRadius:    8,
        callbacks: {
          label: item => `  ${item.label}: ${Number(item.raw).toLocaleString('en-IN')}`,
        },
      },
    },
  }

  return (
    <div className="chart-card doughnut-card" style={{ animationDelay: '0.25s' }}>
      <div className="chart-head">
        <h3 className="chart-title">Metrics Overview</h3>
      </div>
      <div className="canvas-wrap" >
        <Doughnut data={data} options={options} />
      </div>
    </div>
  )
}
