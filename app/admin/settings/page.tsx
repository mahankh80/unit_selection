"use client";

import { useState } from "react";
import { EditIcon } from "@components/icons/Edit";
import { DeleteIcon } from "@components/icons/Delete";

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
