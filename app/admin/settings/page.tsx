"use client";

import { useState, useEffect } from "react";
import { EditIcon } from "@components/icons/Edit";
import { 
  getStudentByStudentId, 
  updateStudentUnits, 
  getStudentsWithCustomUnits,
  type Student 
} from "@lib/api";

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    defaultMaxUnits: 20,
    minUnits: 12,
  });

  // بخش تنظیم واحدهای دانشجو
  const [searchStudentId, setSearchStudentId] = useState("");
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [studentUnits, setStudentUnits] = useState({
    minUnits: "",
    maxUnits: "",
  });
  const [savingUnits, setSavingUnits] = useState(false);

  // بخش لیست دانشجویان واحد خارج از عرف
  const [customUnitsStudents, setCustomUnitsStudents] = useState<Student[]>([]);
  const [loadingCustomUnits, setLoadingCustomUnits] = useState(true);

  useEffect(() => {
    loadCustomUnitsStudents();
  }, []);

  const loadCustomUnitsStudents = async () => {
    try {
      setLoadingCustomUnits(true);
      const students = await getStudentsWithCustomUnits();
      setCustomUnitsStudents(students);
    } catch (err) {
      console.error("خطا در دریافت لیست دانشجویان:", err);
    } finally {
      setLoadingCustomUnits(false);
    }
  };

  const handleSearchStudent = async () => {
    if (!searchStudentId.trim()) {
      setSearchError("لطفاً شماره دانشجویی را وارد کنید");
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
    setFoundStudent(null);

    try {
      const student = await getStudentByStudentId(searchStudentId.trim());
      setFoundStudent(student);
      setStudentUnits({
        minUnits: student.min_units.toString(),
        maxUnits: student.max_units.toString(),
      });
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "خطا در جستجوی دانشجو");
      setFoundStudent(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSaveStudentUnits = async () => {
    if (!foundStudent) return;

    const minUnits = parseInt(studentUnits.minUnits);
    const maxUnits = parseInt(studentUnits.maxUnits);

    if (isNaN(minUnits) || isNaN(maxUnits)) {
      setSearchError("لطفاً مقادیر معتبر وارد کنید");
      return;
    }

    if (minUnits < 0 || maxUnits < 0) {
      setSearchError("مقادیر واحد نمی‌توانند منفی باشند");
      return;
    }

    if (minUnits > maxUnits) {
      setSearchError("حداقل واحد نمی‌تواند بیشتر از حداکثر واحد باشد");
      return;
    }

    setSavingUnits(true);
    setSearchError(null);

    try {
      await updateStudentUnits(foundStudent.id, minUnits, maxUnits);
      // به‌روزرسانی اطلاعات دانشجو
      const updatedStudent = await getStudentByStudentId(foundStudent.student_id);
      setFoundStudent(updatedStudent);
      // به‌روزرسانی لیست دانشجویان واحد خارج از عرف
      await loadCustomUnitsStudents();
      alert("واحدهای دانشجو با موفقیت به‌روزرسانی شد");
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "خطا در به‌روزرسانی واحدها");
    } finally {
      setSavingUnits(false);
    }
  };

  const handleEditStudentFromList = async (student: Student) => {
    setSearchStudentId(student.student_id);
    setFoundStudent(student);
    setStudentUnits({
      minUnits: student.min_units.toString(),
      maxUnits: student.max_units.toString(),
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveGeneralSettings = () => {
    alert("تنظیمات عمومی با موفقیت ذخیره شد");
  };

  return (
    <div className="page-content">
      <h1 className="page-title">تنظیمات واحد</h1>

      {/* تنظیم واحدهای دانشجو */}
      <div className="settings-section">
        <h2 className="settings-section__title">تنظیم واحدهای دانشجو</h2>
        <div className="settings-card">
          <div className="form-group">
            <label className="form-label">جستجو با شماره دانشجویی</label>
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <input
                type="text"
                className="form-input"
                placeholder="مثال: 9973164"
                value={searchStudentId}
                onChange={(e) => {
                  setSearchStudentId(e.target.value);
                  setFoundStudent(null);
                  setSearchError(null);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearchStudent();
                  }
                }}
                style={{ flex: 1 }}
              />
              <button
                className="btn btn--primary"
                onClick={handleSearchStudent}
                disabled={searchLoading}
              >
                {searchLoading ? "در حال جستجو..." : "جستجو"}
              </button>
            </div>
            {searchError && (
              <div className="form-error" style={{ marginBottom: "16px" }}>
                {searchError}
              </div>
            )}
          </div>

          {foundStudent && (
            <div className="student-units-form">
              <div className="student-info" style={{ 
                padding: "16px", 
                background: "#f8fafc", 
                borderRadius: "8px",
                marginBottom: "20px"
              }}>
                <h3 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: 600 }}>
                  اطلاعات دانشجو
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <span style={{ color: "#64748b", fontSize: "13px" }}>نام:</span>
                    <span style={{ marginRight: "8px", fontWeight: 500 }}>
                      {foundStudent.full_name}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#64748b", fontSize: "13px" }}>شماره دانشجویی:</span>
                    <span style={{ marginRight: "8px", fontWeight: 500 }}>
                      {foundStudent.student_id}
                    </span>
                  </div>
                  {foundStudent.major && (
                    <div>
                      <span style={{ color: "#64748b", fontSize: "13px" }}>رشته:</span>
                      <span style={{ marginRight: "8px", fontWeight: 500 }}>
                        {foundStudent.major}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">حداقل واحد</label>
                  <input
                    type="number"
                    className="form-input"
                    min="0"
                    max="24"
                    value={studentUnits.minUnits}
                    onChange={(e) =>
                      setStudentUnits({ ...studentUnits, minUnits: e.target.value })
                    }
                    required
                  />
                  <span className="form-hint">
                    حداقل تعداد واحدی که دانشجو باید انتخاب کند
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">حداکثر واحد</label>
                  <input
                    type="number"
                    className="form-input"
                    min="0"
                    max="28"
                    value={studentUnits.maxUnits}
                    onChange={(e) =>
                      setStudentUnits({ ...studentUnits, maxUnits: e.target.value })
                    }
                    required
                  />
                  <span className="form-hint">
                    حداکثر تعداد واحدی که دانشجو می‌تواند انتخاب کند
                  </span>
                </div>
              </div>

              <button
                className="btn btn--primary"
                onClick={handleSaveStudentUnits}
                disabled={savingUnits}
              >
                {savingUnits ? "در حال ذخیره..." : "ذخیره واحدها"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* تنظیمات عمومی */}
      <div className="settings-section">
        <h2 className="settings-section__title">تنظیمات عمومی</h2>
        <div className="settings-card">
          <div className="settings-row">
            <div className="settings-item">
              <label className="settings-label">حداکثر واحد (پیش‌فرض)</label>
              <input
                type="number"
                className="form-input"
                min="12"
                max="24"
                value={generalSettings.defaultMaxUnits}
                onChange={(e) =>
                  setGeneralSettings({
                    ...generalSettings,
                    defaultMaxUnits: parseInt(e.target.value),
                  })
                }
              />
              <span className="settings-hint">
                حداکثر تعداد واحدی که یک دانشجو به طور پیش‌فرض می‌تواند انتخاب کند
              </span>
            </div>

            <div className="settings-item">
              <label className="settings-label">حداقل واحد</label>
              <input
                type="number"
                className="form-input"
                min="8"
                max="20"
                value={generalSettings.minUnits}
                onChange={(e) =>
                  setGeneralSettings({
                    ...generalSettings,
                    minUnits: parseInt(e.target.value),
                  })
                }
              />
              <span className="settings-hint">
                حداقل تعداد واحدی که یک دانشجو باید انتخاب کند
              </span>
            </div>
          </div>

          <button className="btn btn--primary" onClick={handleSaveGeneralSettings}>
            ذخیره تنظیمات عمومی
          </button>
        </div>
      </div>

      {/* دانشجویان واحد خارج از عرف */}
      <div className="settings-section">
        <div className="settings-section__header">
          <h2 className="settings-section__title">دانشجویان واحد خارج از عرف</h2>
          <button 
            className="btn btn--secondary" 
            onClick={loadCustomUnitsStudents}
            disabled={loadingCustomUnits}
          >
            {loadingCustomUnits ? "در حال بارگذاری..." : "به‌روزرسانی"}
          </button>
        </div>

        {loadingCustomUnits ? (
          <div className="settings-card" style={{ textAlign: "center", padding: "40px" }}>
            <span className="text-muted">در حال بارگذاری...</span>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>شماره دانشجویی</th>
                  <th>نام دانشجو</th>
                  <th>حداقل واحد</th>
                  <th>حداکثر واحد</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {customUnitsStudents.length > 0 ? (
                  customUnitsStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.student_id}</td>
                      <td>{student.full_name}</td>
                      <td>
                        <span className={`badge ${student.min_units !== 12 ? "badge--warning" : "badge--gray"}`}>
                          {student.min_units} واحد
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${student.max_units !== 20 ? "badge--blue" : "badge--gray"}`}>
                          {student.max_units} واحد
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn-icon btn-icon--edit"
                            onClick={() => handleEditStudentFromList(student)}
                            title="ویرایش"
                          >
                            <EditIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "40px" }}>
                      <span className="text-muted">
                        هیچ دانشجویی با واحد خارج از عرف وجود ندارد.
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
