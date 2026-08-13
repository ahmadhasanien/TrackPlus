import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Calendar, ChevronLeft, Folder, Plus, Target, TrendingUp } from 'lucide-react';
import { FeedbackBanner } from '../ui/FeedbackBanner';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { PageHeader } from '../layout/PageHeader';
import { GoalDetailPage } from './GoalDetailPage';
import { AddGoalPage, type SavedGoalData } from './AddGoalPage';
import {
  goalFilterLabels,
  goalStatusVariant,
  goalsList as SEED_GOALS,
  type GoalFilterId,
  type GoalRow,
  type GoalDetail,
} from '../../data/goalsPage';
import '../layout/layout.css';
import '../tenants/tenants.css';
import './goals.css';
import './add-goal.css';

const FILTER_IDS: GoalFilterId[] = ['all', 'on-track', 'delayed'];

function GoalCard({ goal, onOpen }: { goal: GoalRow; onOpen: (id: string) => void }) {
  const shownTags = goal.projects.slice(0, 2);

  return (
    <article
      className="goals-card"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(goal.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpen(goal.id);
      }}
    >
      <div className="goals-card__header">
        <h3 className="goals-card__title">{goal.title}</h3>
        <div className="goals-card__header-right">
          <Badge
            variant={goalStatusVariant[goal.status]}
            icon={<span className="tenants-status-dot" />}
          >
            {goal.statusLabel}
          </Badge>
          <button
            type="button"
            className="tenants-table__nav-btn goals-card__arrow"
            aria-label="عرض تفاصيل الهدف"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(goal.id);
            }}
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
      <div className="goals-card__meta-row">
        <span className="goals-card__kpi">KPI: {goal.kpi}</span>
        <span className="goals-card__date">
          <Calendar size={13} strokeWidth={2} aria-hidden />
          {goal.dateRange}
        </span>
      </div>
      <div className="goals-card__progress-header">
        <span className="goals-card__progress-value">
          100% / <strong className={`goals-card__progress-value--${goal.progressTone}`}>{goal.progress}%</strong>
        </span>
        <span className="goals-card__progress-label">نسبة التحقيق</span>
      </div>
      <ProgressBar value={goal.progress} tone={goal.progressTone} className="goals-card__bar" />
      <div className="goals-card__tags">
        {shownTags.map((project) => (
          <span key={project.id} className="goals-tag">
            <span className="goals-tag__dot" style={{ background: project.color }} />
            {project.name}
          </span>
        ))}
        {goal.extraProjectsCount > 0 && (
          <span className="goals-tag goals-tag--muted">+ {goal.extraProjectsCount} مشاريع</span>
        )}
      </div>
    </article>
  );
}

type BannerType = 'success' | 'error' | null;

export function GoalsPage({ seniorHeader = false }: { seniorHeader?: boolean }) {
  const [goals, setGoals] = useState<GoalRow[]>(SEED_GOALS);
  const [customGoalDetails, setCustomGoalDetails] = useState<Record<string, GoalDetail>>({});
  const [activeFilter, setActiveFilter] = useState<GoalFilterId>('all');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [banner, setBanner] = useState<BannerType>(null);
  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showBanner = (type: BannerType) => {
    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    setBanner(type);
    bannerTimerRef.current = setTimeout(() => setBanner(null), 5000);
  };

  useEffect(() => () => { if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current); }, []);

  const handleGoalSave = (data: SavedGoalData) => {
    
    
    if (data.projectCount === 0) {
      showBanner('error');
      return;
    }

    const id = `goal-new-${Date.now()}`;
    const projectCount = Math.max(1, data.projectCount);

    const newGoal: GoalRow = {
      id,
      title: data.name,
      kpi: data.kpiDescription || `${data.baseline} ← ${data.target}`,
      dateRange: data.period || '—',
      status: 'on-track',
      statusLabel: 'على المسار',
      progress: 0,
      progressTone: 'success',
      projects: [],
      extraProjectsCount: projectCount,
    };

    
    
    const dummyProjects = Array.from({ length: Math.min(projectCount, 3) }, (_, index) => ({
      id: `${id}-project-${index + 1}`,
      title: `مشروع مرتبط ${index + 1}`,
      subtitle: 'شركة الحلول التقنية',
      progress: [45, 30, 20][index] ?? 25,
      status: index === 0 ? 'on-track' : 'delayed',
      statusLabel: index === 0 ? 'على المسار' : 'متأخر',
    })) as GoalDetail['projectsList'];

    const dummyDetail: GoalDetail = {
      ...newGoal,
      breadcrumbLabel: data.name,
      description: data.description || 'وصف تجريبي مؤقت لهذا الهدف، وسيتم استبداله ببيانات حقيقية عند ربط الواجهة الخلفية.',
      lastUpdatedLabel: 'الآن',
      linkedProjectsCount: projectCount,
      delayedProjectsCount: Math.max(0, projectCount - 1),
      avgProjectsProgress: 32,
      openRisks: { high: 1, medium: 2, low: 3 },
      outputs: [
        { id: `${id}-output-1`, title: 'تقرير تقدم الهدف', subtitle: 'مخرج تجريبي' },
        { id: `${id}-output-2`, title: 'خطة التنفيذ', subtitle: 'مخرج تجريبي' },
        { id: `${id}-output-3`, title: 'تقرير قياس المؤشر', subtitle: 'مخرج تجريبي' },
      ],
      projectsList: dummyProjects,
    };

    setGoals((prev) => [...prev, newGoal]);
    setCustomGoalDetails((prev) => ({ ...prev, [id]: dummyDetail }));
    showBanner('success');
  };

  const filteredGoals = useMemo(
    () => (activeFilter === 'all' ? goals : goals.filter((g) => g.status === activeFilter)),
    [goals, activeFilter],
  );

  const filterCounts = useMemo(() => {
    const counts: Record<GoalFilterId, number> = { all: goals.length, 'on-track': 0, delayed: 0, 'at-risk': 0 };
    goals.forEach((g) => { counts[g.status] += 1; });
    return counts;
  }, [goals]);

  const summary = useMemo(() => {
    const total = goals.length;
    const avgProgress = total
      ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / total)
      : 0;
    const linkedProjects = new Set(goals.flatMap((g) => g.projects.map((p) => p.id))).size
      + goals.reduce((sum, g) => sum + g.extraProjectsCount, 0);
    const delayed = goals.filter((g) => g.status === 'delayed' || g.status === 'at-risk').length;
    return { total, avgProgress, linkedProjects, delayed };
  }, [goals]);

  if (showAddGoal) {
    return <AddGoalPage onBack={() => setShowAddGoal(false)} onSave={handleGoalSave} />;
  }

  if (selectedGoalId) {
    return (
      <GoalDetailPage
        goalId={selectedGoalId}
        goalData={customGoalDetails[selectedGoalId]}
        onBack={() => setSelectedGoalId(null)}
      />
    );
  }

  return (
    <div className="dashboard-page">
      <PageHeader className={seniorHeader ? "page-header--senior" : undefined} title="الأهداف الإستراتيجية" />

      {banner && (
        <FeedbackBanner tone={banner} onClose={() => setBanner(null)}>
          {banner === 'success'
            ? 'تم إضافة الهدف بنجاح'
            : 'حدث خطأ ما ، يرجى المحاولة مرة أخرى'}
        </FeedbackBanner>
      )}

      <div className="tenants-body" dir="rtl">
        <button type="button" className="tenants-add-btn goals-add-btn" onClick={() => setShowAddGoal(true)}>
          <Plus size={16} strokeWidth={2.5} />
          إضافة هدف جديدة
        </button>

        <div className="goals-stats-grid">
          <Card className="goals-stat-card">
            <div className="widget-icon-header">
              <span className="widget-icon-badge">
                <Target size={16} strokeWidth={2} aria-hidden />
              </span>
              <p className="widget-title">إجمالي الأهداف</p>
            </div>
            <div className="goals-stat-card__value-row">
              <span className="widget-stat-value">{summary.total}</span>
              <span className="goals-stat-card__unit">أهداف</span>
            </div>
          </Card>

          <Card className="goals-stat-card">
            <div className="widget-icon-header">
              <span className="widget-icon-badge">
                <TrendingUp size={16} strokeWidth={2} aria-hidden />
              </span>
              <p className="widget-title">متوسط التحقيق</p>
            </div>
            <div className="goals-stat-card__value-row">
              <Badge variant="success" icon={<span className="tenants-status-dot" />}>على المسار</Badge>
              <span className="widget-stat-value">{summary.avgProgress}%</span>
            </div>
            <ProgressBar value={summary.avgProgress} tone="success" className="goals-stat-card__bar" />
          </Card>

          <Card className="goals-stat-card">
            <div className="widget-icon-header">
              <span className="widget-icon-badge">
                <Folder size={16} strokeWidth={2} aria-hidden />
              </span>
              <p className="widget-title">مشاريع مرتبطة</p>
            </div>
            <div className="goals-stat-card__value-row">
              <span className="widget-stat-value">{summary.linkedProjects}</span>
              <span className="goals-stat-card__unit">مشروع</span>
            </div>
          </Card>

          <Card className="goals-stat-card">
            <div className="widget-icon-header">
              <span className="widget-icon-badge widget-icon-badge--warning">
                <AlertCircle size={16} strokeWidth={2} aria-hidden />
              </span>
              <p className="widget-title">أهداف متأخرة</p>
            </div>
            <div className="goals-stat-card__value-row">
              <span className="widget-stat-value">{summary.delayed}</span>
              <span className="goals-stat-card__unit">أهداف</span>
            </div>
          </Card>
        </div>

        <div className="tenants-filter-tabs goals-filter-tabs">
          {FILTER_IDS.map((id) => (
            <button
              key={id}
              type="button"
              className={`tenants-filter-tab ${
                activeFilter === id ? 'tenants-filter-tab--active' : ''
              }`}
              onClick={() => setActiveFilter(id)}
            >
              {goalFilterLabels[id]}({filterCounts[id]})
            </button>
          ))}
        </div>

        <div className="goals-list">
          {filteredGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onOpen={setSelectedGoalId} />
          ))}
          {filteredGoals.length === 0 && (
            <Card className="goals-empty">لا توجد أهداف مطابقة لهذا الفلتر</Card>
          )}
        </div>
      </div>
    </div>
  );
}
