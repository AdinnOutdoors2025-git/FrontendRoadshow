// AdminPanel/pages/DashboardPage.jsx
import React from 'react';
import PieSection from '../../ad1Pie';


const dashboardSummary = [
  { id: 1, icons: '/images/dashboard-icon1.svg', summaryHeading: 'Total Sites Added',  summaryCount: 13000  },
  { id: 2, icons: '/images/dashboard-icon2.svg', summaryHeading: 'Total Reservations', summaryCount: 8000   },
  { id: 3, icons: '/images/dashboard-icon5.svg', summaryHeading: 'Total Users',         summaryCount: 8000   },
  { id: 4, icons: '/images/dashboard-icon3.svg', summaryHeading: 'Total Revenue',       summaryCount: 800105 },
  { id: 5, icons: '/images/dashboard-icon4.svg', summaryHeading: 'Total Enquiries',     summaryCount: 500    },
  { id: 6, icons: '/images/dashboard-icon6.svg', summaryHeading: 'Booked Sites',        summaryCount: 5000   },
];

const MONTHS  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const YEARS   = ['2020','2021','2022','2023','2024','2025'];
const MMONTHS = ['March','April','May','June','July','August'];

const DashboardPage = () => (
  <div className="dashboardMain" style={{ width: '100%', margin: '20px' }}>

    {/* ── Summary Cards ── */}
    <div className="dashboardSummary-wrapper">
      {dashboardSummary.map((s) => (
        <div className="dashboardSummary" key={s.id}>
          <div className="cards">
            <div className="summaryIcon">
              <img src={s.icons} alt="icon" />
            </div>
            <div className="content">
              <span className="summaryHeading">{s.summaryHeading}</span>
              <br />
              <span className="summaryCount">{s.summaryCount}</span>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* ── Charts ── */}
    <div className="dashboardCharts">

      {/* Revenue by Month */}
      <div className="RevenueChartMain">
        <div className="revenueHeader">
          <div>Revenue by Month</div>
          <div>
            <select className="RevenueInputSelect">
              {YEARS.map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div className="revenueBar">
          {MONTHS.map((m) => (
            <div key={m} className="revenueContent">
              <div className="revenubarContent" />
              {m}
            </div>
          ))}
        </div>
      </div>

      {/* Users by Weekly */}
      <div className="RevenueChartMain UsersChartMain">
        <div className="revenueHeader userHeader">
          <div>Users by Weekly</div>
          <div>
            <select className="RevenueInputSelect">
              {MMONTHS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div className="usersbyWeek">
          <div className="usersbyWeekContent">
            <PieSection />
          </div>
          <div className="usersbyWeekContent">
            <div className="usersCount">Week1<br />5000</div>
            <div className="usersCount">Week2<br />10000</div>
            <div className="usersCount">Week3<br />4000</div>
            <div className="usersCount">Week4<br />6000</div>
          </div>
        </div>
      </div>

    </div>
  </div>
);

export default DashboardPage;
