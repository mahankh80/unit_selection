"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@lib/AuthContext";
import { getClasses, type CourseOffering } from "@lib/api";

export default function InstructorPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<CourseOffering[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const allClasses = await getClasses();
        
        // فیلتر کردن کلاس‌های مربوط به استاد فعلی
        const instructorClasses = allClasses.filter(
          (cls) => cls.instructor === user?.first_name + " " + user?.last_name
        );
        
        setClasses(instructorClasses);
        setError(null);
      } catch (err) {
        setError("خطا در دریافت لیست دروس");
        console.error("Error fetching classes:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchClasses();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="instructor-page">
        <div className="instructor-page__loading">
          <p>در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="instructor-page">
        <div className="instructor-page__error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="instructor-page">
      <div className="instructor-page__header">
        <h2 className="instructor-page__title">دروس ارائه شده</h2>
        <p className="instructor-page__subtitle">
          لیست تمام دروس ارائه شده توسط شما در ترم جاری
        </p>
      </div>

      {classes.length === 0 ? (
        <div className="instructor-page__empty">
          <p>در حال حاضر درسی ارائه نشده است.</p>
        </div>
      ) : (
        <div className="instructor-page__classes">
          {classes.map((cls) => (
            <div key={cls.id} className="instructor-class-card">
              <div className="instructor-class-card__main-info">
                <span className="instructor-class-card__code">
                  {cls.course_code}
                </span>
                <h3 className="instructor-class-card__name">
                  {cls.course_name}
                </h3>
              </div>
              <div className="instructor-class-card__details">
                <div className="instructor-class-card__detail-item">
                  <span className="instructor-class-card__detail-label">تعداد واحد:</span>
                  <span className="instructor-class-card__detail-value">{cls.course_units}</span>
                </div>
                <div className="instructor-class-card__detail-item">
                  <span className="instructor-class-card__detail-label">شماره کلاس:</span>
                  <span className="instructor-class-card__detail-value">{cls.class_number}</span>
                </div>
                <div className="instructor-class-card__detail-item">
                  <span className="instructor-class-card__detail-label">زمان برگزاری:</span>
                  <span className="instructor-class-card__detail-value">{cls.class_time}</span>
                </div>
                <div className="instructor-class-card__detail-item">
                  <span className="instructor-class-card__detail-label">امتحان:</span>
                  <span className="instructor-class-card__detail-value">{cls.exam_time}</span>
                </div>
                <div className="instructor-class-card__detail-item">
                  <span className="instructor-class-card__detail-label">ظرفیت:</span>
                  <span className="instructor-class-card__detail-value">
                    {cls.enrolled_count} / {cls.capacity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

