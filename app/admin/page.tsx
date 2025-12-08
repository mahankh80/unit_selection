export default function AdminDashboard() {
  return (
    <div className="dashboard">
      <h2 className="dashboard__title">خوش آمدید</h2>
      <p className="dashboard__subtitle">
        به پنل مدیریت سامانه انتخاب واحد خوش آمدید
      </p>

      <div className="dashboard-stats">
        <div className="stat-card stat-card--blue">
          <div className="stat-card__icon-wrapper">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div className="stat-card__content">
            <h3 className="stat-card__title">تعداد دروس</h3>
            <p className="stat-card__value">۴۸</p>
          </div>
        </div>

        <div className="stat-card stat-card--purple">
          <div className="stat-card__icon-wrapper">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <div className="stat-card__content">
            <h3 className="stat-card__title">تعداد کلاس‌ها</h3>
            <p className="stat-card__value">۲۴</p>
          </div>
        </div>

        <div className="stat-card stat-card--green">
          <div className="stat-card__icon-wrapper">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="stat-card__content">
            <h3 className="stat-card__title">دانشجویان فعال</h3>
            <p className="stat-card__value">۱۵۶</p>
          </div>
        </div>

        <div className="stat-card stat-card--orange">
          <div className="stat-card__icon-wrapper">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="stat-card__content">
            <h3 className="stat-card__title">کلاس‌های پر ظرفیت</h3>
            <p className="stat-card__value">۵</p>
          </div>
        </div>
      </div>
    </div>
  );
}

