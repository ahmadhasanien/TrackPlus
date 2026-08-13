import logoMark from '../../assets/logo-mark.png';

export function AuthCardHeader() {
  return (
    <div className="auth-card__brand">
      <img src={logoMark} alt="" className="auth-card__brand-icon" />
      <span className="auth-card__brand-word">
        track<span className="auth-card__brand-plus">+</span>
      </span>
    </div>
  );
}
