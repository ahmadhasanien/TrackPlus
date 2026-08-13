export type GoalStatus = 'on-track' | 'delayed' | 'at-risk';

export interface GoalProjectTag {
  id: string;
  name: string;
  color: string;
}

export interface GoalRow {
  id: string;
  title: string;
  kpi: string;
  dateRange: string;
  status: GoalStatus;
  statusLabel: string;
  progress: number;
  progressTone: 'success' | 'warning' | 'danger';
  projects: GoalProjectTag[];
  extraProjectsCount: number;
}

export const goalStatusVariant: Record<GoalStatus, 'success' | 'warning' | 'danger'> = {
  'on-track': 'success',
  delayed: 'warning',
  'at-risk': 'danger',
};

export type GoalFilterId = 'all' | 'on-track' | 'delayed' | 'at-risk';

export const goalFilterLabels: Record<GoalFilterId, string> = {
  all: 'الكل',
  'on-track': 'على المسار',
  delayed: 'متأخر',
  'at-risk': 'متعثر',
};

export const goalsList: GoalRow[] = [
  {
    id: 'goal-1',
    title: 'تطوير البنية التحتية الرقمية',
    kpi: 'نسبة الخدمات المرقمنة',
    dateRange: '2025 - 2026',
    status: 'at-risk',
    statusLabel: 'متعثر',
    progress: 77,
    progressTone: 'success',
    projects: [
      { id: 'p1', name: 'نظام الحلول', color: '#50B055' },
      { id: 'p2', name: 'منصة البيع الرقمي - شركة X', color: '#54B9A4' },
    ],
    extraProjectsCount: 3,
  },
  {
    id: 'goal-2',
    title: 'رفع نسبة الخدمات الحكومية الرقمية',
    kpi: 'من 5 أيام إلى يوم واحد',
    dateRange: '2025 - 2026',
    status: 'on-track',
    statusLabel: 'على المسار',
    progress: 34,
    progressTone: 'danger',
    projects: [
      { id: 'p3', name: 'نظام التذاكر - شركة A', color: '#F79009' },
      { id: 'p4', name: 'أتمتة سير العمل - داخلي', color: '#2E90FA' },
    ],
    extraProjectsCount: 7,
  },
  {
    id: 'goal-3',
    title: 'تحقيق اعتماد الأمن السيبراني ISO 27001',
    kpi: 'من 5 أيام إلى يوم واحد',
    dateRange: '2025 - 2026',
    status: 'on-track',
    statusLabel: 'على المسار',
    progress: 40,
    progressTone: 'warning',
    projects: [
      { id: 'p5', name: 'مركز العمليات الأمنية', color: '#2E90FA' },
      { id: 'p6', name: 'برنامج التوعية الأمنية', color: '#17B26A' },
    ],
    extraProjectsCount: 2,
  },
];

export interface GoalOutputItem {
  id: string;
  title: string;
  subtitle: string;
}

export interface GoalProjectItem {
  id: string;
  title: string;
  subtitle: string;
  progress: number;
  status: GoalStatus;
  statusLabel: string;
}

export interface GoalDetail extends GoalRow {
  breadcrumbLabel: string;
  description: string;
  lastUpdatedLabel: string;
  linkedProjectsCount: number;
  delayedProjectsCount: number;
  avgProjectsProgress: number;
  openRisks: { high: number; medium: number; low: number };
  outputs: GoalOutputItem[];
  projectsList: GoalProjectItem[];
}

export const goalDetails: Record<string, GoalDetail> = {
  'goal-1': {
    ...goalsList[0],
    progress: 34,
    progressTone: 'success' as const,
    breadcrumbLabel: 'تطوير البنية التحتية الرقمية',
    description: 'نظام تقني متكامل لإدارة المحتوى الرقمي مع واجهات متعددة',
    lastUpdatedLabel: 'اليوم',
    linkedProjectsCount: 4,
    delayedProjectsCount: 2,
    avgProjectsProgress: 58,
    openRisks: { high: 3, medium: 5, low: 4 },
    outputs: [
      { id: 'o1', title: 'وثيقة البنية التقنية', subtitle: 'نظام إدارة المحتوى' },
      { id: 'o2', title: 'تقرير الاختبار الأول', subtitle: 'منصة الخدمات الرقمية' },
      { id: 'o3', title: 'نماذج التصميم', subtitle: 'بوابة الموظفين' },
    ],
    projectsList: [
      {
        id: 'p1', title: 'نظام إدارة المحتوى المتقدم', subtitle: 'شركة الحلول التقنية',
        progress: 50, status: 'on-track', statusLabel: 'على المسار',
      },
      {
        id: 'p2', title: 'منصة الخدمات الرقمية', subtitle: 'أرامكو',
        progress: 20, status: 'delayed', statusLabel: 'متأخر',
      },
      {
        id: 'p3', title: 'تطوير بوابة الموظفين', subtitle: 'وزارة التعليم',
        progress: 10, status: 'at-risk', statusLabel: 'متعثر',
      },
    ],
  },
  'goal-2': {
    ...goalsList[1],
    breadcrumbLabel: 'رفع نسبة الخدمات الحكومية الرقمية',
    description: 'برنامج لتقليص زمن إنجاز الخدمات الحكومية الرقمية وتحسين تجربة المستفيدين',
    lastUpdatedLabel: 'أمس',
    linkedProjectsCount: 3,
    delayedProjectsCount: 2,
    avgProjectsProgress: 34,
    openRisks: { high: 2, medium: 3, low: 1 },
    outputs: [
      { id: 'o4', title: 'دليل إجراءات الخدمة', subtitle: 'نظام التذاكر' },
      { id: 'o5', title: 'تقرير قياس زمن الإنجاز', subtitle: 'أتمتة سير العمل' },
    ],
    projectsList: [
      {
        id: 'p3', title: 'نظام التذاكر الموحد', subtitle: 'شركة A',
        progress: 40, status: 'delayed', statusLabel: 'متأخر',
      },
      {
        id: 'p4', title: 'أتمتة سير العمل', subtitle: 'إدارة تقنية المعلومات',
        progress: 22, status: 'at-risk', statusLabel: 'متعثر',
      },
    ],
  },
  'goal-3': {
    ...goalsList[2],
    breadcrumbLabel: 'تحقيق اعتماد الأمن السيبراني ISO 27001',
    description: 'خطة الوصول لاعتماد ISO 27001 عبر تعزيز الضوابط الأمنية ورفع الوعي الداخلي',
    lastUpdatedLabel: 'قبل يومين',
    linkedProjectsCount: 2,
    delayedProjectsCount: 1,
    avgProjectsProgress: 40,
    openRisks: { high: 1, medium: 2, low: 2 },
    outputs: [
      { id: 'o6', title: 'سياسة أمن المعلومات', subtitle: 'مركز العمليات الأمنية' },
    ],
    projectsList: [
      {
        id: 'p5', title: 'مركز العمليات الأمنية', subtitle: 'شركة الحلول التقنية',
        progress: 55, status: 'on-track', statusLabel: 'على المسار',
      },
      {
        id: 'p6', title: 'برنامج التوعية الأمنية', subtitle: 'إدارة الموارد البشرية',
        progress: 25, status: 'delayed', statusLabel: 'متأخر',
      },
    ],
  },
};
