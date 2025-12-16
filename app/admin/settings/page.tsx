"use client";

import { useState } from "react";
import { EditIcon } from "@components/icons/Edit";
import { DeleteIcon } from "@components/icons/Delete";
import { getStudentByStudentId, updateStudentUnits, type Student } from "@lib/api";

type UnitException = {
  id: number;
  studentId: string;
  studentName: string;
  maxUnits: number;
  reason: string;
};

const mockExceptions: UnitException[] = [
  {
    id: 1,
    studentId: "401234567",
    studentName: "علی احمدی",
    maxUnits: 24,
    reason: "دانشجوی ممتاز",
  },
  {
    id: 2,
    studentId: "401234890",
    studentName: "زهرا محمدی",
    maxUnits: 24,
    reason: "معدل بالای 18",
  },
];

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    defaultMaxUnits: 20,
    minUnits: 12,
  });

  const [exceptions, setExceptions] = useState<UnitException[]>(mockExceptions);
  const [showModal, setShowModal] = useState(false);
  const [editingException, setEditingException] = useState<UnitException | null>(null);
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    maxUnits: "24",
    reason: "",
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
      alert("واحدهای دانشجو با موفقیت به‌روزرسانی شد");
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "خطا در به‌روزرسانی واحدها");
    } finally {
      setSavingUnits(false);
    }
  };

  const handleAddException = () => {
    setEditingException(null);
    setFormData({
      studentId: "",
      studentName: "",
      maxUnits: "24",
      reason: "",
    });
    setShowModal(true);
  };

  const handleEdit = (exception: UnitException) => {
    setEditingException(exception);
    setFormData({
      studentId: exception.studentId,
      studentName: exception.studentName,
      maxUnits: exception.maxUnits.toString(),
      reason: exception.reason,
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("آیا از حذف این استثنا اطمینان دارید؟")) {
      setExceptions(exceptions.filter((e) => e.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const exceptionData: UnitException = {
      id: editingException?.id || Date.now(),
      studentId: formData.studentId,
      studentName: formData.studentName,
      maxUnits: parseInt(formData.maxUnits),
      reason: formData.reason,
    };

    if (editingException) {
      setExceptions(
        exceptions.map((ex) => (ex.id === editingException.id ? exceptionData : ex))
      );
    } else {
      setExceptions([...exceptions, exceptionData]);
    }

    setShowModal(false);
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

      {/* استثنائات دانشجویان */}
      <div className="settings-section">
        <div className="settings-section__header">
          <h2 className="settings-section__title">دانشجویان با سقف واحد بالاتر</h2>
          <button className="btn btn--primary" onClick={handleAddException}>
            افزودن دانشجو
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>شماره دانشجویی</th>
                <th>نام دانشجو</th>
                <th>حداکثر واحد</th>
                <th>دلیل</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {exceptions.length > 0 ? (
                exceptions.map((exception) => (
                  <tr key={exception.id}>
                    <td>{exception.studentId}</td>
                    <td>{exception.studentName}</td>
                    <td>
                      <span className="badge badge--blue">{exception.maxUnits} واحد</span>
                    </td>
                    <td>{exception.reason}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-icon btn-icon--edit"
                          onClick={() => handleEdit(exception)}
                          title="ویرایش"
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="btn-icon btn-icon--delete"
                          onClick={() => handleDelete(exception.id)}
                          title="حذف"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px" }}>
                    <span className="text-muted">
                      هیچ استثنایی تعریف نشده است. برای افزودن دانشجو روی دکمه بالا کلیک کنید.
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal افزودن/ویرایش */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingException ? "ویرایش استثنا" : "افزودن دانشجوی جدید"}
              </h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">شماره دانشجویی</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="مثال: 401234567"
                    value={formData.studentId}
                    onChange={(e) =>
                      setFormData({ ...formData, studentId: e.target.value })
                    }
                    required
                    pattern="[0-9]{9}"
                    title="شماره دانشجویی باید 9 رقم باشد"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">نام دانشجو</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="مثال: علی احمدی"
                    value={formData.studentName}
                    onChange={(e) =>
                      setFormData({ ...formData, studentName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group form-group--full">
                  <label className="form-label">حداکثر واحد مجاز</label>
                  <input
                    type="number"
                    className="form-input"
                    min="20"
                    max="28"
                    value={formData.maxUnits}
                    onChange={(e) =>
                      setFormData({ ...formData, maxUnits: e.target.value })
                    }
                    required
                  />
                  <span className="form-hint">معمولاً بین 20 تا 24 واحد</span>
                </div>

                <div className="form-group form-group--full">
                  <label className="form-label">دلیل</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="مثال: دانشجوی ممتاز - معدل بالای 18"
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
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
                  {editingException ? "ذخیره تغییرات" : "افزودن دانشجو"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
