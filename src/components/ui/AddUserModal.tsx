import { useState } from 'react';
import '../tenants/tenant-details.css';

export type AddUserModalRole = 'إدارة عليا' | 'مدخل بيانات';

interface AddUserModalProps {
  onClose: () => void;
  onSubmit?: (user: { name: string; email: string; department: string; role: AddUserModalRole }) => void;
}

export function AddUserModal({ onClose, onSubmit }: AddUserModalProps) {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    department: '',
    role: '' as AddUserModalRole | '',
  });

  function handleSubmit() {
    const name = newUser.name.trim();
    const email = newUser.email.trim();
    const department = newUser.department.trim();
    const role = newUser.role;
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !email || !department || !role || !emailIsValid) {
      onClose();
      return;
    }

    onSubmit?.({ name, email, department, role });
    onClose();
  }

  return (
    <div className="td-add-user-overlay" role="presentation">
      <div
        className="td-add-user-modal"
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-user-modal-title"
      >
        <div className="td-add-user-modal__header">
          <div className="td-add-user-modal__icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
              <path d="M5.5 19c.55-3.1 2.7-4.8 6.5-4.8s5.95 1.7 6.5 4.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </div>
          <h2 id="add-user-modal-title">إضافة مستخدم</h2>
        </div>

        <div className="td-add-user-modal__divider" />

        <div className="td-add-user-form">
          <label className="td-add-user-field">
            <span>الاسم الكامل</span>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
              autoComplete="name"
            />
          </label>

          <label className="td-add-user-field">
            <span>البريد الالكتروني</span>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
              autoComplete="email"
              dir="ltr"
            />
          </label>

          <label className="td-add-user-field">
            <span>القسم / الإدارة</span>
            <input
              type="text"
              value={newUser.department}
              onChange={(e) => setNewUser((prev) => ({ ...prev, department: e.target.value }))}
            />
          </label>

          <label className="td-add-user-field">
            <span>الدور</span>
            <div className="td-add-user-select-wrap">
              <select
                value={newUser.role}
                onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value as AddUserModalRole }))}
              >
                <option value="">اختر الدور</option>
                <option value="إدارة عليا">إدارة عليا</option>
                <option value="مدخل بيانات">مدخل بيانات</option>
              </select>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </label>
        </div>

        <div className="td-add-user-modal__actions">
          <button type="button" className="td-add-user-submit" onClick={handleSubmit}>
            <span>ارسال دعوة</span>
            <span className="td-add-user-submit__icon" aria-hidden>✓</span>
          </button>
          <button type="button" className="td-add-user-cancel" onClick={onClose}>
            <span>إلغاء</span>
            <span className="td-add-user-cancel__icon" aria-hidden>×</span>
          </button>
        </div>
      </div>
    </div>
  );
}
