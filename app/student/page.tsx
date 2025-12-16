"use client";

import { useState, useEffect, useMemo } from "react";
import { getCourses, type Course as APICourse } from "@lib/api";

type Course = {
  id: number;
  code: string;
  name: string;
  units: number;
  course_type: string;
};

const courseTypeLabels: Record<string, string> = {
  THEORETICAL: "نظری",
  PRACTICAL: "عملی",
  GENERAL: "عمومی",
  ELECTIVE: "اختیاری",
};

export default function StudentPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiCourses = await getCourses();
      const formattedCourses: Course[] = apiCourses.map((course) => ({
        id: course.id,
        code: course.code,
        name: course.name,
        units: course.units,
        course_type: course.course_type,
      }));
      setCourses(formattedCourses);
    } catch (err) {
      setError("خطا در دریافت لیست دروس");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) {
      return courses;
    }

    const query = searchQuery.toLowerCase().trim();
    return courses.filter(
      (course) =>
        course.code.toLowerCase().includes(query) ||
        course.name.toLowerCase().includes(query)
    );
  }, [courses, searchQuery]);

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
        <h2 className="student-page__title">لیست دروس</h2>
        <p className="student-page__description">
          می‌توانید دروس را جستجو کنید و اطلاعات آن‌ها را مشاهده کنید
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
            placeholder="جستجوی درس (کد یا نام درس)..."
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

      <div className="student-courses">
        {filteredCourses.length === 0 ? (
          <div className="student-empty">
            <p>هیچ درسی یافت نشد</p>
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
          <div className="student-courses__grid">
            {filteredCourses.map((course) => (
              <div key={course.id} className="student-course-card">
                <div className="student-course-card__header">
                  <span className="student-course-card__code">
                    {course.code}
                  </span>
                  <span className="student-course-card__type">
                    {courseTypeLabels[course.course_type] || course.course_type}
                  </span>
                </div>
                <h3 className="student-course-card__name">{course.name}</h3>
                <div className="student-course-card__footer">
                  <span className="student-course-card__units">
                    {course.units} واحد
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {searchQuery && filteredCourses.length > 0 && (
        <div className="student-results-info">
          <p>
            {filteredCourses.length} درس یافت شد
          </p>
        </div>
      )}
    </div>
  );
}
