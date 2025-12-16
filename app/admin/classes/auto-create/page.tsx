"use client";

import { useState } from "react";
import { getCourses, getInstructors, getClasses, createClass, type Course, type Instructor } from "@lib/api";
import { useRouter } from "next/navigation";

interface CourseGroup {
  courseId: number;
  courseCode: string;
  courseName: string;
  groups: number; // تعداد گروه‌ها
}

export default function AutoCreateClassesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // داده‌های ورودی
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [existingClasses, setExistingClasses] = useState<any[]>([]);
  const [courseGroups, setCourseGroups] = useState<CourseGroup[]>([]);
  const [examStartDate, setExamStartDate] = useState("");
  const [examEndDate, setExamEndDate] = useState("");
  const [capacity, setCapacity] = useState("30");

  // بارگذاری داده‌ها
  useState(() => {
    loadData();
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [apiCourses, apiInstructors, apiClasses] = await Promise.all([
        getCourses(),
        getInstructors(),
        getClasses(),
      ]);
      setCourses(apiCourses);
      setInstructors(apiInstructors);
      setExistingClasses(apiClasses);
    } catch (err) {
      setError("خطا در بارگذاری داده‌ها");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = () => {
    if (courseGroups.length >= courses.length) {
      setError("همه دروس اضافه شده‌اند");
      return;
    }
    // این بخش بعداً کامل می‌شود
  };

  const handleGenerate = async () => {
    if (courseGroups.length === 0) {
      setError("لطفاً حداقل یک درس انتخاب کنید");
      return;
    }

    if (!examStartDate || !examEndDate) {
      setError("لطفاً بازه زمانی امتحانات را مشخص کنید");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // فراخوانی API برای ایجاد کلاس‌ها
      const response = await fetch("http://localhost:8000/api/classes/auto-create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          course_groups: courseGroups,
          exam_start_date: examStartDate,
          exam_end_date: examEndDate,
          default_capacity: parseInt(capacity),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در ایجاد کلاس‌ها");
      }

      const result = await response.json();
      setSuccess(`با موفقیت ${result.created_count} کلاس ایجاد شد`);
      
      // ریدایرکت به صفحه کلاس‌ها بعد از 2 ثانیه
      setTimeout(() => {
        router.push("/admin/classes");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ایجاد کلاس‌ها");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">ایجاد خودکار کلاس‌ها</h1>
        <p className="page-subtitle">
          این ابزار به شما کمک می‌کند تا کلاس‌ها را به صورت خودکار با تخصیص بهینه زمان و امتحان ایجاد کنید
        </p>
      </div>

      {error && (
        <div className="alert alert--error" style={{ marginBottom: "24px" }}>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert--success" style={{ marginBottom: "24px" }}>
          {success}
        </div>
      )}

      <div className="settings-card" style={{ marginBottom: "24px" }}>
        <h2 className="settings-section__title" style={{ marginBottom: "16px" }}>
          بازه زمانی امتحانات
        </h2>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">تاریخ شروع</label>
            <input
              type="date"
              className="form-input"
              value={examStartDate}
              onChange={(e) => setExamStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">تاریخ پایان</label>
            <input
              type="date"
              className="form-input"
              value={examEndDate}
              onChange={(e) => setExamEndDate(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="settings-card" style={{ marginBottom: "24px" }}>
        <h2 className="settings-section__title" style={{ marginBottom: "16px" }}>
          ظرفیت پیش‌فرض
        </h2>
        <div className="form-group">
          <label className="form-label">ظرفیت هر کلاس</label>
          <input
            type="number"
            className="form-input"
            min="10"
            max="100"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-section__header" style={{ marginBottom: "16px" }}>
          <h2 className="settings-section__title">انتخاب دروس و تعداد گروه‌ها</h2>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>کد درس</th>
                <th>نام درس</th>
                <th>تعداد واحد</th>
                <th>تعداد گروه</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {courseGroups.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px" }}>
                    <span className="text-muted">
                      هنوز درسی اضافه نشده است. از فرم زیر استفاده کنید.
                    </span>
                  </td>
                </tr>
              ) : (
                courseGroups.map((cg, index) => (
                  <tr key={index}>
                    <td>{cg.courseCode}</td>
                    <td>{cg.courseName}</td>
                    <td>{courses.find(c => c.id === cg.courseId)?.units || 0}</td>
                    <td>{cg.groups}</td>
                    <td>
                      <button
                        className="btn btn--danger btn--sm"
                        onClick={() => {
                          setCourseGroups(courseGroups.filter((_, i) => i !== index));
                        }}
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "20px", padding: "16px", background: "#f8fafc", borderRadius: "8px" }}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">انتخاب درس</label>
              <select
                className="form-input"
                onChange={(e) => {
                  const courseId = parseInt(e.target.value);
                  if (courseId) {
                    const course = courses.find(c => c.id === courseId);
                    if (course && !courseGroups.find(cg => cg.courseId === courseId)) {
                      setCourseGroups([...courseGroups, {
                        courseId: course.id,
                        courseCode: course.code,
                        courseName: course.name,
                        groups: 1,
                      }]);
                      e.target.value = "";
                    }
                  }
                }}
              >
                <option value="">درس را انتخاب کنید</option>
                {courses
                  .filter(c => !courseGroups.find(cg => cg.courseId === c.id))
                  .map(course => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">تعداد گروه</label>
              <input
                type="number"
                className="form-input"
                min="1"
                max="10"
                value="1"
                onChange={(e) => {
                  // این بخش بعداً کامل می‌شود
                }}
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "24px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        <button
          className="btn btn--secondary"
          onClick={() => router.push("/admin/classes")}
        >
          انصراف
        </button>
        <button
          className="btn btn--primary"
          onClick={handleGenerate}
          disabled={loading || courseGroups.length === 0}
        >
          {loading ? "در حال ایجاد..." : "ایجاد کلاس‌ها"}
        </button>
      </div>
    </div>
  );
}

