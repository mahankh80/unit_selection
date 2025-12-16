"use client";

import { useState, useEffect } from "react";
import { EditIcon } from "@components/icons/Edit";
import { DeleteIcon } from "@components/icons/Delete";
import {
  getCourses,
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  getInstructors,
  type Course as APICourse,
  type CourseOffering,
  type Instructor,
} from "@lib/api";

type Class = {
  id: number;
  courseId: number;
  courseName: string;
  courseCode: string;
  courseUnits: number;
  instructor: string;
  classNumber: string;
  capacity: number;
  enrolled: number;
  classTime: string;
  examTime: string;
};

// Helper functions برای parse و format زمان‌ها
const parseClassTime = (classTime: string) => {
  // فرمت: "شنبه 14-16 کلاس 301"
  const dayMatch = classTime.match(/(شنبه|یکشنبه|دوشنبه|سه‌شنبه|چهارشنبه|پنج‌شنبه|جمعه)/);
  const timeMatch = classTime.match(/(\d+)-(\d+)/);
  const locationMatch = classTime.match(/کلاس\s+(\S+)/);
  
  return {
    day: dayMatch ? dayMatch[1] : "",
    startHour: timeMatch ? timeMatch[1] : "",
    endHour: timeMatch ? timeMatch[2] : "",
    location: locationMatch ? locationMatch[1] : "",
  };
};

const formatClassTime = (day: string, startHour: string, endHour: string, location: string) => {
  if (!day || !startHour || !endHour) return "";
  const locationPart = location ? ` کلاس ${location}` : "";
  return `${day} ${startHour}-${endHour}${locationPart}`;
};

const parseExamTime = (examTime: string) => {
  // فرمت: "1404/04/15 - 9:00" یا "1404/04/15 - ساعت 9:00"
  const dateMatch = examTime.match(/(\d{4})\/(\d{2})\/(\d{2})/);
  const timeMatch = examTime.match(/(\d{1,2}):?(\d{2})?/);
  
  return {
    date: dateMatch ? `${dateMatch[1]}/${dateMatch[2]}/${dateMatch[3]}` : "",
    hour: timeMatch ? timeMatch[1] : "",
    minute: timeMatch && timeMatch[2] ? timeMatch[2] : "00",
  };
};

const formatExamTime = (date: string, hour: string, minute: string) => {
  if (!date || !hour) return "";
  const minutePart = minute || "00";
  return `${date} - ${hour}:${minutePart}`;
};

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [courses, setCourses] = useState<APICourse[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    courseId: "",
    instructor: "",
    classNumber: "",
    capacity: "",
    // زمان کلاس - ساختاریافته
    classDay: "",
    classStartHour: "",
    classEndHour: "",
    classLocation: "",
    // زمان امتحان - ساختاریافته
    examDate: "",
    examHour: "",
    examMinute: "",
  });

  // بارگذاری داده‌ها
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // بارگذاری همزمان دروس، کلاس‌ها و اساتید
      const [apiCourses, apiClasses, apiInstructors] = await Promise.all([
        getCourses(),
        getClasses(),
        getInstructors(),
      ]);

      setCourses(apiCourses);
      setInstructors(apiInstructors);

      // تبدیل داده‌های API به فرمت UI
      const uiClasses: Class[] = apiClasses.map((cls) => ({
        id: cls.id,
        courseId: cls.course_detail?.id || 0,
        courseName: cls.course_name || cls.course_detail?.name || "",
        courseCode: cls.course_code || cls.course_detail?.code || "",
        courseUnits: cls.course_units || cls.course_detail?.units || 0,
        instructor: cls.instructor,
        classNumber: cls.class_number,
        capacity: cls.capacity,
        enrolled: cls.enrolled_count,
        classTime: cls.class_time,
        examTime: cls.exam_time,
      }));

      setClasses(uiClasses);
    } catch (err) {
      setError("خطا در دریافت اطلاعات");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingClass(null);
    setFormData({
      courseId: "",
      instructor: "",
      classNumber: "",
      capacity: "",
      classDay: "",
      classStartHour: "",
      classEndHour: "",
      classLocation: "",
      examDate: "",
      examHour: "",
      examMinute: "00",
    });
    setShowModal(true);
  };

  const handleEdit = (cls: Class) => {
    setEditingClass(cls);
    
    // Parse زمان کلاس
    const classTimeParsed = parseClassTime(cls.classTime);
    
    // Parse زمان امتحان
    const examTimeParsed = parseExamTime(cls.examTime);
    
    setFormData({
      courseId: cls.courseId.toString(),
      instructor: cls.instructor,
      classNumber: cls.classNumber,
      capacity: cls.capacity.toString(),
      classDay: classTimeParsed.day,
      classStartHour: classTimeParsed.startHour,
      classEndHour: classTimeParsed.endHour,
      classLocation: classTimeParsed.location,
      examDate: examTimeParsed.date,
      examHour: examTimeParsed.hour,
      examMinute: examTimeParsed.minute,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("آیا از حذف این کلاس اطمینان دارید؟")) {
      return;
    }

    try {
      await deleteClass(id);
      await loadData();
    } catch (err) {
      alert("خطا در حذف کلاس");
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validation
      if (!formData.classDay || !formData.classStartHour || !formData.classEndHour) {
        alert("لطفاً تمام فیلدهای زمان کلاس را پر کنید");
        setSubmitting(false);
        return;
      }

      if (parseInt(formData.classStartHour) >= parseInt(formData.classEndHour)) {
        alert("ساعت پایان باید بعد از ساعت شروع باشد");
        setSubmitting(false);
        return;
      }

      if (!formData.examDate || !formData.examHour) {
        alert("لطفاً تاریخ و ساعت امتحان را وارد کنید");
        setSubmitting(false);
        return;
      }

      // Validate تاریخ شمسی (فرمت: YYYY/MM/DD)
      const datePattern = /^\d{4}\/\d{2}\/\d{2}$/;
      if (!datePattern.test(formData.examDate)) {
        alert("فرمت تاریخ صحیح نیست. مثال: 1404/04/15");
        setSubmitting(false);
        return;
      }

      // Format زمان کلاس
      const classTime = formatClassTime(
        formData.classDay,
        formData.classStartHour,
        formData.classEndHour,
        formData.classLocation
      );

      // Format زمان امتحان
      const examTime = formatExamTime(
        formData.examDate,
        formData.examHour,
        formData.examMinute || "00"
      );

      // اطمینان حاصل کن که course_id یک عدد معتبر است
      const courseId = parseInt(formData.courseId, 10);
      if (isNaN(courseId) || courseId <= 0) {
        alert("لطفاً یک درس معتبر انتخاب کنید");
        setSubmitting(false);
        return;
      }

      const classData = {
        course_id: courseId,
        instructor: formData.instructor,
        class_number: formData.classNumber,
        capacity: parseInt(formData.capacity, 10),
        class_time: classTime,
        exam_time: examTime,
        semester: "1404-1", // ترم جاری
      };

      if (editingClass) {
        await updateClass(editingClass.id, classData);
      } else {
        await createClass(classData);
      }

      setShowModal(false);
      await loadData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "خطا در ذخیره کلاس";
      alert(errorMessage);
      console.error("Error saving class:", err);
    } finally {
      setSubmitting(false);
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
          <button className="btn btn--primary" onClick={loadData}>
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">مدیریت کلاس‌ها</h2>
        <div style={{ display: "flex", gap: "12px" }}>
          <a
            href="/admin/classes/auto-create"
            className="btn btn--secondary"
          >
            ایجاد خودکار کلاس‌ها
          </a>
          <button 
            className="btn btn--primary" 
            onClick={handleAdd}
            disabled={courses.length === 0}
          >
            + افزودن کلاس جدید
          </button>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <p>ابتدا باید دروس را تعریف کنید</p>
          <a href="/admin/courses" className="btn btn--primary">
            رفتن به مدیریت دروس
          </a>
        </div>
      ) : classes.length === 0 ? (
        <div className="empty-state">
          <p>هیچ کلاسی برگزار نشده است</p>
          <button className="btn btn--primary" onClick={handleAdd}>
            افزودن اولین کلاس
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>کد درس</th>
                <th>نام درس</th>
                <th>استاد</th>
                <th>شماره کلاس</th>
                <th>ظرفیت</th>
                <th>ثبت‌نام شده</th>
                <th>زمان کلاس</th>
                <th>زمان امتحان</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.id}>
                  <td>{cls.courseCode}</td>
                  <td>{cls.courseName}</td>
                  <td>{cls.instructor}</td>
                  <td>{cls.classNumber}</td>
                  <td>{cls.capacity}</td>
                  <td>
                    <span
                      className={`badge ${
                        cls.enrolled >= cls.capacity
                          ? "badge--red"
                          : cls.enrolled >= cls.capacity * 0.8
                          ? "badge--orange"
                          : "badge--green"
                      }`}
                    >
                      {cls.enrolled}
                    </span>
                  </td>
                  <td>{cls.classTime}</td>
                  <td>{cls.examTime}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn-icon btn-icon--edit"
                        onClick={() => handleEdit(cls)}
                        title="ویرایش"
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="btn-icon btn-icon--delete"
                        onClick={() => handleDelete(cls.id)}
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
                {editingClass ? "ویرایش کلاس" : "افزودن کلاس جدید"}
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
                <div className="form-group form-group--full">
                  <label className="form-label">انتخاب درس</label>
                  <select
                    className="form-input"
                    value={formData.courseId}
                    onChange={(e) =>
                      setFormData({ ...formData, courseId: e.target.value })
                    }
                    required
                    disabled={submitting}
                  >
                    <option value="">درس را انتخاب کنید</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.name} ({course.units} واحد)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">انتخاب استاد</label>
                  <select
                    className="form-input"
                    value={formData.instructor}
                    onChange={(e) =>
                      setFormData({ ...formData, instructor: e.target.value })
                    }
                    required
                    disabled={submitting}
                  >
                    <option value="">استاد را انتخاب کنید</option>
                    {instructors.map((instructor) => (
                      <option key={instructor.id} value={instructor.full_name}>
                        {instructor.full_name} ({instructor.instructor_code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">شماره کلاس</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="مثال: 01"
                    value={formData.classNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, classNumber: e.target.value })
                    }
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ظرفیت</label>
                  <input
                    type="number"
                    className="form-input"
                    min="1"
                    max="200"
                    placeholder="30"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: e.target.value })
                    }
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="form-group form-group--full">
                  <label className="form-label">زمان کلاس</label>
                  <div className="form-row">
                    <div className="form-col">
                      <select
                        className="form-input"
                        value={formData.classDay}
                        onChange={(e) =>
                          setFormData({ ...formData, classDay: e.target.value })
                        }
                        required
                        disabled={submitting}
                      >
                        <option value="">روز هفته</option>
                        <option value="شنبه">شنبه</option>
                        <option value="یکشنبه">یکشنبه</option>
                        <option value="دوشنبه">دوشنبه</option>
                        <option value="سه‌شنبه">سه‌شنبه</option>
                        <option value="چهارشنبه">چهارشنبه</option>
                        <option value="پنج‌شنبه">پنج‌شنبه</option>
                        <option value="جمعه">جمعه</option>
                      </select>
                    </div>
                    <div className="form-col">
                      <input
                        type="number"
                        className="form-input"
                        placeholder="ساعت شروع"
                        min="8"
                        max="20"
                        value={formData.classStartHour}
                        onChange={(e) =>
                          setFormData({ ...formData, classStartHour: e.target.value })
                        }
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div className="form-col">
                      <input
                        type="number"
                        className="form-input"
                        placeholder="ساعت پایان"
                        min="8"
                        max="20"
                        value={formData.classEndHour}
                        onChange={(e) =>
                          setFormData({ ...formData, classEndHour: e.target.value })
                        }
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div className="form-col">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="شماره کلاس (مثال: 301)"
                        value={formData.classLocation}
                        onChange={(e) =>
                          setFormData({ ...formData, classLocation: e.target.value })
                        }
                        disabled={submitting}
                      />
                    </div>
                  </div>
                  <small className="form-hint">
                    مثال: شنبه 14-16 کلاس 301
                  </small>
                </div>

                <div className="form-group form-group--full">
                  <label className="form-label">زمان امتحان</label>
                  <div className="form-row">
                    <div className="form-col">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="تاریخ (1404/04/15)"
                        pattern="\d{4}/\d{2}/\d{2}"
                        value={formData.examDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, ""); // فقط اعداد
                          // Auto-format: YYYY/MM/DD
                          if (value.length > 4) {
                            value = value.slice(0, 4) + "/" + value.slice(4);
                          }
                          if (value.length > 7) {
                            value = value.slice(0, 7) + "/" + value.slice(7, 9);
                          }
                          setFormData({ ...formData, examDate: value });
                        }}
                        maxLength={10}
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div className="form-col">
                      <input
                        type="number"
                        className="form-input"
                        placeholder="ساعت (0-23)"
                        min="0"
                        max="23"
                        value={formData.examHour}
                        onChange={(e) =>
                          setFormData({ ...formData, examHour: e.target.value })
                        }
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div className="form-col">
                      <input
                        type="number"
                        className="form-input"
                        placeholder="دقیقه (0-59)"
                        min="0"
                        max="59"
                        value={formData.examMinute}
                        onChange={(e) =>
                          setFormData({ ...formData, examMinute: e.target.value })
                        }
                        disabled={submitting}
                      />
                    </div>
                  </div>
                  <small className="form-hint">
                    مثال: 1404/04/15 - 9:00
                  </small>
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
                    : editingClass
                    ? "ذخیره تغییرات"
                    : "افزودن کلاس"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}