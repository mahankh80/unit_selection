"use client";

import { useState } from "react";
import { EditIcon } from "@components/icons/Edit";
import { DeleteIcon } from "@components/icons/Delete";

type CourseClass = {
  id: number;
  courseCode: string;
  courseName: string;
  instructor: string;
  capacity: number;
  enrolled: number;
  classNumber: string;
  schedule: string;
  examTime: string;
};

const mockClasses: CourseClass[] = [
  {
    id: 1,
    courseCode: "CE-101",
    courseName: "مبانی برنامه‌نویسی",
    instructor: "دکتر احمدی",
    capacity: 30,
    enrolled: 24,
    classNumber: "۳۰۱",
    schedule: "شنبه ۱۴-۱۶، دوشنبه ۱۴-۱۶",
    examTime: "۱۴۰۳/۱۰/۱۵ ساعت ۱۰",
  },
  {
    id: 2,
    courseCode: "CE-201",
    courseName: "ساختمان داده",
    instructor: "دکتر محمدی",
    capacity: 25,
    enrolled: 20,
    classNumber: "۲۰۵",
    schedule: "یکشنبه ۱۰-۱۲، سه‌شنبه ۱۰-۱۲",
    examTime: "۱۴۰۳/۱۰/۱۸ ساعت ۱۴",
  },
];

export default function ClassesPage() {
  const [classes, setClasses] = useState<CourseClass[]>(mockClasses);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<CourseClass | null>(null);
  const [formData, setFormData] = useState({
    courseCode: "",
    instructor: "",
    capacity: "",
    classNumber: "",
    schedule: "",
    examTime: "",
  });

  // لیست دروس موجود (در حالت واقعی از API می‌گیریم)
  const availableCourses = [
    { code: "CE-101", name: "مبانی برنامه‌نویسی" },
    { code: "CE-201", name: "ساختمان داده" },
    { code: "CE-202", name: "آزمایشگاه ساختمان داده" },
  ];

  const handleAdd = () => {
    setEditingClass(null);
    setFormData({
      courseCode: "",
      instructor: "",
      capacity: "",
      classNumber: "",
      schedule: "",
      examTime: "",
    });
    setShowModal(true);
  };

  const handleEdit = (classItem: CourseClass) => {
    setEditingClass(classItem);
    setFormData({
      courseCode: classItem.courseCode,
      instructor: classItem.instructor,
      capacity: classItem.capacity.toString(),
      classNumber: classItem.classNumber,
      schedule: classItem.schedule,
      examTime: classItem.examTime,
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("آیا از حذف این کلاس اطمینان دارید؟")) {
      setClasses(classes.filter((c) => c.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCourse = availableCourses.find(
      (c) => c.code === formData.courseCode
    );

    if (!selectedCourse) return;

    const classData: CourseClass = {
      id: editingClass?.id || Date.now(),
      courseCode: formData.courseCode,
      courseName: selectedCourse.name,
      instructor: formData.instructor,
      capacity: parseInt(formData.capacity),
      enrolled: editingClass?.enrolled || 0,
      classNumber: formData.classNumber,
      schedule: formData.schedule,
      examTime: formData.examTime,
    };

    if (editingClass) {
      setClasses(
        classes.map((c) => (c.id === editingClass.id ? classData : c))
      );
    } else {
      setClasses([...classes, classData]);
    }

    setShowModal(false);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">مدیریت کلاس‌ها</h1>
        <button className="btn btn--primary" onClick={handleAdd}>
          افزودن کلاس جدید
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>کد درس</th>
              <th>نام درس</th>
              <th>استاد</th>
              <th>کلاس</th>
              <th>ظرفیت</th>
              <th>ثبت‌نام</th>
              <th>زمان برگزاری</th>
              <th>زمان امتحان</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classItem) => (
              <tr key={classItem.id}>
                <td>{classItem.courseCode}</td>
                <td>{classItem.courseName}</td>
                <td>{classItem.instructor}</td>
                <td>{classItem.classNumber}</td>
                <td>{classItem.capacity}</td>
                <td>
                  <span
                    className={`badge ${
                      classItem.enrolled >= classItem.capacity
                        ? "badge--orange"
                        : "badge--green"
                    }`}
                  >
                    {classItem.enrolled} / {classItem.capacity}
                  </span>
                </td>
                <td>{classItem.schedule}</td>
                <td>{classItem.examTime}</td>
                <td>
                  <div className="table-actions">
                    <button
                      className="btn-icon btn-icon--edit"
                      onClick={() => handleEdit(classItem)}
                      title="ویرایش"
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="btn-icon btn-icon--delete"
                      onClick={() => handleDelete(classItem.id)}
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
                {editingClass ? "ویرایش کلاس" : "افزودن کلاس جدید"}
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
                <div className="form-group form-group--full">
                  <label className="form-label">انتخاب درس</label>
                  <select
                    className="form-input"
                    value={formData.courseCode}
                    onChange={(e) =>
                      setFormData({ ...formData, courseCode: e.target.value })
                    }
                    required
                  >
                    <option value="">درس مورد نظر را انتخاب کنید</option>
                    {availableCourses.map((course) => (
                      <option key={course.code} value={course.code}>
                        {course.code} - {course.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">نام استاد</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="مثال: دکتر احمدی"
                    value={formData.instructor}
                    onChange={(e) =>
                      setFormData({ ...formData, instructor: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">شماره کلاس</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="مثال: ۳۰۱"
                    value={formData.classNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, classNumber: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group form-group--full">
                  <label className="form-label">ظرفیت کلاس</label>
                  <input
                    type="number"
                    className="form-input"
                    min="1"
                    placeholder="مثال: ۳۰"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group form-group--full">
                  <label className="form-label">زمان برگزاری</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="مثال: شنبه ۱۴-۱۶، دوشنبه ۱۴-۱۶"
                    value={formData.schedule}
                    onChange={(e) =>
                      setFormData({ ...formData, schedule: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group form-group--full">
                  <label className="form-label">زمان امتحان</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="مثال: ۱۴۰۳/۱۰/۱۵ ساعت ۱۰"
                    value={formData.examTime}
                    onChange={(e) =>
                      setFormData({ ...formData, examTime: e.target.value })
                    }
                    required
                  />
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
                  {editingClass ? "ذخیره تغییرات" : "افزودن کلاس"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

