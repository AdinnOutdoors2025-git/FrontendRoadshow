

// LineChart.jsx
import React, { useRef, useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import './dashboard.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function LineChart({
  title,
  subtitle,
  datasets,
  color,
  legendLabel,
  fetchDataKey,
  totalSuffix,
  animDelay = 0,
  yearlyData,
  years,
  currentYear,
  isMultiDataset = false
}) {
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const chartRef = useRef(null)
  const [gradients, setGradients] = useState({})

  // ✅ currentYear response la change ஆனா sync பண்ணு
  useEffect(() => {
    setSelectedYear(currentYear)
  }, [currentYear])

  useEffect(() => {
    if (!isMultiDataset && chartRef.current) {
      const ctx = chartRef.current.ctx
      const gradient = ctx.createLinearGradient(0, 0, 0, 200)
      gradient.addColorStop(0, color + '44')
      gradient.addColorStop(1, color + '00')
      setGradients({ main: gradient })
    }
  }, [color, isMultiDataset])

  const prepareChartData = () => {
    // ✅ Guard — yearlyData or selectedYear data இல்லன்னா empty return
    if (!yearlyData || !yearlyData[selectedYear]) {
      return { labels: MONTHS, datasets: [] }
    }

    if (isMultiDataset && datasets) {
      const yearData = yearlyData[selectedYear]
      if (!yearData || !yearData.monthlyOrders) {
        return { labels: MONTHS, datasets: [] }
      }

      return {
        labels: MONTHS,
        datasets: datasets.map(dataset => {
          const monthlyData = yearData.monthlyOrders?.[dataset.key] || []
          const data = monthlyData.map(item => item.count)
          const total = data.reduce((a, b) => a + b, 0)

          return {
            label: dataset.label,
            data: data,
            borderColor: dataset.color,
            backgroundColor: dataset.color + '10',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: dataset.color,
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
            total: total,
          }
        }),
      }
    } else {
      const yearData = yearlyData[selectedYear]
      const monthlyData = yearData?.[fetchDataKey] || []
      const rawData = monthlyData.map(item => item.count)
      const total = rawData.reduce((a, b) => a + b, 0)

      const isDark = window.matchMedia('(prefers-color-scheme:dark)').matches

      return {
        labels: MONTHS,
        datasets: [{
          label: legendLabel,
          data: rawData,
          borderColor: color,
          borderWidth: 2.5,
          backgroundColor: gradients.main || color + '22',
          fill: true,
          tension: 0.42,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: color,
          pointHoverBorderColor: isDark ? '#1c1c1a' : '#fff',
          pointHoverBorderWidth: 2,
          total: total,
        }],
      }
    }
  }

  const chartData = prepareChartData()
  const isDark = window.matchMedia('(prefers-color-scheme:dark)').matches
  const gridCol = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'
  const tickCol = isDark ? '#888780' : '#9ca3af'
  const ttBg = isDark ? '#1c1c1a' : '#ffffff'
  const ttBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
  const ttText = isDark ? '#c2c0b6' : '#374151'

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800, easing: 'easeInOutQuart' },
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: isMultiDataset,
        position: 'top',
        labels: {
          color: isDark ? '#c2c0b6' : '#374151',
          font: { size: 11, family: 'DM Sans' },
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: ttBg,
        borderColor: ttBorder,
        borderWidth: 1,
        titleColor: ttText,
        bodyColor: ttText,
        titleFont: { size: 11, weight: '500', family: 'DM Sans' },
        bodyFont: { size: 13, weight: '500', family: 'DM Sans' },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          title: (items) => MONTHS[items[0].dataIndex],
          label: (item) => {
            const dataset = item.dataset
            return `  ${dataset.label}: ${item.raw.toLocaleString()} ${totalSuffix}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: tickCol, font: { size: 11, family: 'DM Sans' }, maxRotation: 0 },
      },
      y: {
        grid: { color: gridCol },
        border: { display: false },
        ticks: { color: tickCol, font: { size: 11, family: 'DM Sans' }, maxTicksLimit: 5 },
        beginAtZero: true,
      },
    },
  }

  const getTotal = () => {
    if (!chartData.datasets || chartData.datasets.length === 0) return 0
    if (isMultiDataset) {
      return chartData.datasets.reduce((sum, ds) => sum + (ds.total || 0), 0)
    }
    return chartData.datasets[0]?.total || 0
  }

  const total = getTotal()

  return (
    <div className="chart-card" style={{ animationDelay: `${animDelay}s` }}>
      <div className="chart-head">
        <div>
          <h3 className="chart-title">{title}</h3>
          <p className="chart-sub">{subtitle}</p>
        </div>
        <select
          className="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="chart-meta">
        {!isMultiDataset && (
          <div className="chart-legend">
            <span className="leg-line" style={{ background: color }} />
            <span>{legendLabel}</span>
          </div>
        )}
        <div className="chart-total">
          Total: <span>{total.toLocaleString()} {totalSuffix}</span>
        </div>
      </div>

      <div className="canvas-wrap">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  )
}