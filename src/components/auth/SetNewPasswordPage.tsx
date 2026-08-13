import { useState, type FormEvent } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { AuthBackground } from './AuthBackground';
import { AuthCardHeader } from './AuthCardHeader';
import './auth.css';

const MIN_PASSWORD_LENGTH = 8;

interface SetNewPasswordPageProps {
  onSuccess: () => void;
}

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}

function PasswordField({ id, label, value, onChange, autoComplete }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <label className="auth-form__label" htmlFor={id}>
        {label}
      </label>
      <div className="auth-form__field">
        <Lock size={18} className="auth-form__icon auth-form__icon--start" />
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          dir="ltr"
          placeholder="Enter Password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="auth-form__icon auth-form__icon--end"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </>
  );
}

export function SetNewPasswordPage({ onSuccess }: SetNewPasswordPageProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('الرجاء تعبئة جميع الحقول');
      return;
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(`كلمة المرور الجديدة يجب أن تتكون من ${MIN_PASSWORD_LENGTH} أحرف على الأقل`);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('كلمة المرور الجديدة وتأكيدها غير متطابقين');
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
    }, 350);
  }

  return (
    <div className="auth-page">
      <AuthBackground />

      <div className="auth-card">
        <AuthCardHeader />

        <h1 className="auth-card__title">تعيين كلمة مرور جديدة</h1>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <PasswordField
            id="current-password"
            label="كلمة المرور الحالية"
            value={currentPassword}
            onChange={setCurrentPassword}
            autoComplete="current-password"
          />

          <PasswordField
            id="new-password"
            label="كلمة المرور الجديدة"
            value={newPassword}
            onChange={setNewPassword}
            autoComplete="new-password"
          />

          <PasswordField
            id="confirm-password"
            label="تأكيد كلمة المرور"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
          />

          <div className="auth-form__utility-row">
            <label className="auth-form__remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>تذكرني</span>
            </label>
          </div>

          {error && <p className="auth-form__error">{error}</p>}

          <button type="submit" className="auth-form__submit" disabled={isSubmitting}>
            {isSubmitting ? 'جاري الحفظ...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
