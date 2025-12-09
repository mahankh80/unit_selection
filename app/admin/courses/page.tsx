"use client";

import { useState, useEffect } from "react";
import { EditIcon } from "@components/icons/Edit";
import { DeleteIcon } from "@components/icons/Delete";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  type Course as APICourse,
} from "@lib/api";

// Map برای تبدیل نوع‌ها بین فارسی و انگلیسی
const courseTypeMap = {
  "نظری": "THEORETICAL",
  "عملی": "PRACTICAL",
  "عمومی": "GENERAL",
  "اختیاری": "ELECTIVE",
} as const;

const courseTypeMapReverse = {
  "THEORETICAL": "نظری",
  "PRACTICAL": "عملی",
  "GENERAL": "عمومی",
  "ELECTIVE": "اختیاری",
} as const;

type CourseType = "نظری" | "عملی" | "عمومی" | "اختیاری";

type Course = {
  id: number;
  code: string;
  name: string;
  units: number;
  type: CourseType;
  prerequisites: number[];
  prerequisiteNames?: string[];
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    units: "",
    type: "نظری" as CourseType,
    prerequisites: [] as number[],
  });

  // بارگذاری لیست دروس
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiCourses = await getCourses();
      
      // تبدیل داده‌های API به فرمت UI
      const uiCourses: Course[] = apiCourses.map((course) => {
        // برای هر prerequisite، نام درس رو پیدا می‌کنیم
        const prerequisiteNames = course.prerequisites
          .map(prereqId => apiCourses.find(c => c.id === prereqId)?.code)
          .filter(Boolean) as string[];

        return {
          id: course.id,
          code: course.code,
          name: course.name,
          units: course.units,
          type: courseTypeMapReverse[course.course_type] || "نظری",
          prerequisites: course.prerequisites,
          prerequisiteNames: prerequisiteNames,
        };
      });
      
      setCourses(uiCourses);
    } catch (err) {
      setError("خطا در دریافت لیست دروس");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCourse(null);
    setFormData({
      code: "",
      name: "",
      units: "",
      type: "نظری",
      prerequisites: [],
    });
    setShowModal(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      code: course.code,
      name: course.name,
      units: course.units.toString(),
      type: course.type,
      prerequisites: course.prerequisites,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا از حذف این درس اطمینان دارید؟")) {
      return;
    }

    try {
      await deleteCourse(id);
      await loadCourses();
    } catch (err) {
      alert("خطا در حذف درس");
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const courseData = {
        code: formData.code,
        name: formData.name,
        units: parseInt(formData.units),
        course_type: courseTypeMap[formData.type],
        prerequisites: formData.prerequisites,
      };

      if (editingCourse) {
        await updateCourse(editingCourse.id, courseData);
      } else {
        await createCourse(courseData as any);
      }

      setShowModal(false);
      await loadCourses();
    } catch (err) {
      alert("خطا در ذخیره درس");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const togglePrerequisite = (courseId: number) => {
    if (formData.prerequisites.includes(courseId)) {
      setFormData({
        ...formData,
        prerequisites: formData.prerequisites.filter((id) => id !== courseId),
      });
    } else {
      setFormData({
        ...formData,
        prerequisites: [...formData.prerequisites, courseId],
      });
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">در حال بارگذاری...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="error-message">
          {error}
          <button className="btn btn--primary" onClick={loadCourses}>
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">مدیریت دروس</h2>
        <button className="btn btn--primary" onClick={handleAdd}>
          + افزودن درس جدید
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <p>هیچ درسی تعریف نشده است</p>
          <button className="btn btn--primary" onClick={handleAdd}>
            افزودن اولین درس
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>کد درس</th>
                <th>نام درس</th>
                <th>واحد</th>
                <th>نوع</th>
                <th>پیش‌نیاز</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.code}</td>
                  <td>{course.name}</td>
                  <td>{course.units}</td>
                  <td>
                    <span
                      className={`badge badge--${
                        course.type === "نظری"
                          ? "blue"
                          : course.type === "عملی"
                          ? "green"
                          : course.type === "عمومی"
                          ? "purple"
                          : "orange"
                      }`}
                    >
                      {course.type}
                    </span>
                  </td>
                  <td>
                    {course.prerequisiteNames && course.prerequisiteNames.length > 0 ? (
                      <div className="prereq-list">
                        {course.prerequisiteNames.map((prereq, idx) => (
                          <span key={idx} className="prereq-badge">
                            {prereq}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">ندارد</span>
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn-icon btn-icon--edit"
                        onClick={() => handleEdit(course)}
                        title="ویرایش"
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="btn-icon btn-icon--delete"
                        onClick={() => handleDelete(course.id)}
                        title="حذف"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingCourse ? "ویرایش درس" : "افزودن درس جدید"}
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
                disabled={submitting}
              >
                ✕
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">کد درس</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="مثال: CE-101"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">تعداد واحد</label>
                  <input
                    type="number"
                    className="form-input"
                    min="1"
                    max="4"
                    value={formData.units}
                    onChange={(e) =>
                      setFormData({ ...formData, units: e.target.value })
                    }
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="form-group form-group--full">
                  <label className="form-label">نام درس</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="مثال: مبانی برنامه‌نویسی"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="form-group form-group--full">
                  <label className="form-label">نوع درس</label>
                  <select
                    className="form-input"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as CourseType,
                      })
                    }
                    required
                    disabled={submitting}
                  >
                    <option value="نظری">نظری</option>
                    <option value="عملی">عملی</option>
                    <option value="عمومی">عمومی</option>
                    <option value="اختیاری">اختیاری</option>
                  </select>
                </div>

                <div className="form-group form-group--full">
                  <label className="form-label">پیش‌نیازها (اختیاری)</label>
                  {courses.filter((c) => c.id !== editingCourse?.id).length > 0 ? (
                    <div className="checkbox-group">
                      {courses
                        .filter((c) => c.id !== editingCourse?.id)
                        .map((course) => (
                          <label key={course.id} className="checkbox-item">
                            <input
                              type="checkbox"
                              checked={formData.prerequisites.includes(course.id)}
                              onChange={() => togglePrerequisite(course.id)}
                              disabled={submitting}
                            />
                            <span>
                              {course.code} - {course.name}
                            </span>
                          </label>
                        ))}
                    </div>
                  ) : (
                    <p className="text-muted">هنوز درس دیگری تعریف نشده است</p>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  انصراف
                </button>
                <button 
                  type="submit" 
                  className="btn btn--primary"
                  disabled={submitting}
                >
                  {submitting 
                    ? "در حال ذخیره..." 
                    : editingCourse 
                    ? "ذخیره تغییرات" 
                    : "افزودن درس"
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}