

// StatCard.jsx
import React from 'react'
import { Users, CheckCircle2, XCircle, FileText, Handshake, Car } from 'lucide-react'
import './dashboard.css'

const ICONS = {
  users:       Users,
  won:         CheckCircle2,
  loss:        XCircle,
  newOrder:    FileText,
  negotiation: Handshake,
  vehicles:    Car,
}

export default function StatCard({ stat, index }) {
  const Icon = ICONS[stat.key] || Users

  const displayValue = stat.isVehicle
    ? stat.live + stat.offline
    : Number(stat.value).toLocaleString('en-IN')

  const hasAmount =
    !stat.isVehicle &&
    stat.key !== 'users' &&
    stat.totalAmount != null

  return (
    <div
      className="stat-card"
      style={{
        '--accent':  stat.accent,
        '--icon-bg': stat.iconBg,
        animationDelay: `${index * 0.06}s`,
      }}
    >
      <div className="stat-accent-bar" />

      <div className="stat-top">
        <div className="stat-text-group">
          <p className="stat-label">{stat.label}</p>
          <p className="stat-value">{displayValue}</p>
        </div>
        <div className="stat-icon-wrap">
          <Icon size={18} color={stat.accent} strokeWidth={2} />
        </div>
      </div>

      {stat.isVehicle ? (
        <div className="veh-row">
          <div className="veh-tag veh-live">
            <span className="live-dot" />
            Live&nbsp;{stat.live}
          </div>
          <div className="veh-tag veh-off">
            Offline&nbsp;{stat.offline}
          </div>
        </div>
      ) : hasAmount ? (
        <div className="stat-footer">
          <span className="stat-total-amount">
            ₹&nbsp;{Number(stat.totalAmount).toLocaleString('en-IN')}
          </span>
        </div>
      ) : null}
    </div>
  )
}
