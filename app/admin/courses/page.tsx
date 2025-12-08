"use client";

import { useState } from "react";
import { EditIcon } from "@components/icons/Edit";
import { DeleteIcon } from "@components/icons/Delete";

type CourseType = "نظری" | "عملی" | "عمومی" | "اختیاری";

type Course = {
  id: number;
  code: string;
  name: string;
  units: number;
  type: CourseType;
  prerequisites: string[];
};

const mockCourses: Course[] = [
  {
    id: 1,
    code: "CE-101",
    name: "مبانی برنامه‌نویسی",
    units: 3,
    type: "نظری",
    prerequisites: [],
  },
  {
    id: 2,
    code: "CE-201",
    name: "ساختمان داده",
    units: 3,
    type: "نظری",
    prerequisites: ["CE-101"],
  },
  {
    id: 3,
    code: "CE-202",
    name: "آزمایشگاه ساختمان داده",
    units: 1,
    type: "عملی",
    prerequisites: ["CE-101"],
  },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    units: "",
    type: "نظری" as CourseType,
    prerequisites: [] as string[],
  });

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

  const handleDelete = (id: number) => {
    if (confirm("آیا از حذف این درس اطمینان دارید؟")) {
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const courseData: Course = {
      id: editingCourse?.id || Date.now(),
      code: formData.code,
      name: formData.name,
      units: parseInt(formData.units),
      type: formData.type,
      prerequisites: formData.prerequisites,
    };

    if (editingCourse) {
      setCourses(courses.map((c) => (c.id === editingCourse.id ? courseData : c)));
    } else {
      setCourses([...courses, courseData]);
    }

    setShowModal(false);
  };

  const togglePrerequisite = (courseCode: string) => {
    if (formData.prerequisites.includes(courseCode)) {
      setFormData({
        ...formData,
        prerequisites: formData.prerequisites.filter((c) => c !== courseCode),
      });
    } else {
      setFormData({
        ...formData,
        prerequisites: [...formData.prerequisites, courseCode],
      });
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">مدیریت دروس</h2>
        <button className="btn btn--primary" onClick={handleAdd}>
          + افزودن درس جدید
        </button>
      </div>

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
                  <span className={`badge badge--${course.type === "نظری" ? "blue" : course.type === "عملی" ? "green" : course.type === "عمومی" ? "purple" : "orange"}`}>
                    {course.type}
                  </span>
                </td>
                <td>
                  {course.prerequisites.length > 0 ? (
                    <div className="prereq-list">
                      {course.prerequisites.map((prereq, idx) => (
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
                  />
                </div>

                <div className="form-group form-group--full">
                  <label className="form-label">نوع درس</label>
                  <select
                    className="form-input"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as CourseType })
                    }
                    required
                  >
                    <option value="نظری">نظری</option>
                    <option value="عملی">عملی</option>
                    <option value="عمومی">عمومی</option>
                    <option value="اختیاری">اختیاری</option>
                  </select>
                </div>

                <div className="form-group form-group--full">
                  <label className="form-label">پیش‌نیازها (اختیاری)</label>
                  <div className="checkbox-group">
                    {courses
                      .filter((c) => c.id !== editingCourse?.id)
                      .map((course) => (
                        <label key={course.id} className="checkbox-item">
                          <input
                            type="checkbox"
                            checked={formData.prerequisites.includes(course.code)}
                            onChange={() => togglePrerequisite(course.code)}
                          />
                          <span>
                            {course.code} - {course.name}
                          </span>
                        </label>
                      ))}
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setShowModal(false)}
                >
                  انصراف
                </button>
                <button type="submit" className="btn btn--primary">
                  {editingCourse ? "ذخیره تغییرات" : "افزودن درس"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

