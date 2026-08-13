import { useState, type FormEvent } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { AuthBackground } from './AuthBackground';
import { AuthCardHeader } from './AuthCardHeader';
import './auth.css';

interface ForgotPasswordPageProps {
  onBack: () => void;
}

export function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('الرجاء إدخال البريد الإلكتروني');
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 350);
  }

  return (
    <div className="auth-page">
      <AuthBackground />

      <div className="auth-card">
        <AuthCardHeader />

        <h1 className="auth-card__title">استعادة كلمة المرور</h1>
        <p className="auth-card__subtitle">
          أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور
        </p>

        {isSent ? (
          <div className="auth-form__success">
            <span className="auth-form__success-icon">
              <CheckCircle2 size={24} strokeWidth={2.4} />
            </span>
            <h2 className="auth-form__success-title">تم إرسال الرابط</h2>
            <p className="auth-form__success-text">
              تحقق من بريدك الإلكتروني {email && <bdi dir="ltr">{email}</bdi>} لمتابعة خطوات
              إعادة تعيين كلمة المرور.
            </p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <label className="auth-form__label" htmlFor="reset-email">
              البريد الإلكتروني
            </label>
            <div className="auth-form__field">
              <Mail size={18} className="auth-form__icon auth-form__icon--start" />
              <input
                id="reset-email"
                type="email"
                dir="ltr"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>

            {error && <p className="auth-form__error">{error}</p>}

            <button type="submit" className="auth-form__submit" disabled={isSubmitting}>
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال رابط إعادة الضبط'}
            </button>
          </form>
        )}

        <button type="button" className="auth-back-link" onClick={onBack}>
          العودة لتسجيل الدخول
        </button>
      </div>
    </div>
  );
}
