import { useState } from 'react';
import { Nav } from './Nav';
import { Hero } from './Hero';
import { Overview } from './Overview';
import { Unified } from './Unified';
import { LinkGoal } from './LinkGoal';
import { Capabilities } from './Capabilities';
import { Kpis } from './Kpis';
import { Hosting } from './Hosting';
import { PlatformValue } from './PlatformValue';
import { DemoCta } from './DemoCta';
import { SiteFooter } from './SiteFooter';
import { DemoRequestPage } from './DemoRequestPage';
import './landing.css';
import './landing-sections.css';

interface LandingPageProps {
  /** Called when the person clicks one of the landing page's "تسجيل الدخول" buttons. */
  onLoginClick: () => void;
}

/**
 * Composes the original track-plus-project landing sections unchanged.
 * Login buttons inside Nav/Footer have no built-in behavior in the source
 * design, so we listen for clicks on them here (via delegation) rather
 * than editing those files. The same delegation catches any "اطلب عرض
 * تجريبي" (request a demo) button anywhere on the page and swaps in the
 * DemoRequestPage form.
 */
export function LandingPage({ onLoginClick }: LandingPageProps) {
  const [showDemoRequest, setShowDemoRequest] = useState(false);

  return (
    <div
      className="tp-landing bg-background"
      dir="rtl"
      onClickCapture={(e) => {
        const button = (e.target as HTMLElement).closest('button');
        if (!button) return;
        const label =
          button.getAttribute('aria-label') ??
          button.querySelector('img')?.getAttribute('alt') ??
          button.textContent ??
          '';
        if (label.includes('تسجيل الدخول')) {
          onLoginClick();
        } else if (label.includes('اطلب عرض تجريبي')) {
          setShowDemoRequest(true);
        }
      }}
    >
      {showDemoRequest ? (
        <DemoRequestPage onSubmitted={() => setShowDemoRequest(false)} />
      ) : (
        <>
          <Nav />
          <Hero />
          <div className="landing-flow">
            <Overview />
            <Unified />
            <LinkGoal />
            <Capabilities />
            <Kpis />
            <Hosting />
            <PlatformValue />
            <DemoCta />
          </div>
          <SiteFooter />
        </>
      )}
    </div>
  );
}
