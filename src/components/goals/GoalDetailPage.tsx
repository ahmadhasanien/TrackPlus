import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Calendar, ChevronLeft, Folder, Plus, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { SubpageHeader } from '../layout/SubpageHeader';
import {
  goalDetails,
  goalStatusVariant,
  type GoalDetail,
} from '../../data/goalsPage';
import '../layout/layout.css';
import '../tenants/tenants.css';
import './goals.css';

interface GoalDetailPageProps {
  goalId: string;
  goalData?: GoalDetail;
  onBack: () => void;
}

export function GoalDetailPage({ goalId, goalData, onBack }: GoalDetailPageProps) {
  const goal = goalData ?? goalDetails[goalId];

  if (!goal) {
    return (
      <div className="dashboard-page">
        <SubpageHeader parent="الأهداف الإستراتيجية" title="الهدف غير موجود" onBack={onBack} />
      </div>
    );
  }

  const riskData = [
    { name: 'مرتفع', value: goal.openRisks.high, color: '#F04438' },
    { name: 'متوسط', value: goal.openRisks.medium, color: '#F79009' },
    { name: 'منخفض', value: goal.openRisks.low, color: '#17B26A' },
  ];
  const remaining = 100 - goal.progress;

  return (
    <div className="dashboard-page">
      <SubpageHeader parent="الأهداف الإستراتيجية" title={goal.breadcrumbLabel} onBack={onBack} />

      <div className="tenants-body" dir="rtl">
        
        <div className="goals-detail-header">
          <h2 className="goals-detail-header__title">{goal.title}</h2>
          <div className="goals-detail-header__meta">
            <span>آخر تحديث: {goal.lastUpdatedLabel}</span>
            <span className="goals-detail-header__sep">•</span>
            <span className="goals-detail-header__meta-item">
              {goal.linkedProjectsCount} مشاريع مرتبطة
            </span>
            <span className="goals-detail-header__sep">•</span>
            <span className="goals-detail-header__meta-item">
              <Calendar size={13} strokeWidth={2} aria-hidden />
              {goal.dateRange}
            </span>
          </div>
          <p className="goals-detail-header__desc">{goal.description}</p>
        </div>

        
        <div className="goals-stats-grid">
          
          <Card className="goals-stat-card">
            <div className="widget-icon-header">
              
              <p className="widget-title">مشاريع مرتبطة</p>
              <span className="widget-icon-badge">
                
                <Folder size={16} strokeWidth={2} aria-hidden />
              </span>
            </div>
            <div className="goals-stat-card__value-row">
              <span className="widget-stat-value">{goal.linkedProjectsCount}</span>
              <span className="goals-stat-card__unit">مشروع</span>
            </div>
          </Card>

          
          <Card className="goals-stat-card">
            <div className="widget-icon-header">
              
              <p className="widget-title">مشاريع متأخرة</p>
              <span className="widget-icon-badge widget-icon-badge--warning">
                
                <svg width="16" height="16" viewBox="0 0 22 22" fill="none" aria-hidden>
                  <circle cx="11" cy="11" r="9.167" stroke="#F79009" strokeWidth="1.5" />
                  <path d="M11 7.333V12.333" stroke="#F79009" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="11" cy="14.667" r="0.75" fill="#F79009" />
                </svg>
              </span>
            </div>
            <div className="goals-stat-card__value-row">
              <span className="widget-stat-value">{goal.delayedProjectsCount}</span>
              <span className="goals-stat-card__unit">مشاريع</span>
            </div>
          </Card>

          
          <Card className="goals-stat-card goals-avg-card">
            <div className="widget-icon-header">
              
              <p className="widget-title goals-avg-card__title">متوسط تقدم المشاريع</p>
              <span className="widget-icon-badge goals-avg-card__trend-badge">
                <svg width="16" height="11" viewBox="0 0 16 11" fill="none" aria-hidden>
                  <path
                    d="M9 2L15.5 0L13.9 6.5L11.8 4.5L8.4 8.1C8.28 8.22 8.12 8.28 7.95 8.28C7.78 8.28 7.62 8.22 7.5 8.1L5.1 5.55L1.1 9.77C0.87 10.01 0.48 10.01 0.25 9.77C0.02 9.53 0.02 9.14 0.25 8.9L4.68 4.21C4.8 4.09 4.96 4.02 5.13 4.02C5.3 4.02 5.46 4.09 5.58 4.21L7.98 6.77L10.82 3.73L9 2Z"
                    fill="#17B26A"
                  />
                </svg>
              </span>
            </div>
            <div className="goals-avg-card__value-row">
              
              <span className="widget-stat-value goals-avg-card__value">{goal.avgProjectsProgress}%</span>
              <Badge variant="success" icon={<span className="tenants-status-dot" />}>على المسار</Badge>
            </div>
            <ProgressBar value={goal.avgProjectsProgress} tone="success" className="goals-avg-card__bar" />
          </Card>

          
          <Card className="goals-stat-card goals-risks-card">
            <p className="widget-title goals-risks-card__label">مخاطر مفتوحة</p>
            <div className="goals-risks-card__body">
              
              <div className="goals-risks-legend">
                {riskData.map((item) => (
                  <div key={item.name} className="goals-risks-legend__row">
                    <span className="goals-risks-legend__name" style={{ color: item.color }}>{item.name}</span>
                    <span className="goals-risks-legend__dot" style={{ background: item.color }} />
                    <span className="goals-risks-legend__count">{item.value}</span>
                  </div>
                ))}
              </div>
              
              <div className="goals-risks-card__donut">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={22}
                      outerRadius={34}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {riskData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>

        
        <Card className="goals-kpi-card">
          <div className="goals-kpi-card__top">
            <h3 className="goals-kpi-card__title">مؤشر الأداء الرئيسي</h3>
            <span className="goals-kpi-card__pill">
              متبقي {remaining}% للهدف
              <X size={12} strokeWidth={2.5} />
            </span>
          </div>
          <div className="goals-kpi-card__value-row">
            <span className="goals-kpi-card__value">
              100% / <strong className={`goals-kpi-card__value--${goal.progressTone}`}>{goal.progress}%</strong>
            </span>
          </div>
          <ProgressBar
            value={goal.progress}
            tone={goal.progressTone}
            className="goals-kpi-card__bar"
          />
          <div className="goals-card__tags goals-kpi-card__tags">
            
            {goal.projects.map((project) => (
              <span key={project.id} className="goals-tag">
                <span className="goals-tag__dot" style={{ background: project.color }} />
                {project.name}
              </span>
            ))}
            {goal.extraProjectsCount > 0 && (
              <span className="goals-tag goals-tag--muted">+ {goal.extraProjectsCount} مشاريع</span>
            )}
          </div>
        </Card>

        
        <div className="goals-split">
          
          <Card className="goals-split-card">
            <div className="goals-split-card__header">
              <h3 className="goals-split-card__title">المشاريع</h3>
              <button type="button" className="goals-link-btn">
                <Plus size={14} strokeWidth={2.5} />
                ربط مشروع
              </button>
            </div>
            <div className="goals-row-list">
              {goal.projectsList.map((project) => (
                <div key={project.id} className="goals-row">
                  <div className="goals-row__main">
                    <span className="goals-row__title">{project.title}</span>
                    <span className="goals-row__subtitle">{project.subtitle}</span>
                  </div>
                  <div className="goals-row__middle">
                    <Badge
                      variant={goalStatusVariant[project.status]}
                      icon={<span className="tenants-status-dot" />}
                    >
                      {project.statusLabel}
                    </Badge>
                    <ProgressBar
                      value={project.progress}
                      tone={goalStatusVariant[project.status]}
                      className="goals-row__bar"
                    />
                    <span className="goals-row__pct">{project.progress}%</span>
                  </div>
                  <button type="button" className="tenants-table__nav-btn" aria-label="عرض المشروع">
                    <ChevronLeft size={14} />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          
          <Card className="goals-split-card">
            <div className="goals-split-card__header">
              <h3 className="goals-split-card__title">المخرجات</h3>
              <span className="goals-count-badge">{goal.outputs.length}</span>
            </div>
            <div className="goals-row-list">
              {goal.outputs.map((output) => (
                <div key={output.id} className="goals-row">
                  <div className="goals-row__main">
                    <span className="goals-row__title">{output.title}</span>
                    <span className="goals-row__subtitle">{output.subtitle}</span>
                  </div>
                  <button type="button" className="tenants-table__nav-btn" aria-label="عرض المخرج">
                    <ChevronLeft size={14} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
