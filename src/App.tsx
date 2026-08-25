import { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { Header } from './components/layout/Header';
import type { PageId } from './components/layout/Sidebar';
import { TenantsPage } from './components/tenants/TenantsPage';
import { AuditLogPage } from './components/audit/AuditLogPage';
import { SubscriptionsPage } from './components/subscriptions/SubscriptionsPage';
import { DashboardGrid, useDashboardState } from './components/dashboard/DashboardGrid';
import { WidgetLibraryPanel } from './components/dashboard/WidgetLibraryPanel';
import { AIAssistantPanel } from './components/assistant/AIAssistantPanel';
import { CompaniesPage } from './components/companies/CompaniesPage';
import { GoalsPage } from './components/goals/GoalsPage';
import { Login } from './components/auth/Login';
import { TwoFactor } from './components/auth/TwoFactor';
import { SetNewPasswordPage } from './components/auth/SetNewPasswordPage';
import { LoadingScreen } from './components/auth/LoadingScreen';
import { SeniorLayout } from './components/senior/SeniorLayout';
import { SeniorDashboardPage } from './components/senior/SeniorDashboardPage';
import { SeniorProjectsPage } from './components/senior/SeniorProjectsPage';
import type { SeniorPageId } from './components/senior/SeniorSidebar';
import { SeniorSettingsPage } from './components/senior/SeniorSettingsPage';
import { DepartmentsPage } from './components/senior/DepartmentsPage';
import { DepartmentDetailPage } from './components/senior/DepartmentDetailPage';
import { SeniorCompaniesPage } from './components/senior/SeniorCompaniesPage';
import type { Department } from './components/senior/DepartmentsPage';
import { DataEntryLayout } from './components/dataentry/DataEntryLayout';
import { DataEntryDashboardPage } from './components/dataentry/DataEntryDashboardPage';
import { DataEntryProjectsPage } from './components/dataentry/DataEntryProjectsPage';
import type { DataEntryPageId } from './components/dataentry/DataEntrySidebar';
import { DataEntrySettingsPage } from './components/dataentry/DataEntrySettingsPage';
import { DepartmentsPage as DataEntryDepartmentsPage } from './components/dataentry/DepartmentsPage';
import { DepartmentDetailPage as DataEntryDepartmentDetailPage } from './components/dataentry/DepartmentDetailPage';
import { DataEntryCompaniesPage } from './components/dataentry/DataEntryCompaniesPage';
import type { Department as DataEntryDepartment } from './components/dataentry/DepartmentsPage';
import type { UserRole } from './types/auth';
import {
  ADMIN_DEFAULT_ACTIVE_WIDGET_IDS,
  SUPERADMIN_DEFAULT_ACTIVE_WIDGET_IDS,
} from './config/widgets';
import { LandingPage } from './components/landing/LandingPage';
import './components/layout/layout.css';
import './components/dashboard/dashboard.css';
import './styles/global.css';

type AuthStep = 'landing' | 'login' | 'forgot-password' | 'otp' | 'authenticating' | 'authenticated';

function DashboardPage({ role }: { role: UserRole }) {
  const {
    isEditMode,
    setIsEditMode,
    activeWidgetIds,
    layout,
    setLayout,
    removeWidget,
    removedWidgetIds,
    addWidget,
  } = useDashboardState(
    role === 'admin' ? ADMIN_DEFAULT_ACTIVE_WIDGET_IDS : SUPERADMIN_DEFAULT_ACTIVE_WIDGET_IDS,
  );

  return (
    <div className="dashboard-page">
      <Header
        role={role}
        isEditMode={isEditMode}
        onToggleEdit={() => setIsEditMode((prev) => !prev)}
      />
      <div className="dashboard-body">
        <div
          className={`dashboard-body__grid-area ${
            isEditMode ? 'dashboard-body__grid-area--library-open' : ''
          }`}
        >
          <DashboardGrid
            isEditMode={isEditMode}
            activeWidgetIds={activeWidgetIds}
            layout={layout}
            onLayoutChange={setLayout}
            onRemoveWidget={removeWidget}
          />
        </div>
      </div>
      {isEditMode && (
        <WidgetLibraryPanel
          onClose={() => setIsEditMode(false)}
          removedWidgetIds={removedWidgetIds}
          onAddWidget={addWidget}
        />
      )}
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [seniorActivePage, setSeniorActivePage] = useState<SeniorPageId>('dashboard');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [departmentDeleted, setDepartmentDeleted] = useState(false);
  const [dataEntryActivePage, setDataEntryActivePage] = useState<DataEntryPageId>('dashboard');
  const [selectedDataEntryDepartment, setSelectedDataEntryDepartment] = useState<DataEntryDepartment | null>(null);
  const [dataEntryDepartmentDeleted, setDataEntryDepartmentDeleted] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>('landing');
  const [role, setRole] = useState<UserRole>('superadmin');

  if (authStep === 'landing') {
    return <LandingPage onLoginClick={() => setAuthStep('login')} />;
  }

  if (authStep === 'login') {
    return (
      <Login
        onSuccess={(loggedInRole) => {
          setRole(loggedInRole);
          setActivePage('dashboard');
          setSeniorActivePage('dashboard');
          setDataEntryActivePage('dashboard');
          setAuthStep('authenticating');
          window.setTimeout(() => setAuthStep('otp'), 500);
        }}
        onForgotPassword={() => setAuthStep('forgot-password')}
      />
    );
  }

  if (authStep === 'forgot-password') {
    return <SetNewPasswordPage onSuccess={() => setAuthStep('login')} />;
  }

  if (authStep === 'authenticating') {
    return <LoadingScreen label="جاري تسجيل الدخول..." />;
  }

  if (authStep === 'otp') {
    return (
      <TwoFactor
        onSuccess={() => setAuthStep('authenticated')}
        onBack={() => setAuthStep('login')}
      />
    );
  }

  const handleSignOut = () => {
    setAuthStep('login');
    setActivePage('dashboard');
    setSeniorActivePage('dashboard');
    setSelectedDepartment(null);
    setDataEntryActivePage('dashboard');
    setSelectedDataEntryDepartment(null);
    setRole('superadmin');
  };

  
  if (role === 'senior_management') {
    function renderSeniorPage() {
      if (seniorActivePage === 'dashboard') return <SeniorDashboardPage />;
      if (seniorActivePage === 'goals') return <GoalsPage seniorHeader />;
      if (seniorActivePage === 'projects') return <SeniorProjectsPage />;
      if (seniorActivePage === 'companies') return <SeniorCompaniesPage />;
      if (seniorActivePage === 'departments') {
        if (selectedDepartment) return (
          <DepartmentDetailPage
            departmentId={selectedDepartment.id}
            onBack={(reason) => {
              setSelectedDepartment(null);
              if (reason === 'deleted') setDepartmentDeleted(true);
            }}
          />
        );
        return (
          <DepartmentsPage
            onOpenDepartment={setSelectedDepartment}
            departmentDeleted={departmentDeleted}
            onClearDeleted={() => setDepartmentDeleted(false)}
          />
        );
      }
      if (seniorActivePage === 'settings') return <SeniorSettingsPage />;
      return <CompaniesPage />;
    }

    return (
      <SeniorLayout
        role={role}
        activePage={seniorActivePage}
        onNavigate={(page) => {
          
          
          
          if (page !== 'departments') setSelectedDepartment(null);
          setSeniorActivePage(page);
        }}
        onSignOut={handleSignOut}
      >
        {renderSeniorPage()}
      </SeniorLayout>
    );
  }

  
  if (role === 'dataentry_management') {
    function renderDataEntryPage() {
      if (dataEntryActivePage === 'dashboard') return <DataEntryDashboardPage />;
      if (dataEntryActivePage === 'goals') return <GoalsPage seniorHeader />;
      if (dataEntryActivePage === 'projects') return <DataEntryProjectsPage />;
      if (dataEntryActivePage === 'companies') return <DataEntryCompaniesPage />;
      if (dataEntryActivePage === 'departments') {
        if (selectedDataEntryDepartment) return (
          <DataEntryDepartmentDetailPage
            departmentId={selectedDataEntryDepartment.id}
            onBack={(reason) => {
              setSelectedDataEntryDepartment(null);
              if (reason === 'deleted') setDataEntryDepartmentDeleted(true);
            }}
          />
        );
        return (
          <DataEntryDepartmentsPage
            onOpenDepartment={setSelectedDataEntryDepartment}
            departmentDeleted={dataEntryDepartmentDeleted}
            onClearDeleted={() => setDataEntryDepartmentDeleted(false)}
          />
        );
      }
      if (dataEntryActivePage === 'settings') return <DataEntrySettingsPage />;
      return <CompaniesPage />;
    }

    return (
      <DataEntryLayout
        role={role}
        activePage={dataEntryActivePage}
        onNavigate={(page) => {
          
          
          
          if (page !== 'departments') setSelectedDataEntryDepartment(null);
          setDataEntryActivePage(page);
        }}
        onSignOut={handleSignOut}
      >
        {renderDataEntryPage()}
      </DataEntryLayout>
    );
  }

  function renderPage() {
    if (activePage === 'dashboard') return <DashboardPage role={role} />;
    if (activePage === 'goals') return <GoalsPage />;
    if (role === 'admin') return <CompaniesPage />;
    if (activePage === 'tenants') return <TenantsPage />;
    if (activePage === 'subscriptions') return <SubscriptionsPage />;
    return <AuditLogPage />;
  }

  return (
    <AppShell
      role={role}
      activePage={activePage}
      onNavigate={setActivePage}
      onSignOut={handleSignOut}
    >
      {renderPage()}
      {role !== 'superadmin' && <AIAssistantPanel />}
    </AppShell>
  );
}

export default App;
