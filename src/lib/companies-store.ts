import { useSyncExternalStore } from "react";
export type ProjectStatus = 'on_track' | 'delayed' | 'stalled' | 'completed';

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
};

export type DepartmentProject = {
  id: string;
  name: string;
  progress: number;
  status: ProjectStatus;
};

export type Company = {
  id: string;
  name: string;
  logoText: string;
  description: string;
  contracts: number;
  progress: number;
  status: ProjectStatus;
  registration: string;
  performance: string;
  sector: string;
  owner: string;
  phone: string;
  email: string;
  projectsCount: number;
  outputsCount: number;
  team: TeamMember[];
  projects: DepartmentProject[];
};

const baseProjects: DepartmentProject[] = [
  { id: "cp1", name: "إطلاق حملة تسويقية جديدة", progress: 20, status: "delayed" },
  { id: "cp2", name: "تحسين واجهة المستخدم لموقع الويب", progress: 10, status: "stalled" },
  { id: "cp3", name: "تحسين واجهة المستخدم لموقع الويب", progress: 100, status: "completed" },
  { id: "cp4", name: "تطوير تطبيق موبايل", progress: 50, status: "on_track" },
  { id: "cp5", name: "إطلاق حملة تسويقية جديدة", progress: 100, status: "completed" },
  { id: "cp6", name: "تطوير تطبيق موبايل", progress: 20, status: "stalled" },
  { id: "cp7", name: "تحديث قاعدة بيانات المستخدمين", progress: 70, status: "on_track" },
];

const baseTeam: TeamMember[] = [
  {
    id: "ct1",
    name: "سارة محمد",
    role: "مدير المشروع",
    email: "salwa@aljoud.com",
    phone: "+966 50 4567 123",
  },
];

function makeCompany(
  partial: Partial<Company> & { id: string; name: string; logoText: string },
): Company {
  return {
    description: "وصف تفصيلي للشركة",
    contracts: 10,
    progress: 50,
    status: "on_track",
    registration: "1010XXXXXX",
    performance: "ممتاز",
    sector: "خدمات تقنية",
    owner: "أحمد العمري",
    phone: "+966 50 4567 123",
    email: "salwa@aljoud.com",
    projectsCount: 12,
    outputsCount: 28,
    team: baseTeam,
    projects: baseProjects,
    ...partial,
  } as Company;
}

let companies: Company[] = [
  makeCompany({
    id: "jodayn",
    name: "شركة جودين",
    logoText: "جودين",
    description: "متخصصة في تطوير الأنظمة وتكامل الحلول التقنية للقطاع الحكومي",
    contracts: 10,
    progress: 80,
  }),
  makeCompany({ id: "nafith", name: "شركة نافذ للتقنية", logoText: "نافذ", contracts: 12, status: "delayed" }),
  makeCompany({ id: "rawasi", name: "مجموعة رواسي للحلول", logoText: "رواسي", contracts: 8 }),
  makeCompany({ id: "masar", name: "شركة مسار الرقمي", logoText: "مسار", contracts: 3 }),
  makeCompany({ id: "dherwa", name: "شركة ذروة للبرمجيات", logoText: "ذروة", contracts: 4, status: "delayed" }),
  makeCompany({ id: "wasl", name: "مؤسسة وصل التقنية", logoText: "وصل", contracts: 2, status: "delayed" }),
  makeCompany({ id: "manara", name: "شركة منارة للأمن السيبراني", logoText: "منارة", contracts: 11 }),
  makeCompany({ id: "itqan", name: "مجموعة إتقان للبنية التحتية", logoText: "إتقان", contracts: 9 }),
  makeCompany({ id: "ufuq", name: "شركة أفق للذكاء الاصطناعي", logoText: "أفق", contracts: 5 }),
];

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useCompanies() {
  return useSyncExternalStore(
    subscribe,
    () => companies,
    () => companies,
  );
}

export function useCompany(id: string) {
  return useCompanies().find((c) => c.id === id);
}

export function addCompany(input: {
  name: string;
  description: string;
  owner: string;
  team: TeamMember[];
  projects: DepartmentProject[];
}) {
  const company = makeCompany({
    id: `com-${Date.now()}`,
    name: input.name,
    logoText: input.name.replace("شركة ", "").slice(0, 6),
    description: input.description || "وصف تفصيلي للشركة",
    owner: input.owner || "أحمد العمري",
    team: input.team,
    projects: input.projects,
    projectsCount: input.projects.length,
    contracts: 0,
    progress: 0,
  });
  companies = [company, ...companies];
  emit();
  return company;
}

export function updateCompany(id: string, patch: Partial<Company>) {
  companies = companies.map((c) => (c.id === id ? { ...c, ...patch } : c));
  emit();
}

export function deleteCompany(id: string) {
  companies = companies.filter((c) => c.id !== id);
  emit();
}
