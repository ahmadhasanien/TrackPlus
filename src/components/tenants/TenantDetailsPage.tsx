import {
  Download,
  Bell,
  HardDrive,
  Users,
  Activity,
  Building2,
  CreditCard,
  RefreshCw,
  CheckCircle2,
  Pencil,
  UserX,
  UserCheck,
  Trash2,
  Shield,
} from 'lucide-react';
import { useState } from 'react';
import { useTenantById, useTenantMutations, type TenantUser, type TenantUserRole } from '../../context/TenantContext';
import { PageHeader } from '../layout/PageHeader';
import { FeedbackBanner } from '../ui/FeedbackBanner';
import './tenant-details.css';

interface TenantDetailsPageProps {
  tenantId: string;
  onBack: () => void;
  onDeleted: () => void;
}

const ROLE_CLASS: Record<TenantUser['role'], string> = {
  'مدير النظام': 'td-role-badge--admin',
  'محلل':        'td-role-badge--analyst',
  'مشرف':        'td-role-badge--supervisor',
  'مستخدم':      'td-role-badge--user',
};

function RoleBadge({ role }: { role: TenantUser['role'] }) {
  return <span className={`td-role-badge ${ROLE_CLASS[role]}`}>{role}</span>;
}

function parseBytes(s: string): number {
  const n = parseFloat(s.replace(/[^0-9.]/g, ''));
  if (/TB|تيرابايت/i.test(s)) return n * 1024;
  return n; 
}

function pct(used: number, total: number) {
  if (!total) return 0;
  return Math.min(100, Math.round((used / total) * 100));
}

function barClass(p: number) {
  if (p >= 85) return 'td-progress-fill--red';
  if (p >= 60) return 'td-progress-fill--yellow';
  return 'td-progress-fill--green';
}

export function TenantDetailsPage({ tenantId, onBack, onDeleted }: TenantDetailsPageProps) {
  const tenant = useTenantById(tenantId);
  const { updateTenant, deleteTenant } = useTenantMutations();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [banner, setBanner] = useState<'success' | 'error' | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    department: '',
    role: '' as TenantUserRole | '',
  });

  

  if (!tenant) {
    return (
      <div className="dashboard-page">
        <PageHeader
          title="غير موجود"
          breadcrumbs={[{ label: 'إدارة المستأجرين', onClick: onBack }]}
        />
        <div className="td-page" dir="rtl">
          <div className="td-body" style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#71717a' }}>لم يتم العثور على المستأجر</p>
            <button type="button" className="td-btn td-btn--outline" style={{ marginTop: 12 }} onClick={onBack}>
              العودة للقائمة
            </button>
          </div>
        </div>
      </div>
    );
  }

  

  const storagePct = pct(parseBytes(tenant.usedStorage), parseBytes(tenant.storageLimit));
  const userPct    = pct(tenant.activeUsers, tenant.userLimit);
  const isSuspended = tenant.status === 'suspended';

  const statusPillClass =
    tenant.status === 'active'    ? 'td-status-pill--active'
    : tenant.status === 'suspended' ? 'td-status-pill--suspended'
    : 'td-status-pill--trial';

  

  const infoFields = [
    { label: 'اسم الجهة',           value: tenant.entityName },
    { label: 'رقم السجل التجاري',   value: tenant.crNumber },
    { label: 'القطاع',              value: tenant.sector },
    { label: 'مدير الحساب',         value: tenant.adminName },
    { label: 'رقم الهاتف',          value: tenant.phone },
    { label: 'البريد الإلكتروني',   value: tenant.email },
    { label: 'تاريخ الانضمام',      value: tenant.joinDate },
    { label: 'نوع الحساب',          value: tenant.accountType },
    { label: 'المنطقة',             value: tenant.region },
  ];

  

  function handleToggleSuspend() {
    if (!tenant) return;
    const next: typeof tenant.status = isSuspended ? 'active' : 'suspended';
    updateTenant(tenant.id, {
      status:      next,
      statusLabel: next === 'active' ? 'نشط' : 'معلق',
    });
  }

  function handleDelete() {
    if (!tenant) return;
    const ok = window.confirm(
      `هل أنت متأكد من حذف "${tenant.name}" نهائياً؟\nلا يمكن التراجع عن هذه العملية.`,
    );
    if (!ok) return;
    deleteTenant(tenant.id);
    onDeleted();
  }

  function handleToggleUser(userId: string, current: 'active' | 'suspended') {
    if (!tenant) return;
    const next: 'active' | 'suspended' = current === 'active' ? 'suspended' : 'active';
    const updatedUsers = tenant.users.map((u) =>
      u.id === userId
        ? { ...u, status: next, statusLabel: next === 'active' ? 'نشط' : 'معلق' }
        : u,
    );
    updateTenant(tenant.id, { users: updatedUsers });
  }

  function closeAddUserModal() {
    setIsAddUserOpen(false);
    setNewUser({ name: '', email: '', department: '', role: '' });
  }

  function handleAddUserSubmit() {
    if (!tenant) return;

    const name = newUser.name.trim();
    const email = newUser.email.trim();
    const department = newUser.department.trim();
    const role = newUser.role;
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !email || !department || !role || !emailIsValid) {
      closeAddUserModal();
      setBanner('error');
      return;
    }

    const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('');
    const colors = ['#2563eb', '#7c3aed', '#059669', '#dc2626', '#d97706', '#0891b2'];
    const avatarColor = colors[tenant.users.length % colors.length];
    const user: TenantUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      department,
      initials: initials || name.slice(0, 2),
      avatarColor,
      role,
      status: 'active',
      statusLabel: 'نشط',
    };

    updateTenant(tenant.id, {
      users: [...tenant.users, user],
      activeUsers: tenant.activeUsers + 1,
    });
    closeAddUserModal();
    setBanner('success');
  }

  

  return (
    <div className="dashboard-page">
      <PageHeader
        title={tenant.name}
        breadcrumbs={[{ label: 'إدارة المستأجرين', onClick: onBack }]}
      />
      {banner && (
        <FeedbackBanner tone={banner} onClose={() => setBanner(null)}>
          {banner === 'success' ? 'تم إرسال الدعوة بنجاح' : 'حدث خطأ ما، يرجى المحاولة مرة أخرى'}
        </FeedbackBanner>
      )}
      <div className="td-page" dir="rtl">

        {}
        <div className="td-body">

          {}
          <div className="td-title-row">
            <div className="td-title-block">
              <h1 className="td-title">{tenant.name}</h1>
              <div className="td-meta-row">
                <span className="td-meta-item">
                  #{tenant.id}
                </span>
                <span className="td-meta-sep" />
                <span className="td-meta-item">
                  {tenant.joinDuration}
                </span>
                <span className="td-meta-sep" />
                <span className="td-meta-item">
                  آخر نشاط: {tenant.lastActivity}
                </span>
              </div>
            </div>

            <div className="td-actions">
              <button
                type="button"
                className="td-add-user-btn"
                onClick={() => {
                  setBanner(null);
                  setIsAddUserOpen(true);
                }}
              >
                <span>إضافة مستخدم</span>
                <span className="td-add-user-btn__plus" aria-hidden>+</span>
              </button>
              <button type="button" className="td-btn td-btn--outline">
                <Download size={14} strokeWidth={2.25} />
                تصدير البيانات
              </button>
              <button type="button" className="td-btn td-btn--solid">
                <Bell size={14} strokeWidth={2.25} />
                إرسال إشعار
              </button>
            </div>
          </div>

          {}
          <div className="td-kpi-row">

            {}
            <div className="td-kpi-card">
              <div className="td-kpi-card__header">
                <span className="td-kpi-card__icon-badge">
                  <HardDrive size={14} strokeWidth={2} />
                </span>
                <p className="td-kpi-card__label">التخزين المستخدم</p>
              </div>
              <p className="td-kpi-card__value">
                {tenant.usedStorage}
                <span className="td-kpi-card__sub"> / {tenant.storageLimit}</span>
              </p>
              <div className="td-kpi-card__progress">
                <div className="td-progress-track">
                  <div
                    className={`td-progress-fill ${barClass(storagePct)}`}
                    style={{ width: `${storagePct}%` }}
                  />
                </div>
              </div>
            </div>

            {}
            <div className="td-kpi-card">
              <div className="td-kpi-card__header">
                <span className="td-kpi-card__icon-badge">
                  <Users size={14} strokeWidth={2} />
                </span>
                <p className="td-kpi-card__label">المستخدمون النشطون</p>
              </div>
              <p className="td-kpi-card__value">
                {tenant.activeUsers}
                <span className="td-kpi-card__sub"> / {tenant.userLimit}</span>
              </p>
              <div className="td-kpi-card__progress">
                <div className="td-progress-track">
                  <div
                    className={`td-progress-fill ${barClass(userPct)}`}
                    style={{ width: `${userPct}%` }}
                  />
                </div>
              </div>
            </div>

            {}
            <div className="td-kpi-card">
              <div className="td-kpi-card__header">
                <span className="td-kpi-card__icon-badge">
                  <Activity size={14} strokeWidth={2} />
                </span>
                <p className="td-kpi-card__label">حالة الحساب</p>
              </div>
              <span className={`td-status-pill ${statusPillClass}`}>
                <span className="td-status-dot" />
                {tenant.statusLabel}
              </span>
              <p className="td-status-desc">
                {isSuspended
                  ? 'الحساب موقوف — المستخدمون لا يملكون وصولاً'
                  : tenant.status === 'trial'
                  ? 'فترة تجريبية — ميزات محدودة'
                  : 'الحساب يعمل بشكل طبيعي'}
              </p>
            </div>
          </div>

          {}
          <div className="td-sub-banner">

            {}
            <div className="td-sub-banner__features">
              <p className="td-sub-banner__features-title">المميزات المتاحة</p>
              <div className="td-sub-banner__feature-list">
                {tenant.package.features.map((f) => (
                  <span key={f} className="td-sub-banner__feature">
                    <CheckCircle2 size={13} strokeWidth={2.5} />
                    {f}
                  </span>
                ))}
                {tenant.package.features.length === 0 && (
                  <span className="td-sub-banner__feature" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    لا توجد مميزات مضافة
                  </span>
                )}
              </div>
            </div>

            {}
            <div className="td-sub-banner__info">
              <span className="td-sub-banner__eyebrow">الاشتراك الحالي</span>
              <h2 className="td-sub-banner__pkg-name">باقة {tenant.package.name}</h2>
              <div className="td-sub-banner__details">
                <span className="td-sub-banner__detail">
                  <CreditCard size={13} strokeWidth={2} />
                  التكلفة:&nbsp;
                  <span className="td-sub-banner__detail-value">{tenant.package.monthlyCost}</span>
                </span>
                <span className="td-sub-banner__detail">
                  <RefreshCw size={13} strokeWidth={2} />
                  تاريخ التجديد:&nbsp;
                  <span className="td-sub-banner__detail-value">{tenant.package.renewalDate}</span>
                </span>
              </div>
            </div>
          </div>

          {}
          <div className="td-main-card">

            {}
            <div className="td-section">
              <h3 className="td-section__title">
                <span className="td-section__title-icon">
                  <Building2 size={15} strokeWidth={2} />
                </span>
                معلومات الجهة
              </h3>

              <div className="td-info-grid">
                {infoFields.map((f) => (
                  <div key={f.label}>
                    <p className="td-info-field__label">{f.label}</p>
                    <p className="td-info-field__value">{f.value || '—'}</p>
                  </div>
                ))}
              </div>
            </div>

            {}
            <div className="td-section">
              <h3 className="td-section__title">
                <span className="td-section__title-icon">
                  <Users size={15} strokeWidth={2} />
                </span>
                المستخدمون
                <span className="td-section__title-count">{tenant.users.length}</span>
              </h3>

              <div className="td-users-table">
                {}
                <div className="td-users-row td-users-row--head">
                  <span className="td-users-head-cell">المستخدم</span>
                  <span className="td-users-head-cell">الدور</span>
                  <span className="td-users-head-cell">الحالة</span>
                  <span className="td-users-head-cell">إجراءات</span>
                </div>

                {}
                {tenant.users.map((user) => (
                  <div className="td-users-row" key={user.id}>

                    {}
                    <div className="td-user-identity">
                      <div
                        className="td-user-avatar"
                        style={{ background: user.avatarColor }}
                      >
                        {user.initials}
                      </div>
                      <div>
                        <p className="td-user-name">{user.name}</p>
                        <p className="td-user-email">{user.email}</p>
                      </div>
                    </div>

                    {}
                    <RoleBadge role={user.role} />

                    {}
                    <span
                      className={`td-user-status ${
                        user.status === 'active'
                          ? 'td-user-status--active'
                          : 'td-user-status--suspended'
                      }`}
                    >
                      <span className="td-status-dot" />
                      {user.statusLabel}
                    </span>

                    {}
                    <div className="td-user-actions">
                      <button
                        type="button"
                        className="td-user-btn"
                        title="تعديل الدور"
                      >
                        <Pencil size={11} strokeWidth={2.5} />
                        تعديل الدور
                      </button>
                      <button
                        type="button"
                        className={`td-user-btn ${
                          user.status === 'active'
                            ? 'td-user-btn--danger'
                            : 'td-user-btn--activate'
                        }`}
                        onClick={() => handleToggleUser(user.id, user.status)}
                      >
                        {user.status === 'active' ? (
                          <><UserX size={11} strokeWidth={2.5} /> تعليق</>
                        ) : (
                          <><UserCheck size={11} strokeWidth={2.5} /> تفعيل</>
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                {tenant.users.length === 0 && (
                  <div style={{ padding: '24px 0', color: '#a1a1aa', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
                    لا يوجد مستخدمون مضافون بعد
                  </div>
                )}
              </div>
            </div>

            {}
            <div className="td-admin-section">
              <h3 className="td-admin-section__title">
                <span className="td-section__title-icon">
                  <Shield size={15} strokeWidth={2} />
                </span>
                إجراءات Super Admin
              </h3>

              <div className="td-admin-actions-row">

                {}
                <div className="td-admin-action">
                  <label className="td-toggle">
                    <input
                      type="checkbox"
                      checked={isSuspended}
                      onChange={handleToggleSuspend}
                    />
                    <span className="td-toggle__track" />
                  </label>
                  <div className="td-admin-action__text">
                    <p className="td-admin-action__title">تعليق الحساب</p>
                    <p className="td-admin-action__desc">
                      {isSuspended
                        ? 'الحساب معلق حالياً — قم بتشغيل المفتاح لإعادة التفعيل الفوري.'
                        : 'يوقف وصول جميع مستخدمي الجهة فوراً دون حذف أي بيانات.'}
                    </p>
                  </div>
                </div>

                <div className="td-admin-divider" />

                {}
                <div className="td-admin-action">
                  <div className="td-admin-action__text">
                    <p className="td-admin-action__title td-admin-action__title--danger">
                      حذف المستأجر نهائياً
                    </p>
                    <p className="td-admin-action__desc">
                      يحذف الجهة وجميع بياناتها بشكل دائم ولا يمكن التراجع عن هذه العملية.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="td-delete-btn"
                    onClick={handleDelete}
                  >
                    <Trash2 size={13} strokeWidth={2.25} />
                    حذف الحساب
                  </button>
                </div>
              </div>
            </div>

          </div>{}
        </div>{}
      </div>{}

      {isAddUserOpen && (
        <div className="td-add-user-overlay" role="presentation">
          <div
            className="td-add-user-modal"
            dir="rtl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="td-add-user-title"
          >
            <div className="td-add-user-modal__header">
              <div className="td-add-user-modal__icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M5.5 19c.55-3.1 2.7-4.8 6.5-4.8s5.95 1.7 6.5 4.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </div>
              <h2 id="td-add-user-title">إضافة مستخدم</h2>
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
                <span>البريد الإلكتروني</span>
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
                    onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value as TenantUserRole }))}
                  >
                    <option value="">اختر الدور</option>
                    <option value="مدير النظام">مدير النظام</option>
                    <option value="محلل">محلل</option>
                    <option value="مشرف">مشرف</option>
                    <option value="مستخدم">مستخدم</option>
                  </select>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </label>
            </div>

            <div className="td-add-user-modal__actions">
              <button type="button" className="td-add-user-submit" onClick={handleAddUserSubmit}>
                <span>إرسال دعوة</span>
                <span className="td-add-user-submit__icon" aria-hidden>✓</span>
              </button>
              <button type="button" className="td-add-user-cancel" onClick={closeAddUserModal}>
                <span>إلغاء</span>
                <span className="td-add-user-cancel__icon" aria-hidden>×</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
