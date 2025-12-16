"use client";

import { useState, useEffect, useMemo } from "react";
import { getClasses, type CourseOffering } from "@lib/api";

type ClassItem = {
  id: number;
  course_code: string;
  course_name: string;
  course_units: number;
  instructor: string;
  class_number: string;
  capacity: number;
  enrolled_count: number;
  class_time: string;
  exam_time: string;
  is_full: boolean;
};

export default function StudentPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiClasses = await getClasses();
      const formattedClasses: ClassItem[] = apiClasses.map((cls: CourseOffering) => ({
        id: cls.id,
        course_code: cls.course_code || "",
        course_name: cls.course_name || "",
        course_units: cls.course_units || 0,
        instructor: cls.instructor,
        class_number: cls.class_number,
        capacity: cls.capacity,
        enrolled_count: cls.enrolled_count,
        class_time: cls.class_time,
        exam_time: cls.exam_time,
        is_full: cls.is_full || false,
      }));
      setClasses(formattedClasses);
    } catch (err) {
      setError("خطا در دریافت لیست کلاس‌ها");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = useMemo(() => {
    if (!searchQuery.trim()) {
      return classes;
    }

    const query = searchQuery.toLowerCase().trim();
    return classes.filter(
      (cls) =>
        cls.course_name.toLowerCase().includes(query) ||
        cls.instructor.toLowerCase().includes(query) ||
        cls.course_code.toLowerCase().includes(query)
    );
  }, [classes, searchQuery]);

  if (loading) {
    return (
      <div className="student-page">
        <div className="student-loading">
          <div className="student-loading__spinner"></div>
          <p>در حال بارگذاری دروس...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-page">
        <div className="student-error">
          <p>{error}</p>
          <button onClick={loadCourses} className="student-error__retry">
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-page">
      <div className="student-page__header">
        <h2 className="student-page__title">لیست دروس ارائه شده</h2>
        <p className="student-page__description">
          می‌توانید دروس ارائه شده در ترم را مشاهده و جستجو کنید
        </p>
      </div>

      <div className="student-search">
        <div className="student-search__wrapper">
          <svg
            className="student-search__icon"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 19L14.65 14.65"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            className="student-search__input"
            placeholder="جستجو بر اساس نام درس یا نام استاد..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="student-search__clear"
              onClick={() => setSearchQuery("")}
              type="button"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="student-classes">
        {filteredClasses.length === 0 ? (
          <div className="student-empty">
            <p>هیچ کلاسی یافت نشد</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="student-empty__clear"
              >
                پاک کردن جستجو
              </button>
            )}
          </div>
        ) : (
          <div className="student-classes__list">
            {filteredClasses.map((cls) => (
              <div key={cls.id} className="student-class-card">
                <div className="student-class-card__left">
                  <div className="student-class-card__course-info">
                    <span className="student-class-card__code">
                      {cls.course_code}
                    </span>
                    <h3 className="student-class-card__name">
                      {cls.course_name}
                    </h3>
                  </div>
                  <div className="student-class-card__meta">
                    <span className="student-class-card__instructor">
                      {cls.instructor}
                    </span>
                    <span className="student-class-card__separator">•</span>
                    <span className="student-class-card__class-number">
                      کلاس {cls.class_number}
                    </span>
                    <span className="student-class-card__separator">•</span>
                    <span className="student-class-card__units">
                      {cls.course_units} واحد
                    </span>
                  </div>
                </div>
                <div className="student-class-card__right">
                  <div className="student-class-card__schedule">
                    <span className="student-class-card__time">{cls.class_time}</span>
                    <span className="student-class-card__exam">{cls.exam_time}</span>
                  </div>
                  <div className="student-class-card__badge">
                    {cls.is_full ? (
                      <span className="student-class-card__badge--full">پر</span>
                    ) : (
                      <span className="student-class-card__badge--available">
                        {cls.capacity - cls.enrolled_count} خالی
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {searchQuery && filteredClasses.length > 0 && (
        <div className="student-results-info">
          <p>{filteredClasses.length} کلاس یافت شد</p>
        </div>
      )}
    </div>
  );
}
